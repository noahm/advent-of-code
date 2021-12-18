const example = {
  xRange: [20, 30],
  yRange: [-10, -5],
};

const input = {
  xRange: [244, 303],
  yRange: [-91, -54],
};

const target = input;
const xVel = Math.floor(Math.sqrt(target.xRange[0] * 2));
const yVel = Math.abs(target.yRange[0]) - 1;
const height = (yVel * (yVel + 1)) / 2;
console.log({ xVel, yVel, height });
