import { stdinLines } from "../shared/stdin.ts";

// count number of times we've seen unique digit lengths
const field: number[][] = [];

function* neighborsOf(x: number, y: number) {
  if (x > 0) {
    yield field[y][x - 1];
  }
  if (y > 0) {
    yield field[y - 1][x];
  }
  if (y + 1 < field.length) {
    yield field[y + 1][x];
  }
  if (x + 1 < field[0].length) {
    yield field[y][x + 1];
  }
}

for await (const line of stdinLines()) {
  if (!line) {
    continue;
  }
  const row = line.split("").map((n) => +n);
  field.push(row);
}

let risk = 0;
for (let y = 0; y < field.length; y++) {
  for (let x = 0; x < field[0].length; x++) {
    const height = field[y][x];
    if (Array.from(neighborsOf(x, y)).every((h) => h > height)) {
      risk += height + 1;
    }
  }
}
console.log(risk);
