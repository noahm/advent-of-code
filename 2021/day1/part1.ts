import { stdinLines } from "../shared/stdin.ts";

async function main() {
  const input: number[] = [];
  for await (const line of stdinLines()) {
    if (!line) {
      continue;
    }
    input.push(+line);
  }

  let prev: number | undefined;
  let largerCount = 0;
  for (const n of input) {
    if (prev !== undefined) {
      if (n > prev) {
        largerCount++;
      }
    }
    prev = n;
  }

  console.log("Count of larger consequtive entries is", largerCount);
}
main();
