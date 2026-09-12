import { System, Protobuf, authority } from "@koinos/sdk-as";
import { Rewards as ContractClass } from "./Rewards";
import { rewards as ProtoNamespace } from "./proto/rewards";

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

    case 0x073c1634: {
      const args = Protobuf.decode<ProtoNamespace.status_arguments>(
        contractArgs.args,
        ProtoNamespace.status_arguments.decode
      );
      const res = c.status(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.status_result.encode);
      break;
    }

    case 0xdd1b3c31: {
      const args = Protobuf.decode<ProtoNamespace.claim_arguments>(
        contractArgs.args,
        ProtoNamespace.claim_arguments.decode
      );
      const res = c.claim(args);
      retbuf = Protobuf.encode(res, ProtoNamespace.claim_result.encode);
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
