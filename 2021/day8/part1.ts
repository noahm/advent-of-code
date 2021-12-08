import { stdinLines } from "../shared/stdin.ts";
import { CountingSet } from "../shared/counting-set.ts";

// count number of times we've seen unique digit lengths
const set = new CountingSet<number>();

for await (const line of stdinLines()) {
  if (!line) {
    continue;
  }
  const notes = line.split(" ");
  const display = notes.slice(11);
  for (const digit of display) {
    set.add(digit.length);
  }
}

console.log(Array.from(set.entries()));
console.log(set.get(2) + set.get(3) + set.get(4) + set.get(7));
