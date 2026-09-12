import { System, Protobuf, authority } from "@koinos/sdk-as";
import { contracts } from "./proto/contracts";

export class Contracts {
  authorize(args: authority.authorize_arguments): authority.authorize_result {
    // const call = args.call;
    // const type = args.type;

    // YOUR CODE HERE

    const res = new authority.authorize_result();
    res.value = true;

    return res;
  }

  initialize(
    args: contracts.initialize_arguments
  ): contracts.initialize_result {
    // YOUR CODE HERE

    const res = new contracts.initialize_result();
    // res.value = ;

    return res;
  }

  get_view(args: contracts.get_view_arguments): contracts.get_view_result {
    // YOUR CODE HERE

    const res = new contracts.get_view_result();
    // res.view = ;

    return res;
  }

  get_owner(args: contracts.get_owner_arguments): contracts.get_owner_result {
    // const address = args.address;

    // YOUR CODE HERE

    const res = new contracts.get_owner_result();
    // res.owner = ;

    return res;
  }

  get_period(
    args: contracts.get_period_arguments
  ): contracts.get_period_result {
    // const address = args.address;
    // const week = args.week;

    // YOUR CODE HERE

    const res = new contracts.get_period_result();
    // res.period = ;

    return res;
  }

  get_board(args: contracts.get_board_arguments): contracts.get_board_result {
    // const week = args.week;

    // YOUR CODE HERE

    const res = new contracts.get_board_result();
    // res.board = ;

    return res;
  }

  act(args: contracts.act_arguments): contracts.act_result {
    // const address = args.address;
    // const kind = args.kind;
    // const slot = args.slot;
    // const choice = args.choice;
    // const min_points = args.min_points;

    // YOUR CODE HERE

    const res = new contracts.act_result();
    // res.points = ;
    // res.sequence = ;

    return res;
  }

  settle(args: contracts.settle_arguments): contracts.settle_result {
    // const week = args.week;

    // YOUR CODE HERE

    const res = new contracts.settle_result();
    // res.board = ;

    return res;
  }
}
