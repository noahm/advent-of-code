import { stdinLines } from "../shared/stdin.ts";

interface Point {
  x: number;
  y: number;
  energy: number;
}

const field: number[][] = [];

function pointFrom(x: number, y: number): Point {
  return { x, y, energy: field[y][x] };
}

function tryPointFrom(x: number, y: number) {
  if (x < 0 || y < 0 || x >= field[0].length || y >= field.length) {
    return;
  }
  return pointFrom(x, y);
}

function* neighborsOf({ x, y }: Point) {
  for (let offset = -1; offset <= 1; offset += 2) {
    let point = tryPointFrom(x + offset, y);
    if (point) yield point;
    point = tryPointFrom(x, y + offset);
    if (point) yield point;
    point = tryPointFrom(x + offset, y + offset);
    if (point) yield point;
    point = tryPointFrom(x + offset, y - offset);
    if (point) yield point;
  }
}

function* pointsOfField() {
  for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[0].length; x++) {
      yield pointFrom(x, y);
    }
  }
}

/** returns the number of newly flashed points from this flash */
function incrementAndMaybeFlash(point: Point): number {
  let flashes = 0;
  increment(point);
  // only flash if we just reached the energy level
  if (point.energy === 10) {
    flashes += 1;
    for (const n of neighborsOf(point)) {
      flashes += incrementAndMaybeFlash(n);
    }
  }
  return flashes;
}

function increment(point: Point) {
  point.energy++;
  field[point.y][point.x]++;
}

for await (const line of stdinLines()) {
  if (!line) {
    continue;
  }
  const row = line.split("").map((n) => +n);
  field.push(row);
}

let syncFlashStep = 0;
let step = 1;
while (!syncFlashStep) {
  let flashesThisStep = 0;
  for (const point of pointsOfField()) {
    flashesThisStep += incrementAndMaybeFlash(point);
  }
  for (const point of pointsOfField()) {
    if (point.energy > 9) {
      field[point.y][point.x] = 0;
    }
  }
  if (flashesThisStep === 100) {
    syncFlashStep = step;
  }
  step++;
}

console.log(syncFlashStep);
