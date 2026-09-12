import { Writer, Reader } from "as-proto";

export namespace rewards {
  export class configuration {
    static encode(message: configuration, writer: Writer): void {
      const unique_name_core = message.core;
      if (unique_name_core !== null) {
        writer.uint32(10);
        writer.string(unique_name_core);
      }
    }

    static decode(reader: Reader, length: i32): configuration {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new configuration();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.core = reader.string();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    core: string | null;

    constructor(core: string | null = null) {
      this.core = core;
    }
  }

  export class badge {
    static encode(message: badge, writer: Writer): void {
      const unique_name_address = message.address;
      if (unique_name_address !== null) {
        writer.uint32(10);
        writer.string(unique_name_address);
      }

      if (message.week != 0) {
        writer.uint32(16);
        writer.uint32(message.week);
      }

      if (message.claimed != false) {
        writer.uint32(24);
        writer.bool(message.claimed);
      }
    }

    static decode(reader: Reader, length: i32): badge {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new badge();

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
            message.claimed = reader.bool();
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
    claimed: bool;

    constructor(
      address: string | null = null,
      week: u32 = 0,
      claimed: bool = false
    ) {
      this.address = address;
      this.week = week;
      this.claimed = claimed;
    }
  }

  export class initialize_arguments {
    static encode(message: initialize_arguments, writer: Writer): void {
      const unique_name_core = message.core;
      if (unique_name_core !== null) {
        writer.uint32(10);
        writer.string(unique_name_core);
      }
    }

    static decode(reader: Reader, length: i32): initialize_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new initialize_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.core = reader.string();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    core: string | null;

    constructor(core: string | null = null) {
      this.core = core;
    }
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

  export class status_arguments {
    static encode(message: status_arguments, writer: Writer): void {
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

    static decode(reader: Reader, length: i32): status_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new status_arguments();

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

  export class status_result {
    static encode(message: status_result, writer: Writer): void {
      if (message.eligible != false) {
        writer.uint32(8);
        writer.bool(message.eligible);
      }

      if (message.claimed != false) {
        writer.uint32(16);
        writer.bool(message.claimed);
      }

      const unique_name_core = message.core;
      if (unique_name_core !== null) {
        writer.uint32(26);
        writer.string(unique_name_core);
      }
    }

    static decode(reader: Reader, length: i32): status_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new status_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.eligible = reader.bool();
            break;

          case 2:
            message.claimed = reader.bool();
            break;

          case 3:
            message.core = reader.string();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    eligible: bool;
    claimed: bool;
    core: string | null;

    constructor(
      eligible: bool = false,
      claimed: bool = false,
      core: string | null = null
    ) {
      this.eligible = eligible;
      this.claimed = claimed;
      this.core = core;
    }
  }

  export class claim_arguments {
    static encode(message: claim_arguments, writer: Writer): void {
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

    static decode(reader: Reader, length: i32): claim_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new claim_arguments();

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
  export class claim_result {
    static encode(message: claim_result, writer: Writer): void {
      if (message.value != false) {
        writer.uint32(8);
        writer.bool(message.value);
      }
    }

    static decode(reader: Reader, length: i32): claim_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new claim_result();

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
}
