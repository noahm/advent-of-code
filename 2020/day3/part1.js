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
  console.log(`will hit ${raycast(3, 1)} trees on the way down`);
}
main();
