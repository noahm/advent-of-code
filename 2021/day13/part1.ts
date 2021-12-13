import { stdinLines } from "../shared/stdin.ts";

interface Point {
  x: number;
  y: number;
}

const holes: Point[] = [];

// point to string
function pts(p: Point) {
  return `${p.x},${p.y}`;
}

function foldAlong(axis: "x" | "y", foldCord: number) {
  for (const hole of holes) {
    const oldCord = hole[axis];
    if (oldCord > foldCord) {
      hole[axis] -= Math.abs(foldCord - oldCord) * 2;
    }
  }
}

const uniquePoints = () => new Set(holes.map(pts));

for await (const line of stdinLines()) {
  if (!line) {
    continue;
  }
  const coords = line.split(",");
  if (coords.length > 1) {
    const [x, y] = coords.map((n) => +n);
    holes.push({ x, y });
    continue;
  }
  const axis = line[11] as "x" | "y";
  const coord = +line.slice(13);
  foldAlong(axis, coord);
  break;
}

console.log(uniquePoints().size);
