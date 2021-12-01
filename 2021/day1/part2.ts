import { stdinLines } from "../shared/stdin.ts";

function* slidingWindow(arr: number[], windowSize = 3) {
  for (let i = 0; i < arr.length - windowSize + 1; i++) {
    let sum = 0;
    for (let j = 0; j < windowSize; j++) {
      sum += arr[i + j];
    }
    yield sum;
  }
}

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
  for (const sum of slidingWindow(input)) {
    if (prev !== undefined) {
      if (sum > prev) {
        largerCount++;
      }
    }
    prev = sum;
  }

  console.log("Count of larger consequtive windows is", largerCount);
}
main();
