import { stdinLines } from "../shared/stdin.ts";
import { magnitude, addPairs, parseLineToPair } from "./lib.ts";

function magnitudeOfLineAddition(a: string, b: string) {
  return magnitude(addPairs(parseLineToPair(a), parseLineToPair(b)));
}

const inputs: string[] = [];
let maxMag = 0;
for await (const line of stdinLines()) {
  if (!line) {
    continue;
  }
  for (const otherLine of inputs) {
    maxMag = Math.max(
      maxMag,
      magnitudeOfLineAddition(line, otherLine),
      magnitudeOfLineAddition(otherLine, line)
    );
  }
  inputs.push(line);
}
console.log({
  maxMag,
});
