import { DAY, WEEK, emptyOwner } from './types';
import type { Pet, Owner, View, Action, Gateway, Board, Entry } from './types';
interface State {
  view: View;
  owners: Record<string, Owner>;
  history: Record<number, Board>;
  claims: string[];
  ranks?: Record<number, Entry[]>;
}
const key = 'uni-pet-playground-v1';
export function createState(now = Date.now()): State {
  return {
    view: {
      pet: {
        name: 'Uni',
        born: String(now),
        updated: String(now),
        nourishment: 64,
        happiness: 72,
        cleanliness: 80,
        energy: 85,
        affection: 20,
        curiosity: 25,
        playfulness: 30,
        mischief: 10,
        actions: 0,
        project: 0,
        level: 1,
        votes: [0, 0, 0],
        updated_block: String(Math.floor(now / 3000)),
        caretakers: 0,
        wellness: 80,
        balance_care: 0,
      },
      board: { week: Math.floor(now / WEEK), entries: [], settled: false },
      events: [],
      time: String(now),
    },
    owners: {},
    history: {},
    claims: [],
  };
}
export function effectivePet(pet: Pet, now: number, block = Math.floor(now / 3000)): Pet {
  const p = { ...pet, votes: [...pet.votes] },
    hours = Math.max(
      0,
      Math.floor((block - Number(p.updated_block ?? Math.floor(Number(p.updated) / 3000))) / 1200),
    );
  p.nourishment = Math.max(0, p.nourishment - hours * 2);
  p.happiness = Math.max(0, p.happiness - hours);
  p.cleanliness = Math.max(0, p.cleanliness - hours);
  p.energy = Math.min(100, p.energy + hours * 3);
  p.updated = String(Number(p.updated) + hours * 3600000);
  p.updated_block = String(
    Number(p.updated_block ?? Math.floor(Number(pet.updated) / 3000)) + hours * 1200,
  );
  p.wellness = Math.max(0, (p.wellness ?? 80) - hours);
  p.balance_care ??= 0;
  p.caretakers ??= 0;
  return p;
}
export function normalizeOwner(o: Owner, now: number): Owner {
  const n = structuredClone(o);
  if (n.week !== Math.floor(now / WEEK)) {
    n.week = Math.floor(now / WEEK);
    n.score = 0;
    n.care_days = 0;
    n.play_points = 0;
    n.comfort_points = 0;
    n.feed_points = 0;
    n.voted = false;
  }
  if (n.day !== Math.floor(now / DAY)) {
    n.day = Math.floor(now / DAY);
    n.daily_actions = 0;
    n.daily_points = 0;
    n.contributions = 0;
  }
  return n;
}
export function transition(input: State, address: string, a: Action, now = Date.now()): State {
  const s = structuredClone(input),
    p = effectivePet(s.view.pet, now),
    o = normalizeOwner(s.owners[address] || emptyOwner(address, now), now),
    week = Math.floor(now / WEEK);
  const fail = (m: string): never => {
    throw new Error(m);
  };
  if (!address) fail('Connect first.');
  if (now < Number(o.last_action) + 10000) fail('Give Uni a moment. Try again in 10 seconds.');
  if (o.daily_actions >= 24) fail('You have finished today’s 24 activities. Come back tomorrow.');
  if (s.view.board.week !== week) {
    s.history[s.view.board.week] = { ...s.view.board, settled: true };
    s.view.board = { week, entries: [], settled: false };
  }
  let points = 0,
    penalty = 0;
  const slot = a.slot ?? 0;
  if (['plant', 'water', 'harvest'].includes(a.kind) && (slot < 0 || slot >= 3))
    fail('Choose a valid plot.');
  const plot = o.plots[slot];
  if (['feed', 'play', 'clean', 'comfort'].includes(a.kind)) {
    if (a.kind === 'feed') {
      if (p.nourishment >= 95) fail('Uni is full. Try another activity.');
      p.nourishment = Math.min(100, p.nourishment + 18);
      p.affection = Math.min(100, p.affection + 1);
      p.wellness = Math.max(0, p.wellness - 8);
      p.mischief = Math.min(100, p.mischief + 4);
    }
    if (a.kind === 'play') {
      if (p.energy < 10) fail('Uni needs a little rest first.');
      p.energy -= 10;
      p.happiness = Math.min(100, p.happiness + 15);
      p.playfulness = Math.min(100, p.playfulness + 1);
      p.mischief = Math.min(100, p.mischief + 8);
    }
    if (a.kind === 'clean') {
      if (p.cleanliness >= 95) fail('Already squeaky clean!');
      p.cleanliness = Math.min(100, p.cleanliness + 20);
    }
    if (a.kind === 'comfort') {
      p.happiness = Math.min(100, p.happiness + 8);
      p.affection = Math.min(100, p.affection + 1);
    }
    const meter =
      a.kind === 'feed'
        ? effectivePet(s.view.pet, now).nourishment
        : a.kind === 'clean'
          ? effectivePet(s.view.pet, now).cleanliness
          : effectivePet(s.view.pet, now).happiness;
    points = meter < 70 ? 10 : 4;
  } else if (a.kind === 'healthy' || a.kind === 'discipline') {
    if (a.kind === 'healthy') {
      if (p.nourishment >= 95 && p.wellness >= 90) fail('No healthy meal needed.');
      p.nourishment = Math.min(100, p.nourishment + 12);
      p.wellness = Math.min(100, p.wellness + 18);
    } else {
      if (p.mischief < 20) fail('Uni doesn’t need gentle guidance right now.');
      p.mischief = Math.max(0, p.mischief - 20);
    }
    p.happiness = Math.max(0, p.happiness - 4);
    penalty = Math.min(3, o.score);
    o.score -= penalty;
    p.balance_care = Math.min(100, p.balance_care + 1);
  } else if (a.kind === 'plant') {
    if (Number(plot.planted) > 0) fail('This plot is already planted.');
    plot.planted = String(now);
    plot.watered = false;
    plot.crop = 1;
  } else if (a.kind === 'water') {
    if (!Number(plot.planted) || plot.watered)
      fail('Plant a seed first, or wait for your harvest.');
    plot.watered = true;
  } else if (a.kind === 'harvest') {
    if (!Number(plot.planted) || now < Number(plot.planted) + (plot.watered ? 4 : 8) * 3600000)
      fail('Your berries need a little more time.');
    if (o.berries > 9997) fail('Berry storage full');
    o.berries += 3;
    o.plots[slot] = { planted: '0', watered: false, crop: 0 };
  } else if (a.kind === 'craft') {
    if (o.berries < 3) fail('You need 3 berries.');
    if (o.treats >= 1000) fail('Treat storage full');
    o.berries -= 3;
    o.treats++;
  } else if (a.kind === 'contribute') {
    if (o.contributions >= 2) fail('You have helped twice today. Let others join in!');
    if (o.treats < 1) fail('Make a berry treat in the garden first.');
    o.treats--;
    o.contributions++;
    p.project++;

    points = 8;
  } else if (a.kind === 'vote') {
    if (o.voted) fail('Your vote is already counted this week.');
    if (o.care_days < 1) fail('Care for Uni first to join the vote.');
    if ((a.choice ?? 0) > 2 || (a.choice ?? 0) < 0) fail('Invalid destination.');
    o.voted = true;
    p.votes[a.choice ?? 0]++;
  } else if (a.kind === 'adventure') {
    if (Number(o.adventure_end)) fail('Your adventure is already underway.');
    o.adventure_end = String(now + 3600000);
  } else if (a.kind === 'return') {
    if (!Number(o.adventure_end) || now < Number(o.adventure_end))
      fail('Your adventure is not ready yet.');
    o.adventure_end = '0';
    if (o.berries > 9998) fail('Berry storage full');
    o.berries += 2;
    p.curiosity = Math.min(100, p.curiosity + 1);
  } else fail('Unknown action.');
  points = Math.min(points, Math.max(0, 40 - o.daily_points));
  if (points < (a.min_points ?? 0)) fail('Uni’s needs changed. Please try another action.');
  if (points && o.daily_points === 0) {
    o.care_days++;
    o.lifetime_days++;
  }
  o.daily_points += points;
  o.score += points;
  o.daily_actions++;
  o.last_action = String(now);
  if (a.kind === 'play') o.play_points += points;
  if (a.kind === 'comfort') o.comfort_points += points;
  if (a.kind === 'feed') o.feed_points += points;
  if (p.wellness >= 50 && p.mischief <= 60)
    p.level = Math.max(
      p.level,
      1 + Math.min(Math.floor(p.project / 100), Math.floor(p.balance_care / 5)),
    );
  if (!s.owners[address]) p.caretakers++;
  p.actions++;
  s.view.pet = p;
  s.owners[address] = o;
  p.caretakers = Object.keys(s.owners).length;
  if (points || penalty) {
    s.ranks ??= {};
    const prior =
      s.ranks[week] ||
      Object.values(s.owners)
        .filter((x) => x.week === week && x.score > 0)
        .map((x) => ({
          address: x.address,
          score: x.score,
          sequence:
            s.view.board.entries.find((e) => e.address === x.address)?.sequence ?? p.actions,
        }));
    const entries = prior.filter((e) => e.address !== address);
    entries.push({ address, score: o.score, sequence: p.actions });
    entries.sort((a, b) => b.score - a.score || a.sequence - b.sequence);
    s.ranks[week] = entries;
    s.view.board.entries = entries.slice(0, 20);
  }
  s.view.events.unshift({
    sequence: p.actions,
    actor: address,
    kind: a.kind,
    points,
    penalty,
    time: String(now),
  });
  s.view.events = s.view.events.slice(0, 20);
  s.view.time = String(now);
  return s;
}
export class Playground implements Gateway {
  state: State;
  constructor() {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || 'null');
      this.state = saved?.view?.pet?.name === 'Uni' && saved.owners ? saved : createState();
    } catch {
      this.state = createState();
    }
  }
  save() {
    localStorage.setItem(key, JSON.stringify(this.state));
  }
  async read(address?: string) {
    const stored = JSON.parse(localStorage.getItem(key) || 'null');
    if (stored?.view?.pet?.name === 'Uni') this.state = stored;
    const now = Date.now();
    const view = structuredClone(this.state.view);
    view.pet = effectivePet(view.pet, now);
    view.time = String(now);
    view.block_height = String(Math.floor(now / 3000));
    view.pet.caretakers = Object.keys(this.state.owners).length;
    if (view.board.week !== Math.floor(now / WEEK))
      view.board = { week: Math.floor(now / WEEK), entries: [], settled: false };
    return {
      view,
      owner: address
        ? normalizeOwner(this.state.owners[address] || emptyOwner(address, now), now)
        : null,
    };
  }
  async connect() {
    return 'playground-you';
  }
  async act(address: string, action: Action) {
    this.state = transition(this.state, address, action);
    this.save();
    return `playground-${this.state.view.pet.actions}`;
  }
  async settle(week: number) {
    if (week >= Math.floor(Date.now() / WEEK)) throw new Error('This week is still open.');
    const board = this.state.history[week] || this.state.view.board;
    if (board.week !== week) throw new Error('No recorded week.');
    this.state.history[week] = { ...board, settled: true };
    this.save();
    return 'playground-settled';
  }
  async rewardStatus(address: string, week: number) {
    const o = this.state.owners[address];
    return {
      claimed: this.state.claims.includes(`${address}:${week}`),
      eligible: !!o && o.week === week && o.care_days >= 3,
    };
  }
  async claim(address: string, week: number) {
    const status = await this.rewardStatus(address, week);
    if (status.claimed || !status.eligible)
      throw new Error('Care on 3 different days to earn this badge.');
    this.state.claims.push(`${address}:${week}`);
    this.save();
    return 'playground-badge';
  }
  reset() {
    this.state = createState();
    this.save();
  }
}
