import { decode } from "https://deno.land/std@0.116.0/encoding/hex.ts";

async function readBytes(byteCount: number) {
  const bytes = new Uint8Array(byteCount * 2);
  const bytesRead = await Deno.stdin.read(bytes);
  if (!bytesRead || bytesRead < byteCount * 2) {
    throw new Error("not enough bytes left to read");
  }
  return decode(bytes);
}

function printByte(byte: number) {
  const ret = byte.toString(2);
  return "00000000".slice(ret.length) + ret;
}

let buff = "";
let bitsRead = 0;
async function readBits(bitCount: number) {
  if (buff.length < bitCount) {
    const nextBytes = await readBytes(Math.ceil(bitCount / 8));
    buff = nextBytes.reduce<string>((str, cur) => str + printByte(cur), buff);
    console.log({ read: nextBytes, buff });
  }
  const ret = buff.slice(0, bitCount);
  buff = buff.slice(bitCount);
  bitsRead += bitCount;
  return ret;
}

async function readBitsAsNumber(bitCount: number) {
  return parseInt(await readBits(bitCount), 2);
}

enum PacketType {
  Literal,
  Operation,
}

interface PacketBase {
  version: number;
}

interface LiteralPacket extends PacketBase {
  type: PacketType.Literal;
  value: number;
}

interface OperatorPacket extends PacketBase {
  type: PacketType.Operation;
  operationType: number;
  contents: Packet[];
}

type Packet = LiteralPacket | OperatorPacket;

async function readPacket(): Promise<Packet> {
  const version = await readBitsAsNumber(3);
  const type = await readBitsAsNumber(3);
  switch (type) {
    case 4:
      return {
        version,
        type: PacketType.Literal,
        value: await readLiteralBody(),
      };
    default:
      return {
        version,
        type: PacketType.Operation,
        operationType: type,
        contents: await readOperatorBody(),
      };
  }
}

async function readLiteralBody() {
  let contents = "";
  let done = false;
  while (!done) {
    const chunk = await readBits(5);
    done = chunk[0] === "0";
    contents += chunk.slice(1);
  }
  return parseInt(contents, 2);
}

async function readOperatorBody() {
  const lengthType = (await readBits(1)) as "0" | "1";
  switch (lengthType) {
    case "0": {
      const bitsOfPackets = await readBitsAsNumber(15);
      const stopAtBitsRead = bitsRead + bitsOfPackets;
      const packets: Packet[] = [];
      while (bitsRead < stopAtBitsRead) {
        packets.push(await readPacket());
      }
      return packets;
    }
    case "1": {
      const packetCount = await readBitsAsNumber(11);
      const packets: Packet[] = [];
      while (packets.length < packetCount) {
        packets.push(await readPacket());
      }
      return packets;
    }
  }
}

function versionSumOfPacket(p: Packet): number {
  if (p.type === PacketType.Literal) {
    return p.version;
  }
  return p.contents.reduce(
    (sum, cur) => sum + versionSumOfPacket(cur),
    p.version
  );
}

const transmission = await readPacket();
console.log(transmission);
console.log(versionSumOfPacket(transmission));
