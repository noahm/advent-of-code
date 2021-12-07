import { stdinLines } from "../shared/stdin.ts";
import { CountingSet } from "../shared/counting-set.ts";

const positions: number[] = (await stdinLines().next()).value
  .split(",")
  .map((n: string) => +n);
positions.sort((a, b) => a - b);

const positionCounts = new CountingSet(positions);
let max = [0, 0];
for (const count of positionCounts.entries()) {
  if (count[1] > max[1]) {
    max = count;
  }
}

function costOfDistance(a: number, b: number) {
  const distance = Math.abs(a - b);
  return (distance * (distance + 1)) / 2;
}

function costToMoveTo(loc: number) {
  let cost = 0;
  for (const [pos, count] of positionCounts.entries()) {
    cost += costOfDistance(pos, loc) * count;
  }
  return cost;
}

const median = positions[Math.floor(positions.length / 2)];
const mode = max[0];
const avg = Math.round(
  Array.from(positionCounts.entries()).reduce(
    (sum, [pos, count]) => sum + pos * count,
    0
  ) / positions.length
);

console.log({
  length: positions.length,
  median,
  moveToMedian: costToMoveTo(median),
  mode,
  moveToMax: costToMoveTo(mode),
  avg,
  moveToAvg: [
    costToMoveTo(avg - 1),
    costToMoveTo(avg - 2),
    costToMoveTo(avg - 3),
  ],
});
