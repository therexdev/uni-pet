import { describe, it, expect } from 'vitest';
import { createState, transition, effectivePet, normalizeOwner } from '../src/lib/playground';
import { DAY, WEEK, emptyOwner } from '../src/lib/types';
const now = 1700000000000,
  wallet = 'test-human';
describe('Playground rules', () => {
  it('is isolated from the input and awards useful care', () => {
    const s = createState(now);
    const n = transition(s, wallet, { kind: 'feed' }, now);
    expect(s.view.pet.nourishment).toBe(64);
    expect(n.view.pet.nourishment).toBe(82);
    expect(n.owners[wallet].score).toBe(10);
  });
  it('caps affection and prevents rapid repeats', () => {
    let s = transition(createState(now), wallet, { kind: 'comfort' }, now);
    expect(() => transition(s, wallet, { kind: 'comfort' }, now + 1)).toThrow('10 seconds');
    for (let i = 1; i < 15; i++) s = transition(s, wallet, { kind: 'comfort' }, now + i * 11000);
    expect(s.owners[wallet].score).toBe(40);
    expect(s.owners[wallet].care_days).toBe(1);
  });
  it('counts distinct days, not repeated transactions', () => {
    let s = createState(now);
    for (let i = 0; i < 3; i++) s = transition(s, wallet, { kind: 'comfort' }, now + i * DAY);
    expect(s.owners[wallet].lifetime_days).toBe(3);
  });
  it('preserves partial elapsed hours', () => {
    const p = createState(now).view.pet;
    const halfway = effectivePet(p, now + 1800000);
    expect(effectivePet(halfway, now + 3600000).nourishment).toBe(62);
  });
  it('does not kill the pet after a long absence', () => {
    const p = effectivePet(createState(now).view.pet, now + 365 * DAY);
    expect(p.nourishment).toBe(0);
    expect(p.energy).toBe(100);
    expect(p.name).toBe('Uni');
  });
  it('resets only seasonal friendship counters', () => {
    const o = emptyOwner(wallet, now);
    o.score = 30;
    o.lifetime_days = 12;
    o.berries = 7;
    const n = normalizeOwner(o, now + WEEK);
    expect(n.score).toBe(0);
    expect(n.lifetime_days).toBe(12);
    expect(n.berries).toBe(7);
  });
  it('consumes a crafted treat when contributing', () => {
    let s = createState(now);
    s = transition(s, wallet, { kind: 'craft' }, now);
    s = transition(s, wallet, { kind: 'contribute' }, now + 11000);
    expect(s.owners[wallet].berries).toBe(0);
    expect(s.owners[wallet].treats).toBe(0);
    expect(s.view.pet.project).toBe(1);
    expect(() => transition(s, wallet, { kind: 'contribute' }, now + 22000)).toThrow('treat');
  });
  it('rejects early harvest and allows a watered crop at four hours', () => {
    let s = transition(createState(now), wallet, { kind: 'plant', slot: 0 }, now);
    s = transition(s, wallet, { kind: 'water', slot: 0 }, now + 11000);
    expect(() => transition(s, wallet, { kind: 'harvest', slot: 0 }, now + 22000)).toThrow('time');
    s = transition(s, wallet, { kind: 'harvest', slot: 0 }, now + 14400000);
    expect(s.owners[wallet].berries).toBe(6);
  });
  it('has stable leaderboard ties and only one entry per wallet', () => {
    let s = createState(now);
    s = transition(s, 'a', { kind: 'comfort' }, now);
    s = transition(s, 'b', { kind: 'comfort' }, now + 11000);
    expect(s.view.board.entries.map((e) => e.address)).toEqual(['a', 'b']);
    s = transition(s, 'b', { kind: 'comfort' }, now + 22000);
    expect(s.view.board.entries[0].address).toBe('b');
    expect(s.view.board.entries).toHaveLength(2);
  });
  it('honors minimum point protection without altering state', () => {
    const s = createState(now);
    expect(() => transition(s, wallet, { kind: 'comfort', min_points: 20 }, now)).toThrow(
      'changed',
    );
    expect(s.view.events).toHaveLength(0);
  });
});
