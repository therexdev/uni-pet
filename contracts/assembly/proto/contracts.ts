import { Writer, Reader } from "as-proto";

export namespace contracts {
  export class pet {
    static encode(message: pet, writer: Writer): void {
      const unique_name_name = message.name;
      if (unique_name_name !== null) {
        writer.uint32(10);
        writer.string(unique_name_name);
      }

      if (message.born != 0) {
        writer.uint32(16);
        writer.uint64(message.born);
      }

      if (message.updated != 0) {
        writer.uint32(24);
        writer.uint64(message.updated);
      }

      if (message.nourishment != 0) {
        writer.uint32(32);
        writer.uint32(message.nourishment);
      }

      if (message.happiness != 0) {
        writer.uint32(40);
        writer.uint32(message.happiness);
      }

      if (message.cleanliness != 0) {
        writer.uint32(48);
        writer.uint32(message.cleanliness);
      }

      if (message.energy != 0) {
        writer.uint32(56);
        writer.uint32(message.energy);
      }

      if (message.affection != 0) {
        writer.uint32(64);
        writer.uint32(message.affection);
      }

      if (message.curiosity != 0) {
        writer.uint32(72);
        writer.uint32(message.curiosity);
      }

      if (message.playfulness != 0) {
        writer.uint32(80);
        writer.uint32(message.playfulness);
      }

      if (message.mischief != 0) {
        writer.uint32(88);
        writer.uint32(message.mischief);
      }

      if (message.actions != 0) {
        writer.uint32(96);
        writer.uint32(message.actions);
      }

      if (message.project != 0) {
        writer.uint32(104);
        writer.uint32(message.project);
      }

      if (message.level != 0) {
        writer.uint32(112);
        writer.uint32(message.level);
      }

      const unique_name_votes = message.votes;
      if (unique_name_votes.length !== 0) {
        for (let i = 0; i < unique_name_votes.length; ++i) {
          writer.uint32(120);
          writer.uint32(unique_name_votes[i]);
        }
      }
    }

    static decode(reader: Reader, length: i32): pet {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new pet();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.name = reader.string();
            break;

          case 2:
            message.born = reader.uint64();
            break;

          case 3:
            message.updated = reader.uint64();
            break;

          case 4:
            message.nourishment = reader.uint32();
            break;

          case 5:
            message.happiness = reader.uint32();
            break;

          case 6:
            message.cleanliness = reader.uint32();
            break;

          case 7:
            message.energy = reader.uint32();
            break;

          case 8:
            message.affection = reader.uint32();
            break;

          case 9:
            message.curiosity = reader.uint32();
            break;

          case 10:
            message.playfulness = reader.uint32();
            break;

          case 11:
            message.mischief = reader.uint32();
            break;

          case 12:
            message.actions = reader.uint32();
            break;

          case 13:
            message.project = reader.uint32();
            break;

          case 14:
            message.level = reader.uint32();
            break;

          case 15:
            message.votes.push(reader.uint32());
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    name: string | null;
    born: u64;
    updated: u64;
    nourishment: u32;
    happiness: u32;
    cleanliness: u32;
    energy: u32;
    affection: u32;
    curiosity: u32;
    playfulness: u32;
    mischief: u32;
    actions: u32;
    project: u32;
    level: u32;
    votes: Array<u32>;

    constructor(
      name: string | null = null,
      born: u64 = 0,
      updated: u64 = 0,
      nourishment: u32 = 0,
      happiness: u32 = 0,
      cleanliness: u32 = 0,
      energy: u32 = 0,
      affection: u32 = 0,
      curiosity: u32 = 0,
      playfulness: u32 = 0,
      mischief: u32 = 0,
      actions: u32 = 0,
      project: u32 = 0,
      level: u32 = 0,
      votes: Array<u32> = []
    ) {
      this.name = name;
      this.born = born;
      this.updated = updated;
      this.nourishment = nourishment;
      this.happiness = happiness;
      this.cleanliness = cleanliness;
      this.energy = energy;
      this.affection = affection;
      this.curiosity = curiosity;
      this.playfulness = playfulness;
      this.mischief = mischief;
      this.actions = actions;
      this.project = project;
      this.level = level;
      this.votes = votes;
    }
  }

  @unmanaged
  export class plot {
    static encode(message: plot, writer: Writer): void {
      if (message.planted != 0) {
        writer.uint32(8);
        writer.uint64(message.planted);
      }

      if (message.watered != false) {
        writer.uint32(16);
        writer.bool(message.watered);
      }

      if (message.crop != 0) {
        writer.uint32(24);
        writer.uint32(message.crop);
      }
    }

    static decode(reader: Reader, length: i32): plot {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new plot();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.planted = reader.uint64();
            break;

          case 2:
            message.watered = reader.bool();
            break;

          case 3:
            message.crop = reader.uint32();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    planted: u64;
    watered: bool;
    crop: u32;

    constructor(planted: u64 = 0, watered: bool = false, crop: u32 = 0) {
      this.planted = planted;
      this.watered = watered;
      this.crop = crop;
    }
  }

  export class owner {
    static encode(message: owner, writer: Writer): void {
      const unique_name_address = message.address;
      if (unique_name_address !== null) {
        writer.uint32(10);
        writer.string(unique_name_address);
      }

      if (message.week != 0) {
        writer.uint32(16);
        writer.uint32(message.week);
      }

      if (message.score != 0) {
        writer.uint32(24);
        writer.uint32(message.score);
      }

      if (message.day != 0) {
        writer.uint32(32);
        writer.uint32(message.day);
      }

      if (message.daily_points != 0) {
        writer.uint32(40);
        writer.uint32(message.daily_points);
      }

      if (message.daily_actions != 0) {
        writer.uint32(48);
        writer.uint32(message.daily_actions);
      }

      if (message.last_action != 0) {
        writer.uint32(56);
        writer.uint64(message.last_action);
      }

      if (message.care_days != 0) {
        writer.uint32(64);
        writer.uint32(message.care_days);
      }

      if (message.lifetime_days != 0) {
        writer.uint32(72);
        writer.uint32(message.lifetime_days);
      }

      if (message.berries != 0) {
        writer.uint32(80);
        writer.uint32(message.berries);
      }

      if (message.treats != 0) {
        writer.uint32(88);
        writer.uint32(message.treats);
      }

      const unique_name_plots = message.plots;
      for (let i = 0; i < unique_name_plots.length; ++i) {
        writer.uint32(98);
        writer.fork();
        plot.encode(unique_name_plots[i], writer);
        writer.ldelim();
      }

      if (message.adventure_end != 0) {
        writer.uint32(104);
        writer.uint64(message.adventure_end);
      }

      if (message.voted != false) {
        writer.uint32(112);
        writer.bool(message.voted);
      }

      if (message.contributions != 0) {
        writer.uint32(120);
        writer.uint32(message.contributions);
      }

      if (message.play_points != 0) {
        writer.uint32(128);
        writer.uint32(message.play_points);
      }

      if (message.comfort_points != 0) {
        writer.uint32(136);
        writer.uint32(message.comfort_points);
      }

      if (message.feed_points != 0) {
        writer.uint32(144);
        writer.uint32(message.feed_points);
      }
    }

    static decode(reader: Reader, length: i32): owner {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new owner();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.address = reader.string();
            break;

          case 2:
            message.week = reader.uint32();
            break;

          case 3:
            message.score = reader.uint32();
            break;

          case 4:
            message.day = reader.uint32();
            break;

          case 5:
            message.daily_points = reader.uint32();
            break;

          case 6:
            message.daily_actions = reader.uint32();
            break;

          case 7:
            message.last_action = reader.uint64();
            break;

          case 8:
            message.care_days = reader.uint32();
            break;

          case 9:
            message.lifetime_days = reader.uint32();
            break;

          case 10:
            message.berries = reader.uint32();
            break;

          case 11:
            message.treats = reader.uint32();
            break;

          case 12:
            message.plots.push(plot.decode(reader, reader.uint32()));
            break;

          case 13:
            message.adventure_end = reader.uint64();
            break;

          case 14:
            message.voted = reader.bool();
            break;

          case 15:
            message.contributions = reader.uint32();
            break;

          case 16:
            message.play_points = reader.uint32();
            break;

          case 17:
            message.comfort_points = reader.uint32();
            break;

          case 18:
            message.feed_points = reader.uint32();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    address: string | null;
    week: u32;
    score: u32;
    day: u32;
    daily_points: u32;
    daily_actions: u32;
    last_action: u64;
    care_days: u32;
    lifetime_days: u32;
    berries: u32;
    treats: u32;
    plots: Array<plot>;
    adventure_end: u64;
    voted: bool;
    contributions: u32;
    play_points: u32;
    comfort_points: u32;
    feed_points: u32;

    constructor(
      address: string | null = null,
      week: u32 = 0,
      score: u32 = 0,
      day: u32 = 0,
      daily_points: u32 = 0,
      daily_actions: u32 = 0,
      last_action: u64 = 0,
      care_days: u32 = 0,
      lifetime_days: u32 = 0,
      berries: u32 = 0,
      treats: u32 = 0,
      plots: Array<plot> = [],
      adventure_end: u64 = 0,
      voted: bool = false,
      contributions: u32 = 0,
      play_points: u32 = 0,
      comfort_points: u32 = 0,
      feed_points: u32 = 0
    ) {
      this.address = address;
      this.week = week;
      this.score = score;
      this.day = day;
      this.daily_points = daily_points;
      this.daily_actions = daily_actions;
      this.last_action = last_action;
      this.care_days = care_days;
      this.lifetime_days = lifetime_days;
      this.berries = berries;
      this.treats = treats;
      this.plots = plots;
      this.adventure_end = adventure_end;
      this.voted = voted;
      this.contributions = contributions;
      this.play_points = play_points;
      this.comfort_points = comfort_points;
      this.feed_points = feed_points;
    }
  }

  export class entry {
    static encode(message: entry, writer: Writer): void {
      const unique_name_address = message.address;
      if (unique_name_address !== null) {
        writer.uint32(10);
        writer.string(unique_name_address);
      }

      if (message.score != 0) {
        writer.uint32(16);
        writer.uint32(message.score);
      }

      if (message.sequence != 0) {
        writer.uint32(24);
        writer.uint32(message.sequence);
      }
    }

    static decode(reader: Reader, length: i32): entry {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new entry();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.address = reader.string();
            break;

          case 2:
            message.score = reader.uint32();
            break;

          case 3:
            message.sequence = reader.uint32();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    address: string | null;
    score: u32;
    sequence: u32;

    constructor(
      address: string | null = null,
      score: u32 = 0,
      sequence: u32 = 0
    ) {
      this.address = address;
      this.score = score;
      this.sequence = sequence;
    }
  }

  export class board {
    static encode(message: board, writer: Writer): void {
      if (message.week != 0) {
        writer.uint32(8);
        writer.uint32(message.week);
      }

      const unique_name_entries = message.entries;
      for (let i = 0; i < unique_name_entries.length; ++i) {
        writer.uint32(18);
        writer.fork();
        entry.encode(unique_name_entries[i], writer);
        writer.ldelim();
      }

      if (message.settled != false) {
        writer.uint32(24);
        writer.bool(message.settled);
      }
    }

    static decode(reader: Reader, length: i32): board {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new board();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.week = reader.uint32();
            break;

          case 2:
            message.entries.push(entry.decode(reader, reader.uint32()));
            break;

          case 3:
            message.settled = reader.bool();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    week: u32;
    entries: Array<entry>;
    settled: bool;

    constructor(
      week: u32 = 0,
      entries: Array<entry> = [],
      settled: bool = false
    ) {
      this.week = week;
      this.entries = entries;
      this.settled = settled;
    }
  }

  export class activity {
    static encode(message: activity, writer: Writer): void {
      if (message.sequence != 0) {
        writer.uint32(8);
        writer.uint32(message.sequence);
      }

      const unique_name_actor = message.actor;
      if (unique_name_actor !== null) {
        writer.uint32(18);
        writer.string(unique_name_actor);
      }

      const unique_name_kind = message.kind;
      if (unique_name_kind !== null) {
        writer.uint32(26);
        writer.string(unique_name_kind);
      }

      if (message.points != 0) {
        writer.uint32(32);
        writer.uint32(message.points);
      }

      if (message.time != 0) {
        writer.uint32(40);
        writer.uint64(message.time);
      }
    }

    static decode(reader: Reader, length: i32): activity {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new activity();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.sequence = reader.uint32();
            break;

          case 2:
            message.actor = reader.string();
            break;

          case 3:
            message.kind = reader.string();
            break;

          case 4:
            message.points = reader.uint32();
            break;

          case 5:
            message.time = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    sequence: u32;
    actor: string | null;
    kind: string | null;
    points: u32;
    time: u64;

    constructor(
      sequence: u32 = 0,
      actor: string | null = null,
      kind: string | null = null,
      points: u32 = 0,
      time: u64 = 0
    ) {
      this.sequence = sequence;
      this.actor = actor;
      this.kind = kind;
      this.points = points;
      this.time = time;
    }
  }

  export class view {
    static encode(message: view, writer: Writer): void {
      const unique_name_pet = message.pet;
      if (unique_name_pet !== null) {
        writer.uint32(10);
        writer.fork();
        pet.encode(unique_name_pet, writer);
        writer.ldelim();
      }

      const unique_name_board = message.board;
      if (unique_name_board !== null) {
        writer.uint32(18);
        writer.fork();
        board.encode(unique_name_board, writer);
        writer.ldelim();
      }

      const unique_name_events = message.events;
      for (let i = 0; i < unique_name_events.length; ++i) {
        writer.uint32(26);
        writer.fork();
        activity.encode(unique_name_events[i], writer);
        writer.ldelim();
      }

      if (message.time != 0) {
        writer.uint32(32);
        writer.uint64(message.time);
      }
    }

    static decode(reader: Reader, length: i32): view {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new view();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.pet = pet.decode(reader, reader.uint32());
            break;

          case 2:
            message.board = board.decode(reader, reader.uint32());
            break;

          case 3:
            message.events.push(activity.decode(reader, reader.uint32()));
            break;

          case 4:
            message.time = reader.uint64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    pet: pet | null;
    board: board | null;
    events: Array<activity>;
    time: u64;

    constructor(
      pet: pet | null = null,
      board: board | null = null,
      events: Array<activity> = [],
      time: u64 = 0
    ) {
      this.pet = pet;
      this.board = board;
      this.events = events;
      this.time = time;
    }
  }

  export class log {
    static encode(message: log, writer: Writer): void {
      const unique_name_events = message.events;
      for (let i = 0; i < unique_name_events.length; ++i) {
        writer.uint32(10);
        writer.fork();
        activity.encode(unique_name_events[i], writer);
        writer.ldelim();
      }
    }

    static decode(reader: Reader, length: i32): log {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new log();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.events.push(activity.decode(reader, reader.uint32()));
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    events: Array<activity>;

    constructor(events: Array<activity> = []) {
      this.events = events;
    }
  }

  @unmanaged
  export class period {
    static encode(message: period, writer: Writer): void {
      if (message.care_days != 0) {
        writer.uint32(8);
        writer.uint32(message.care_days);
      }

      if (message.score != 0) {
        writer.uint32(16);
        writer.uint32(message.score);
      }
    }

    static decode(reader: Reader, length: i32): period {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new period();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.care_days = reader.uint32();
            break;

          case 2:
            message.score = reader.uint32();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    care_days: u32;
    score: u32;

    constructor(care_days: u32 = 0, score: u32 = 0) {
      this.care_days = care_days;
      this.score = score;
    }
  }

  @unmanaged
  export class initialize_arguments {
    static encode(message: initialize_arguments, writer: Writer): void {}

    static decode(reader: Reader, length: i32): initialize_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new initialize_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    constructor() {}
  }

  @unmanaged
  export class initialize_result {
    static encode(message: initialize_result, writer: Writer): void {
      if (message.value != false) {
        writer.uint32(8);
        writer.bool(message.value);
      }
    }

    static decode(reader: Reader, length: i32): initialize_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new initialize_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.value = reader.bool();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    value: bool;

    constructor(value: bool = false) {
      this.value = value;
    }
  }

  @unmanaged
  export class get_view_arguments {
    static encode(message: get_view_arguments, writer: Writer): void {}

    static decode(reader: Reader, length: i32): get_view_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_view_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    constructor() {}
  }

  export class get_view_result {
    static encode(message: get_view_result, writer: Writer): void {
      const unique_name_view = message.view;
      if (unique_name_view !== null) {
        writer.uint32(10);
        writer.fork();
        view.encode(unique_name_view, writer);
        writer.ldelim();
      }
    }

    static decode(reader: Reader, length: i32): get_view_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_view_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.view = view.decode(reader, reader.uint32());
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    view: view | null;

    constructor(view: view | null = null) {
      this.view = view;
    }
  }

  export class get_owner_arguments {
    static encode(message: get_owner_arguments, writer: Writer): void {
      const unique_name_address = message.address;
      if (unique_name_address !== null) {
        writer.uint32(10);
        writer.string(unique_name_address);
      }
    }

    static decode(reader: Reader, length: i32): get_owner_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_owner_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.address = reader.string();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    address: string | null;

    constructor(address: string | null = null) {
      this.address = address;
    }
  }

  export class get_owner_result {
    static encode(message: get_owner_result, writer: Writer): void {
      const unique_name_owner = message.owner;
      if (unique_name_owner !== null) {
        writer.uint32(10);
        writer.fork();
        owner.encode(unique_name_owner, writer);
        writer.ldelim();
      }
    }

    static decode(reader: Reader, length: i32): get_owner_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_owner_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.owner = owner.decode(reader, reader.uint32());
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    owner: owner | null;

    constructor(owner: owner | null = null) {
      this.owner = owner;
    }
  }

  export class get_period_arguments {
    static encode(message: get_period_arguments, writer: Writer): void {
      const unique_name_address = message.address;
      if (unique_name_address !== null) {
        writer.uint32(10);
        writer.string(unique_name_address);
      }

      if (message.week != 0) {
        writer.uint32(16);
        writer.uint32(message.week);
      }
    }

    static decode(reader: Reader, length: i32): get_period_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_period_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.address = reader.string();
            break;

          case 2:
            message.week = reader.uint32();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    address: string | null;
    week: u32;

    constructor(address: string | null = null, week: u32 = 0) {
      this.address = address;
      this.week = week;
    }
  }

  @unmanaged
  export class get_period_result {
    static encode(message: get_period_result, writer: Writer): void {
      const unique_name_period = message.period;
      if (unique_name_period !== null) {
        writer.uint32(10);
        writer.fork();
        period.encode(unique_name_period, writer);
        writer.ldelim();
      }
    }

    static decode(reader: Reader, length: i32): get_period_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_period_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.period = period.decode(reader, reader.uint32());
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    period: period | null;

    constructor(period: period | null = null) {
      this.period = period;
    }
  }

  @unmanaged
  export class get_board_arguments {
    static encode(message: get_board_arguments, writer: Writer): void {
      if (message.week != 0) {
        writer.uint32(8);
        writer.uint32(message.week);
      }
    }

    static decode(reader: Reader, length: i32): get_board_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_board_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.week = reader.uint32();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    week: u32;

    constructor(week: u32 = 0) {
      this.week = week;
    }
  }

  export class get_board_result {
    static encode(message: get_board_result, writer: Writer): void {
      const unique_name_board = message.board;
      if (unique_name_board !== null) {
        writer.uint32(10);
        writer.fork();
        board.encode(unique_name_board, writer);
        writer.ldelim();
      }
    }

    static decode(reader: Reader, length: i32): get_board_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new get_board_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.board = board.decode(reader, reader.uint32());
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    board: board | null;

    constructor(board: board | null = null) {
      this.board = board;
    }
  }

  export class act_arguments {
    static encode(message: act_arguments, writer: Writer): void {
      const unique_name_address = message.address;
      if (unique_name_address !== null) {
        writer.uint32(10);
        writer.string(unique_name_address);
      }

      const unique_name_kind = message.kind;
      if (unique_name_kind !== null) {
        writer.uint32(18);
        writer.string(unique_name_kind);
      }

      if (message.slot != 0) {
        writer.uint32(24);
        writer.uint32(message.slot);
      }

      if (message.choice != 0) {
        writer.uint32(32);
        writer.uint32(message.choice);
      }

      if (message.min_points != 0) {
        writer.uint32(40);
        writer.uint32(message.min_points);
      }
    }

    static decode(reader: Reader, length: i32): act_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new act_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.address = reader.string();
            break;

          case 2:
            message.kind = reader.string();
            break;

          case 3:
            message.slot = reader.uint32();
            break;

          case 4:
            message.choice = reader.uint32();
            break;

          case 5:
            message.min_points = reader.uint32();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    address: string | null;
    kind: string | null;
    slot: u32;
    choice: u32;
    min_points: u32;

    constructor(
      address: string | null = null,
      kind: string | null = null,
      slot: u32 = 0,
      choice: u32 = 0,
      min_points: u32 = 0
    ) {
      this.address = address;
      this.kind = kind;
      this.slot = slot;
      this.choice = choice;
      this.min_points = min_points;
    }
  }

  @unmanaged
  export class act_result {
    static encode(message: act_result, writer: Writer): void {
      if (message.points != 0) {
        writer.uint32(8);
        writer.uint32(message.points);
      }

      if (message.sequence != 0) {
        writer.uint32(16);
        writer.uint32(message.sequence);
      }
    }

    static decode(reader: Reader, length: i32): act_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new act_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.points = reader.uint32();
            break;

          case 2:
            message.sequence = reader.uint32();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    points: u32;
    sequence: u32;

    constructor(points: u32 = 0, sequence: u32 = 0) {
      this.points = points;
      this.sequence = sequence;
    }
  }

  @unmanaged
  export class settle_arguments {
    static encode(message: settle_arguments, writer: Writer): void {
      if (message.week != 0) {
        writer.uint32(8);
        writer.uint32(message.week);
      }
    }

    static decode(reader: Reader, length: i32): settle_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new settle_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.week = reader.uint32();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    week: u32;

    constructor(week: u32 = 0) {
      this.week = week;
    }
  }

  export class settle_result {
    static encode(message: settle_result, writer: Writer): void {
      const unique_name_board = message.board;
      if (unique_name_board !== null) {
        writer.uint32(10);
        writer.fork();
        board.encode(unique_name_board, writer);
        writer.ldelim();
      }
    }

    static decode(reader: Reader, length: i32): settle_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new settle_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.board = board.decode(reader, reader.uint32());
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    board: board | null;

    constructor(board: board | null = null) {
      this.board = board;
    }
  }
}
