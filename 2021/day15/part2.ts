import { stdinLines } from "../shared/stdin.ts";
import { PQueue } from "../shared/p-queue.ts";

interface Path {
  path: Point[];
  cost: number;
}

interface Loc {
  risk: number;
  bestPathToReach?: Path;
  visited: boolean;
}

// count number of times we've seen unique digit lengths
const field: Loc[][] = [];

interface Point extends Loc {
  x: number;
  y: number;
}

function pointFrom(x: number, y: number): Point {
  const ret = field[y][x] as Point;
  ret.x = x;
  ret.y = y;
  return ret;
}

function* neighborsOf({ x, y }: Point) {
  if (x > 0) {
    yield pointFrom(x - 1, y);
  }
  if (y > 0) {
    yield pointFrom(x, y - 1);
  }
  if (y + 1 < field.length) {
    yield pointFrom(x, y + 1);
  }
  if (x + 1 < field[0].length) {
    yield pointFrom(x + 1, y);
  }
}

function sc(n: number, scale: number) {
  let ret = n + scale;
  if (ret > 9) {
    ret -= 9;
  }
  return ret;
}

const tempField: number[][] = [];
for await (const line of stdinLines()) {
  if (!line) {
    continue;
  }
  const row = line.split("").map((n) => +n);
  const scaledRow: number[] = [];
  for (let scale = 0; scale < 5; scale++) {
    scaledRow.push(
      ...row.map((n) => {
        return sc(n, scale);
      })
    );
  }
  tempField.push(scaledRow);
}
for (let scale = 0; scale < 5; scale++) {
  for (const row of tempField) {
    field.push(row.map((i) => ({ risk: sc(i, scale), visited: false })));
  }
}

function newPath(): Path {
  return {
    path: [],
    cost: 0,
  };
}

function clonePath(p: Path): Path {
  return {
    path: p.path.slice(),
    cost: p.cost,
  };
}

const firstPoint = pointFrom(0, 0);
firstPoint.bestPathToReach = newPath();
firstPoint.risk = 0;
const pointsToInspect = new PQueue<Point>();
pointsToInspect.push(firstPoint, 0);

while (pointsToInspect.length) {
  const next = pointsToInspect.shift();
  if (!next || next.visited) continue;
  next.visited = true;

  const currentPath = clonePath(next.bestPathToReach!);
  currentPath.path.push(next);
  currentPath.cost += next.risk;

  const neighbors = Array.from(neighborsOf(next));
  for (const p of neighbors) {
    if (!p.bestPathToReach || p.bestPathToReach.cost > currentPath.cost) {
      p.bestPathToReach = currentPath;
    }
    if (!p.visited) {
      pointsToInspect.push(p, currentPath.cost + p.risk);
    }
  }
}

const lastPoint = field[field.length - 1][field[0].length - 1];
console.log(
  "Total risk along path",
  lastPoint.bestPathToReach!.cost + lastPoint.risk
);
