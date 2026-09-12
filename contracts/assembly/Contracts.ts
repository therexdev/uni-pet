import { System, Storage, Protobuf, Base58, authority } from '@koinos/sdk-as';
import { contracts as c } from './proto/contracts';
const HOUR: u64 = 3600000,
  DAY: u64 = 86400000,
  WEEK: u64 = 604800000;
function now(): u64 {
  const field = System.getBlockField('header.timestamp');
  System.require(field != null, 'Block time unavailable');
  return field!.uint64_value;
}
function height(): u64 {
  const field = System.getBlockField('header.height');
  System.require(field != null, 'Block height unavailable');
  return field!.uint64_value;
}
function low(value: u32, change: u32): u32 {
  return value > change ? value - change : 0;
}
function cap(value: u32): u32 {
  return value > 100 ? 100 : value;
}
export class Contracts {
  constructor() {
    // The bounded 20-event log and leaderboard exceed the SDK's 1 KiB default.
    System.setSystemBufferSize(16384);
  }
  authorize(args: authority.authorize_arguments): authority.authorize_result {
    return new authority.authorize_result(false);
  }
  id: Uint8Array = System.getContractId();
  pets: Storage.Obj<c.pet> = new Storage.Obj(this.id, 0, c.pet.decode, c.pet.encode);
  owners: Storage.Map<string, c.owner> = new Storage.Map(
    this.id,
    1,
    c.owner.decode,
    c.owner.encode,
  );
  boards: Storage.Map<string, c.board> = new Storage.Map(
    this.id,
    2,
    c.board.decode,
    c.board.encode,
  );
  logs: Storage.Obj<c.log> = new Storage.Obj(this.id, 3, c.log.decode, c.log.encode);
  periods: Storage.Map<string, c.period> = new Storage.Map(
    this.id,
    4,
    c.period.decode,
    c.period.encode,
  );
  ranks: Storage.Map<string, c.entry> = new Storage.Map(this.id, 5, c.entry.decode, c.entry.encode);
  rankKey(e: c.entry): string {
    let score = (4000000000 - e.score).toString();
    let sequence = e.sequence.toString();
    while (score.length < 10) score = '0' + score;
    while (sequence.length < 10) sequence = '0' + sequence;
    return score + ':' + sequence;
  }
  initialize(args: c.initialize_arguments): c.initialize_result {
    System.require(
      System.checkAuthority(authority.authorization_type.contract_call, this.id),
      'Deployment authority required',
    );
    System.require(this.pets.get() == null, 'Already initialized');
    const p = new c.pet();
    p.name = 'Uni';
    p.born = now();
    p.updated = p.born;
    p.updated_block = height();
    p.wellness = 80;
    p.nourishment = 64;
    p.happiness = 72;
    p.cleanliness = 80;
    p.energy = 85;
    p.affection = 20;
    p.curiosity = 25;
    p.playfulness = 30;
    p.mischief = 10;
    p.level = 1;
    p.votes = [0, 0, 0];
    this.pets.put(p);
    this.logs.put(new c.log());
    return new c.initialize_result(true);
  }
  effective(t: u64): c.pet {
    const found = this.pets.get();
    System.require(found != null, 'Pet not initialized');
    const p = found!;
    const h = height();
    const elapsed = h > p.updated_block ? (h - p.updated_block) / 1200 : 0;
    const hours = <u32>(elapsed > 100 ? 100 : elapsed);
    p.nourishment = low(p.nourishment, hours * 2);
    p.happiness = low(p.happiness, hours);
    p.cleanliness = low(p.cleanliness, hours);
    p.energy = cap(p.energy + hours * 3);
    p.wellness = low(p.wellness, hours);
    p.updated_block += elapsed * 1200;
    p.updated += elapsed * HOUR;
    return p;
  }
  readOwner(address: string, t: u64): c.owner {
    System.require(address.length >= 25 && address.length <= 40, 'Invalid address');
    const a = Base58.decode(address);
    System.require(a.length == 25, 'Invalid address');
    const found = this.owners.get(address);
    let o: c.owner;
    if (found == null) {
      o = new c.owner();
      o.address = address;
      o.week = <u32>(t / WEEK);
      o.day = <u32>(t / DAY);
      o.berries = 3;
      o.plots = [new c.plot(), new c.plot(), new c.plot()];
    } else {
      o = found!;
    }
    if (o.week != <u32>(t / WEEK)) {
      o.week = <u32>(t / WEEK);
      o.score = 0;
      o.care_days = 0;
      o.play_points = 0;
      o.comfort_points = 0;
      o.feed_points = 0;
      o.voted = false;
    }
    if (o.day != <u32>(t / DAY)) {
      o.day = <u32>(t / DAY);
      o.daily_actions = 0;
      o.daily_points = 0;
      o.contributions = 0;
    }
    return o;
  }
  get_view(args: c.get_view_arguments): c.get_view_result {
    const t = now();
    const v = new c.view();
    v.pet = this.effective(t);
    v.board = this.get_board(new c.get_board_arguments(<u32>(t / WEEK))).board;
    const l = this.logs.get();
    v.events = l ? l!.events : [];
    v.time = t;
    v.block_height = height();
    return new c.get_view_result(v);
  }
  get_owner(args: c.get_owner_arguments): c.get_owner_result {
    return new c.get_owner_result(this.readOwner(args.address!, now()));
  }
  get_period(args: c.get_period_arguments): c.get_period_result {
    System.require(args.address!.length <= 40, 'Invalid address');
    const p = this.periods.get(args.week.toString() + ':' + args.address!);
    return new c.get_period_result(p ? p! : new c.period());
  }
  get_board(args: c.get_board_arguments): c.get_board_result {
    const found = this.boards.get(args.week.toString());
    return new c.get_board_result(found ? found! : new c.board(args.week, [], false));
  }
  settle(args: c.settle_arguments): c.settle_result {
    System.require(args.week < <u32>(now() / WEEK), 'Week still open');
    const b = this.get_board(new c.get_board_arguments(args.week)).board!;
    System.require(b.entries.length > 0, 'No activity for that week');
    b.settled = true;
    this.boards.put(args.week.toString(), b);
    return new c.settle_result(b);
  }
  act(args: c.act_arguments): c.act_result {
    const t = now();
    const o = this.readOwner(args.address!, t);
    const address = Base58.decode(args.address!);
    System.require(
      System.checkAuthority(authority.authorization_type.contract_call, address),
      'Wallet authorization required',
    );
    System.require(t >= o.last_action + 10000, 'Wait 10 seconds between actions');
    System.require(o.daily_actions < 24, 'Daily activity limit reached');
    const p = this.effective(t);
    const kind = args.kind;
    let points: u32 = 0;
    let penalty: u32 = 0;
    System.require(p.actions < 4000000000, 'Action counter limit');
    if (kind == 'feed' || kind == 'play' || kind == 'clean' || kind == 'comfort') {
      const meter = kind == 'feed' ? p.nourishment : kind == 'clean' ? p.cleanliness : p.happiness;
      if (kind == 'feed') {
        System.require(p.nourishment < 95, 'Uni is full');
        p.nourishment = cap(p.nourishment + 18);
        p.affection = cap(p.affection + 1);
        p.wellness = low(p.wellness, 8);
        p.mischief = cap(p.mischief + 4);
      }
      if (kind == 'play') {
        System.require(p.energy >= 10, 'Uni needs rest');
        p.energy -= 10;
        p.happiness = cap(p.happiness + 15);
        p.playfulness = cap(p.playfulness + 1);
        p.mischief = cap(p.mischief + 8);
      }
      if (kind == 'clean') {
        System.require(p.cleanliness < 95, 'Uni is already clean');
        p.cleanliness = cap(p.cleanliness + 20);
      }
      if (kind == 'comfort') {
        p.happiness = cap(p.happiness + 8);
        p.affection = cap(p.affection + 1);
      }
      points = meter < 70 ? 10 : 4;
    } else if (kind == 'healthy' || kind == 'discipline') {
      if (kind == 'healthy') {
        System.require(p.nourishment < 95 || p.wellness < 90, 'No healthy meal needed');
        p.nourishment = cap(p.nourishment + 12);
        p.wellness = cap(p.wellness + 18);
      } else {
        System.require(p.mischief >= 20, 'No gentle guidance needed');
        p.mischief = low(p.mischief, 20);
      }
      p.happiness = low(p.happiness, 4);
      penalty = o.score < 3 ? o.score : 3;
      o.score -= penalty;
      p.balance_care = cap(p.balance_care + 1);
    } else if (kind == 'plant' || kind == 'water' || kind == 'harvest') {
      System.require(args.slot < 3, 'Invalid plot');
      const plot = o.plots[args.slot];
      if (kind == 'plant') {
        System.require(plot.planted == 0, 'Plot already planted');
        plot.planted = t;
        plot.watered = false;
        plot.crop = 1;
      }
      if (kind == 'water') {
        System.require(plot.planted > 0 && !plot.watered, 'Plot does not need water');
        plot.watered = true;
      }
      if (kind == 'harvest') {
        System.require(
          plot.planted > 0 && t >= plot.planted + (plot.watered ? 4 * HOUR : 8 * HOUR),
          'Crop not ready',
        );
        System.require(o.berries <= 9997, 'Berry storage full');
        o.berries += 3;
        o.plots[args.slot] = new c.plot();
      }
    } else if (kind == 'craft') {
      System.require(o.berries >= 3, 'Need 3 berries');
      System.require(o.treats < 1000, 'Treat storage full');
      o.berries -= 3;
      o.treats++;
    } else if (kind == 'contribute') {
      System.require(o.contributions < 2, 'Daily project limit');
      System.require(o.treats > 0, 'Make a berry treat first');
      System.require(p.project < 4000000000, 'Project limit');
      o.treats--;
      o.contributions++;
      p.project++;

      points = 8;
    } else if (kind == 'vote') {
      System.require(!o.voted, 'Already voted this week');
      System.require(o.care_days >= 1, 'Care for Uni before voting');
      System.require(args.choice < 3, 'Invalid destination');
      System.require(p.votes[args.choice] < 4000000000, 'Vote limit');
      o.voted = true;
      p.votes[args.choice]++;
    } else if (kind == 'adventure') {
      System.require(o.adventure_end == 0, 'Adventure in progress');
      o.adventure_end = t + HOUR;
    } else if (kind == 'return') {
      System.require(o.adventure_end > 0 && t >= o.adventure_end, 'Adventure not ready');
      System.require(o.berries <= 9998, 'Berry storage full');
      o.adventure_end = 0;
      o.berries += 2;
      p.curiosity = cap(p.curiosity + 1);
    } else {
      System.fail('Unknown action');
    }
    points = points > 40 - o.daily_points ? 40 - o.daily_points : points;
    System.require(points >= args.min_points, 'Needs changed; minimum affection not met');
    if (points > 0 && o.daily_points == 0) {
      o.care_days++;
      o.lifetime_days++;
    }
    o.daily_points += points;
    o.score += points;
    o.daily_actions++;
    o.last_action = t;
    if (kind == 'play') o.play_points += points;
    if (kind == 'comfort') o.comfort_points += points;
    if (kind == 'feed') o.feed_points += points;
    const progressLevel = p.project / 100;
    const careLevel = p.balance_care / 5;
    if (p.wellness >= 50 && p.mischief <= 60) {
      const next: u32 = 1 + (progressLevel < careLevel ? progressLevel : careLevel);
      if (next > p.level) p.level = next;
    }
    if (this.owners.get(args.address!) == null) {
      System.require(p.caretakers < 4000000000, 'Family limit');
      p.caretakers++;
    }
    p.actions++;
    this.pets.put(p);
    this.owners.put(args.address!, o);
    this.periods.put(o.week.toString() + ':' + args.address!, new c.period(o.care_days, o.score));
    if (points > 0 || penalty > 0) {
      const board = this.get_board(new c.get_board_arguments(o.week)).board!;
      const index = new Storage.Map<string, c.entry>(
        this.id,
        100 + o.week,
        c.entry.decode,
        c.entry.encode,
      );
      const key = o.week.toString() + ':' + args.address!;
      const previous = this.ranks.get(key);
      if (previous != null) index.remove(this.rankKey(previous!));
      const entry = new c.entry(args.address!, o.score, p.actions);
      index.put(this.rankKey(entry), entry);
      this.ranks.put(key, entry);
      board.entries = index.getManyValues('', 20);
      this.boards.put(o.week.toString(), board);
    }
    const log = this.logs.get()!;
    const event = new c.activity(p.actions, args.address!, kind, points, t, penalty);
    log.events.unshift(event);
    if (log.events.length > 20) log.events.pop();
    this.logs.put(log);
    System.event('unipet.action.v1', Protobuf.encode(event, c.activity.encode), [address]);
    return new c.act_result(points, p.actions);
  }
}
