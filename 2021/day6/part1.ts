import { stdinLines } from "../shared/stdin.ts";
import { times } from "../shared/loops.ts";

let countsByValue = times(9, () => 0);

for await (const line of stdinLines()) {
  if (!line) {
    continue;
  }
  const numbers = line.split(",");
  for (const n of numbers) {
    countsByValue[+n] += 1;
  }
}

console.log(
  "starting count",
  countsByValue.reduce((sum, cur) => sum + cur, 0)
);

let day = 1;
while (day <= 256) {
  const newCounts: number[] = [];
  countsByValue.forEach((fishCount, daysToRep) => {
    if (daysToRep === 0) {
      newCounts[6] = fishCount;
      newCounts[8] = fishCount;
      console.log("double assigning", { fishCount, newCounts });
    } else {
      newCounts[daysToRep - 1] =
        (fishCount || 0) + (newCounts[daysToRep - 1] || 0);
    }
  });
  console.log({ countsByValue, newCounts });
  countsByValue = newCounts;
  day++;
}

console.log(
  "final count",
  countsByValue.reduce((sum, cur) => sum + cur, 0)
);
