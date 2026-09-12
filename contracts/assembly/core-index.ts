import { System, Protobuf, authority } from "@koinos/sdk-as";
import { Contracts as ContractClass } from "./Contracts";
import { contracts as ProtoNamespace } from "./proto/contracts";

export function main(): i32 {
  const contractArgs = System.getArguments();
  let retbuf = new Uint8Array(1024);

  const c = new ContractClass();

  switch (contractArgs.entry_point) {
    case 0x4a2dbd90: {
      const args = Protobuf.decode<authority.authorize_arguments>(
        contractArgs.args,
        authority.authorize_arguments.decode
      );
      const res = c.authorize(args);
      retbuf = Protobuf.encode(res, authority.authorize_result.encode);
      break;
    }

    case 0x470ebe82: {
      const args = Protobuf.decode<ProtoNamespace.initialize_arguments>(
        contractArgs.args,
        ProtoNamespace.initialize_arguments.decode
      );
      const res = c.initialize(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.initialize_result.encode);
      break;
    }

    case 0x3b56305c: {
      const args = Protobuf.decode<ProtoNamespace.get_view_arguments>(
        contractArgs.args,
        ProtoNamespace.get_view_arguments.decode
      );
      const res = c.get_view(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.get_view_result.encode);
      break;
    }

    case 0xecabdcbb: {
      const args = Protobuf.decode<ProtoNamespace.get_owner_arguments>(
        contractArgs.args,
        ProtoNamespace.get_owner_arguments.decode
      );
      const res = c.get_owner(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.get_owner_result.encode);
      break;
    }

    case 0xa8ad58ca: {
      const args = Protobuf.decode<ProtoNamespace.get_period_arguments>(
        contractArgs.args,
        ProtoNamespace.get_period_arguments.decode
      );
      const res = c.get_period(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.get_period_result.encode);
      break;
    }

    case 0x1905abab: {
      const args = Protobuf.decode<ProtoNamespace.get_board_arguments>(
        contractArgs.args,
        ProtoNamespace.get_board_arguments.decode
      );
      const res = c.get_board(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.get_board_result.encode);
      break;
    }

    case 0xf83f07be: {
      const args = Protobuf.decode<ProtoNamespace.act_arguments>(
        contractArgs.args,
        ProtoNamespace.act_arguments.decode
      );
      const res = c.act(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.act_result.encode);
      break;
    }

    case 0x6868e83d: {
      const args = Protobuf.decode<ProtoNamespace.settle_arguments>(
        contractArgs.args,
        ProtoNamespace.settle_arguments.decode
      );
      const res = c.settle(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.settle_result.encode);
      break;
    }

    default:
      System.exit(1);
      break;
  }

  System.exit(0, retbuf);
  return 0;
}

main();
