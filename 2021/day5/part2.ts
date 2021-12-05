import { stdinLines } from "../shared/stdin.ts";
import { CountingSet } from "../shared/counting-set.ts";

interface Point {
  x: number;
  y: number;
  asString: string;
}

type Line = [Point, Point];

function parsePoints(line: string) {
  const cords = line.split(" -> ");

  return cords.map((cord) => {
    const [x, y] = cord.split(",").map((n) => +n);
    return { x, y, asString: cord };
  }) as Line;
}

function* pointsAlongLine([a, b]: Line) {
  if (a.x === b.x) {
    const start = Math.min(a.y, b.y);
    const end = Math.max(a.y, b.y);
    for (let i = start; i <= end; i++) {
      yield { x: a.x, y: i, asString: `${a.x},${i}` };
    }
  } else if (a.y === b.y) {
    const start = Math.min(a.x, b.x);
    const end = Math.max(a.x, b.x);
    for (let i = start; i <= end; i++) {
      yield { x: i, y: a.y, asString: `${i},${a.y}` };
    }
  } else {
    const start = a.x > b.x ? b : a;
    const end = start === b ? a : b;
    for (let x = start.x, y = start.y; x <= end.x; x++, y = incrTo(y, end.y)) {
      yield { x, y, asString: `${x},${y}` };
    }
  }
}

function incrTo(curr: number, target: number) {
  if (curr < target) {
    return curr + 1;
  } else if (curr > target) {
    return curr - 1;
  }
  return curr;
}

let twoOrMore = 0;
const seenPoints = new CountingSet<string>();
for await (const line of stdinLines()) {
  if (!line) {
    continue;
  }
  for (const point of pointsAlongLine(parsePoints(line))) {
    const pointCount = seenPoints.add(point.asString);
    if (pointCount === 2) {
      twoOrMore++;
    }
  }
}

console.log("final answer", twoOrMore);
