import { stdinLines } from "../shared/stdin.ts";
import { InfiniteGrid, enhance } from "./lib.ts";

let lookupTable = "";
const grid = new InfiniteGrid();
let y = 0;
for await (const line of stdinLines()) {
  if (!line) {
    continue;
  }
  if (!lookupTable) {
    lookupTable = line;
  } else {
    grid.addRow(line, y++);
  }
}

const twoPass = enhance(enhance(grid, lookupTable), lookupTable);
twoPass.print();
console.log({
  lit: twoPass.countLit(),
});
