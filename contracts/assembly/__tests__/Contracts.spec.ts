import { Contracts } from '../Contracts';
import { contracts as c } from '../proto/contracts';
import { MockVM, Base58, protocol, authority } from '@koinos/sdk-as';
const ADDRESS = '1DQzuCcTKacbs9GGScFTU1Hc8BsyARTPqe';
const OTHER = '1EdLyQ67LW6HVU1dWoceP4firtyz77e37Y';
const START: u64 = 1700000000000;
function time(t: u64): void {
  const b = new protocol.block();
  b.header = new protocol.block_header();
  b.header!.timestamp = t;
  b.header!.height = t / 3000;
  MockVM.setBlock(b);
}
function setup(): Contracts {
  MockVM.reset();
  MockVM.setContractId(Base58.decode(OTHER));
  MockVM.setAuthorities([
    new MockVM.MockAuthority(
      authority.authorization_type.contract_call,
      Base58.decode(OTHER),
      true,
    ),
    new MockVM.MockAuthority(
      authority.authorization_type.contract_call,
      Base58.decode(ADDRESS),
      true,
    ),
  ]);
  time(START);
  const pet = new Contracts();
  pet.initialize(new c.initialize_arguments());
  return pet;
}
function action(kind: string): c.act_arguments {
  return new c.act_arguments(ADDRESS, kind, 0, 0, 0);
}
describe('Uni Pet protocol', () => {
  it('initializes once and preserves the pet identity', () => {
    const pet = setup();
    expect(pet.get_view(new c.get_view_arguments()).view!.pet!.name).toStrictEqual('Uni');
    expect(() => {
      new Contracts().initialize(new c.initialize_arguments());
    }).toThrow();
  });
  it('rejects another wallet without its authorization', () => {
    setup();
    MockVM.setAuthorities([]);
    expect(() => {
      new Contracts().act(action('feed'));
    }).toThrow();
  });
  it('applies useful care and records authoritative affection', () => {
    const pet = setup();
    const result = pet.act(action('feed'));
    expect(result.points).toStrictEqual(10);
    const v = pet.get_view(new c.get_view_arguments()).view!;
    expect(v.pet!.nourishment).toStrictEqual(82);
    expect(v.board!.entries[0].score).toStrictEqual(10);
    expect(v.events.length).toStrictEqual(1);
  });
  it('rejects rapid repeats', () => {
    const pet = setup();
    pet.act(action('comfort'));
    expect(() => {
      new Contracts().act(action('comfort'));
    }).toThrow();
  });
  it('caps daily affection and counts a care day once', () => {
    const pet = setup();
    for (let i = 0; i < 15; i++) {
      time(START + <u64>i * 11000);
      pet.act(action('comfort'));
    }
    const o = pet.get_owner(new c.get_owner_arguments(ADDRESS)).owner!;
    expect(o.daily_points).toStrictEqual(40);
    expect(o.care_days).toStrictEqual(1);
    expect(o.score).toStrictEqual(40);
  });
  it('resets the weekly competition but retains historical eligibility', () => {
    const pet = setup();
    pet.act(action('feed'));
    const week = <u32>(START / 604800000);
    time((<u64>week + 1) * 604800000 + 10000);
    const o = pet.get_owner(new c.get_owner_arguments(ADDRESS)).owner!;
    expect(o.score).toStrictEqual(0);
    expect(o.lifetime_days).toStrictEqual(1);
    expect(
      pet.get_period(new c.get_period_arguments(ADDRESS, week)).period!.care_days,
    ).toStrictEqual(1);
    expect(pet.settle(new c.settle_arguments(week)).board!.settled).toStrictEqual(true);
  });
  it('computes long idle decay with bounded work', () => {
    const pet = setup();
    time(START + 365 * 86400000);
    const p = pet.get_view(new c.get_view_arguments()).view!.pet!;
    expect(p.nourishment).toStrictEqual(0);
    expect(p.energy).toStrictEqual(100);
    expect(p.name).toStrictEqual('Uni');
  });
  it('retains fractional time when actions settle meters', () => {
    const pet = setup();
    time(START + 1800000);
    pet.act(action('comfort'));
    time(START + 3600000);
    expect(pet.get_view(new c.get_view_arguments()).view!.pet!.nourishment).toStrictEqual(62);
  });
  it('grows and harvests watered crops, then consumes ingredients once', () => {
    const pet = setup();
    pet.act(action('plant'));
    time(START + 11000);
    pet.act(action('water'));
    time(START + 14400000);
    pet.act(action('harvest'));
    time(START + 14411000);
    pet.act(action('craft'));
    const o = pet.get_owner(new c.get_owner_arguments(ADDRESS)).owner!;
    expect(o.berries).toStrictEqual(3);
    expect(o.treats).toStrictEqual(1);
    expect(o.plots[0].planted).toStrictEqual(0);
  });
  it('rejects early harvests and out of range plots', () => {
    const pet = setup();
    pet.act(action('plant'));
    time(START + 11000);
    expect(() => {
      new Contracts().act(action('harvest'));
    }).toThrow();
  });
  it('does not accept client-provided rewards or unknown actions', () => {
    setup();
    expect(() => {
      new Contracts().act(action('give_unlimited_affection'));
    }).toThrow();
  });
  it('does not finalize the current competition', () => {
    setup();
    expect(() => {
      new Contracts().settle(new c.settle_arguments(<u32>(START / 604800000)));
    }).toThrow();
  });
  it('protects the minimum affection expectation', () => {
    setup();
    expect(() => {
      new Contracts().act(new c.act_arguments(ADDRESS, 'comfort', 0, 0, 20));
    }).toThrow();
  });
  it('denies contract replacement through its authorize entrypoint', () => {
    const pet = setup();
    expect(pet.authorize(new authority.authorize_arguments()).value).toStrictEqual(false);
  });
});

describe('block-based care balance', () => {
  it('does not decay when only the timestamp advances', () => {
    const pet = setup();
    const b = new protocol.block();
    b.header = new protocol.block_header();
    b.header!.timestamp = START + 86400000;
    b.header!.height = START / 3000;
    MockVM.setBlock(b);
    expect(pet.get_view(new c.get_view_arguments()).view!.pet!.nourishment).toStrictEqual(64);
    b.header!.height += 1200;
    MockVM.setBlock(b);
    expect(pet.get_view(new c.get_view_arguments()).view!.pet!.nourishment).toStrictEqual(62);
  });
  it('subtracts affection for a healthy meal and updates the leaderboard', () => {
    const pet = setup();
    pet.act(action('feed'));
    time(START + 11000);
    pet.act(action('healthy'));
    const v = pet.get_view(new c.get_view_arguments()).view!;
    expect(v.pet!.wellness).toStrictEqual(90);
    expect(v.pet!.caretakers).toStrictEqual(1);
    expect(v.pet!.balance_care).toStrictEqual(1);
    expect(v.board!.entries[0].score).toStrictEqual(7);
  });
});

it('promotes the 21st ranked caretaker after a score deduction', () => {
  const pet = setup();
  const addresses = new Array<string>();
  const authorities = new Array<MockVM.MockAuthority>();
  for (let i = 0; i < 21; i++) {
    const label = ADDRESS.slice(0, ADDRESS.length - 1) + '123456789ABCDEFGHJKLMN'.charAt(i);
    const bytes = Base58.decode(label);
    addresses.push(label);
    authorities.push(
      new MockVM.MockAuthority(authority.authorization_type.contract_call, bytes, true),
    );
  }
  MockVM.setAuthorities(authorities);
  for (let i = 0; i < 21; i++) {
    time(START + <u64>i * 11000);
    pet.act(new c.act_arguments(addresses[i], 'comfort', 0, 0, 0));
  }
  time(START + 240000);
  pet.act(new c.act_arguments(addresses[0], 'healthy', 0, 0, 0));
  const entries = pet.get_view(new c.get_view_arguments()).view!.board!.entries;
  expect(entries.length).toStrictEqual(20);
  expect(entries[19].address).toStrictEqual(addresses[20]);
});
