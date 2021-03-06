const readline = require("readline");

const map = [];

function isTree(x, y) {
  return map[y][x % map[0].length] === "#";
}

function raycast(x, y) {
  const loc = [0, 0];
  let totalTrees = 0;
  while (loc[1] < map.length) {
    if (isTree(...loc)) {
      totalTrees++;
    }
    loc[0] += x;
    loc[1] += y;
  }
  return totalTrees;
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
  });
  let total = 0;
  for await (const line of rl) {
    if (!line) continue;
    total++;
    map.push(line.split(""));
  }
  console.log(`read ${total} lines of map`);
  const slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ];
  let product = 1;
  for (const slope of slopes) {
    product *= raycast(...slope);
  }
  console.log(`product of slopes is ${product}`);
}
main();
