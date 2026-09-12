import { Rewards } from '../Rewards';
import { rewards as r } from '../proto/rewards';
import { contracts as c } from '../proto/contracts';
import { MockVM, Base58, authority, Protobuf, system_calls, chain } from '@koinos/sdk-as';
const ADDRESS = '1DQzuCcTKacbs9GGScFTU1Hc8BsyARTPqe';
const CORE = '1EdLyQ67LW6HVU1dWoceP4firtyz77e37Y';
function setup(): Rewards {
  MockVM.reset();
  MockVM.setContractId(Base58.decode(ADDRESS));
  MockVM.setAuthorities([
    new MockVM.MockAuthority(
      authority.authorization_type.contract_call,
      Base58.decode(ADDRESS),
      true,
    ),
  ]);
  const reward = new Rewards();
  reward.initialize(new r.initialize_arguments(CORE));
  return reward;
}
function eligibility(days: u32): void {
  const result = new chain.result();
  result.object = Protobuf.encode(
    new c.get_period_result(new c.period(days, 30)),
    c.get_period_result.encode,
  );
  MockVM.setCallContractResults([new system_calls.exit_arguments(0, result)]);
}
describe('Independent Care Club issuer', () => {
  it('reads the configured core and never writes its state', () => {
    const reward = setup();
    eligibility(3);
    const status = reward.status(new r.status_arguments(ADDRESS, 42));
    expect(status.eligible).toStrictEqual(true);
    expect(status.core).toStrictEqual(CORE);
    const calls = MockVM.getCallContractArguments();
    expect(calls.length).toStrictEqual(1);
    expect(calls[0].entry_point).toStrictEqual(2829932746);
  });
  it('requires three actual care days', () => {
    setup();
    eligibility(2);
    expect(() => {
      new Rewards().claim(new r.claim_arguments(ADDRESS, 42));
    }).toThrow();
  });
  it('records a claim and rejects duplicates', () => {
    const reward = setup();
    eligibility(3);
    expect(reward.claim(new r.claim_arguments(ADDRESS, 42)).value).toStrictEqual(true);
    eligibility(3);
    expect(reward.status(new r.status_arguments(ADDRESS, 42)).claimed).toStrictEqual(true);
    eligibility(3);
    expect(() => {
      new Rewards().claim(new r.claim_arguments(ADDRESS, 42));
    }).toThrow();
  });
  it('does not let another person claim using an unsigned address', () => {
    setup();
    MockVM.setAuthorities([]);
    eligibility(3);
    expect(() => {
      new Rewards().claim(new r.claim_arguments(ADDRESS, 42));
    }).toThrow();
  });
});
