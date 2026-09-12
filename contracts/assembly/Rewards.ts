import { System, Storage, Protobuf, Base58, authority } from '@koinos/sdk-as';
import { contracts as c } from './proto/contracts';
import { rewards as r } from './proto/rewards';
// Independent example: reads core eligibility, never writes core affection.
export class Rewards {
  id: Uint8Array = System.getContractId();
  config: Storage.Obj<r.configuration> = new Storage.Obj(
    this.id,
    0,
    r.configuration.decode,
    r.configuration.encode,
  );
  badges: Storage.Map<string, r.badge> = new Storage.Map(
    this.id,
    1,
    r.badge.decode,
    r.badge.encode,
  );
  authorize(args: authority.authorize_arguments): authority.authorize_result {
    return new authority.authorize_result(false);
  }
  initialize(args: r.initialize_arguments): r.initialize_result {
    System.require(
      System.checkAuthority(authority.authorization_type.contract_call, this.id),
      'Deployment authority required',
    );
    System.require(this.config.get() == null, 'Already initialized');
    System.require(args.core != null && args.core!.length <= 40, 'Invalid core');
    System.require(Base58.decode(args.core!).length == 25, 'Invalid core');
    this.config.put(new r.configuration(args.core));
    return new r.initialize_result(true);
  }
  status(args: r.status_arguments): r.status_result {
    const config = this.config.get();
    System.require(config != null, 'Issuer not initialized');
    System.require(args.address != null && args.address!.length <= 40, 'Invalid address');
    const exists = this.badges.get(args.week.toString() + ':' + args.address!);
    const response = System.call(
      Base58.decode(config!.core!),
      2829932746,
      Protobuf.encode(
        new c.get_period_arguments(args.address, args.week),
        c.get_period_arguments.encode,
      ),
    );
    System.require(
      response.code == 0 && response.res.object != null,
      'Core eligibility unavailable',
    );
    const result = Protobuf.decode<c.get_period_result>(
      response.res.object!,
      c.get_period_result.decode,
    );
    return new r.status_result(
      result.period != null && result.period!.care_days >= 3,
      exists != null,
      config!.core,
    );
  }
  claim(args: r.claim_arguments): r.claim_result {
    System.require(args.address != null && args.address!.length <= 40, 'Invalid address');
    const address = Base58.decode(args.address!);
    System.require(address.length == 25, 'Invalid address');
    System.require(
      System.checkAuthority(authority.authorization_type.contract_call, address),
      'Wallet authorization required',
    );
    const status = this.status(new r.status_arguments(args.address, args.week));
    System.require(status.eligible, 'Care on three distinct days');
    System.require(!status.claimed, 'Badge already claimed');
    const badge = new r.badge(args.address, args.week, true);
    this.badges.put(args.week.toString() + ':' + args.address!, badge);
    System.event('unipet.care_club.v1', Protobuf.encode(badge, r.badge.encode), [address]);
    return new r.claim_result(true);
  }
}
