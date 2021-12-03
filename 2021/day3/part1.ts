import { stdinLines } from "../shared/stdin.ts";

const ones: number[] = [];
let lines = 0;
for await (const line of stdinLines()) {
  if (!line) {
    continue;
  }
  line.split("").forEach((bit, place) => {
    if (bit === "1") {
      if (ones[place]) {
        ones[place] += 1;
      } else {
        ones[place] = 1;
      }
    } else {
      ones[place] = ones[place] || 0;
    }
  });
  lines += 1;
}

const totalBits = ones.length;
let gamma = 0;
let eps = 0;
for (let i = 0; i < totalBits; i++) {
  const totalForPos = ones[i];
  if (totalForPos > lines / 2) {
    gamma += 1 << (totalBits - 1 - i);
  } else {
    eps += 1 << (totalBits - 1 - i);
  }
}

console.log("final", { gamma, eps });
console.log("final answer", gamma * eps);
