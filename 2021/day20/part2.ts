import { stdinLines } from "../shared/stdin.ts";
import { InfiniteGrid, enhance } from "./lib.ts";

function pause(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

let lookupTable = "";
const frames = [new InfiniteGrid()];
let y = 0;
for await (const line of stdinLines()) {
  if (!line) {
    continue;
  }
  if (!lookupTable) {
    lookupTable = line;
  } else {
    frames[0].addRow(line, y++);
  }
}

for (let pass = 1; pass <= 50; pass++) {
  frames.push(enhance(frames[frames.length - 1], lookupTable));
}

// for (const frame of frames) {
//   frame.print(frames[frames.length - 1].getBounds());
//   await pause(500);
// }
console.log({
  lit: frames[frames.length - 1].countLit(),
});
