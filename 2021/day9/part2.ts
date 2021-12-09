import { stdinLines } from "../shared/stdin.ts";

// count number of times we've seen unique digit lengths
const field: number[][] = [];

function pointFrom(x: number, y: number): Point {
  return { x, y, height: field[y][x] };
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

// point to string
function pts(p: Point) {
  return `${p.x},${p.y}`;
}

function basinSize(lowPoint: Point) {
  const points = new Set<string>([pts(lowPoint)]);
  const pointsToInspect = Array.from(neighborsOf(lowPoint));
  while (pointsToInspect.length) {
    const point = pointsToInspect.shift();
    if (!point || point.height > 8 || points.has(pts(point))) {
      continue;
    }
    points.add(pts(point));
    pointsToInspect.push(...Array.from(neighborsOf(point)));
  }
  return points.size;
}

for await (const line of stdinLines()) {
  if (!line) {
    continue;
  }
  const row = line.split("").map((n) => +n);
  field.push(row);
}

interface Point {
  x: number;
  y: number;
  height: number;
}

const basins: Array<[Point, number]> = [];

for (let y = 0; y < field.length; y++) {
  for (let x = 0; x < field[0].length; x++) {
    const point = pointFrom(x, y);
    if (Array.from(neighborsOf(point)).every((n) => n.height > point.height)) {
      basins.push([point, basinSize(point)]);
    }
  }
}

basins.sort((a, b) => {
  return b[1] - a[1];
});

console.log(basins[0][1] * basins[1][1] * basins[2][1]);
