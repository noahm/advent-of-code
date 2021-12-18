const example = {
  xRange: [20, 30],
  yRange: [-10, -5],
} as const;

const input = {
  xRange: [244, 303],
  yRange: [-91, -54],
} as const;

const target = input;

function stepToZero(n: number) {
  if (n > 0) {
    return n - 1;
  } else if (n < 0) {
    return n + 1;
  }
  return 0;
}

function inRange(n: number, [min, max]: readonly [number, number]) {
  return n >= min && n <= max;
}

function hitsTarget(vel: { x: number; y: number }) {
  const pos = { x: 0, y: 0 };
  while (true) {
    pos.x += vel.x;
    pos.y += vel.y;
    vel.x = stepToZero(vel.x);
    vel.y -= 1;
    if (pos.x > target.xRange[1] || pos.y < target.yRange[0]) {
      return false;
    }
    if (inRange(pos.x, target.xRange) && inRange(pos.y, target.yRange)) {
      return true;
    }
  }
}

const minXvel = Math.floor(Math.sqrt(target.xRange[0] * 2));
const maxXVel = target.xRange[1];
const maxYVel = Math.abs(target.yRange[0]) - 1;
const minYVel = target.yRange[0];

console.log({
  minXvel,
  maxXVel,
  minYVel,
  maxYVel,
});

const velocityOptions = new Set<string>();
for (let x = minXvel; x <= maxXVel; x++) {
  for (let y = minYVel; y <= maxYVel; y++) {
    if (hitsTarget({ x, y })) {
      velocityOptions.add(`${x},${y}`);
    }
  }
}
// console.log(velocityOptions);
console.log(velocityOptions.size);
