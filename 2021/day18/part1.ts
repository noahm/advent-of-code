import { stdinLines } from "../shared/stdin.ts";
import {
  Node,
  parseLineToPair,
  addPairs,
  printPair,
  magnitude,
} from "./lib.ts";

let workingPair: Node | null = null;
for await (const line of stdinLines()) {
  if (!line) {
    continue;
  }
  if (!workingPair) {
    workingPair = parseLineToPair(line);
  } else {
    workingPair = addPairs(workingPair, parseLineToPair(line));
  }
}
console.log({
  sum: printPair(workingPair!),
  magnitude: magnitude(workingPair!),
});
