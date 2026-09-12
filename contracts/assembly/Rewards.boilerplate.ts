import { System, Protobuf, authority } from "@koinos/sdk-as";
import { rewards } from "./proto/rewards";

export class Rewards {
  authorize(args: authority.authorize_arguments): authority.authorize_result {
    // const call = args.call;
    // const type = args.type;

    // YOUR CODE HERE

    const res = new authority.authorize_result();
    res.value = true;

    return res;
  }

  initialize(args: rewards.initialize_arguments): rewards.initialize_result {
    // const core = args.core;

    // YOUR CODE HERE

    const res = new rewards.initialize_result();
    // res.value = ;

    return res;
  }

  status(args: rewards.status_arguments): rewards.status_result {
    // const address = args.address;
    // const week = args.week;

    // YOUR CODE HERE

    const res = new rewards.status_result();
    // res.eligible = ;
    // res.claimed = ;
    // res.core = ;

    return res;
  }

  claim(args: rewards.claim_arguments): rewards.claim_result {
    // const address = args.address;
    // const week = args.week;

    // YOUR CODE HERE

    const res = new rewards.claim_result();
    // res.value = ;

    return res;
  }
}
