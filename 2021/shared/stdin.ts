import { readLines } from "https://deno.land/std@0.116.0/io/buffer.ts";

export function stdinLines() {
  return readLines(Deno.stdin);
}
