import { stdinLines } from "../shared/stdin.ts";

const pos = { x: 0, depth: 0, aim: 0 };

for await (const line of stdinLines()) {
  if (!line) {
    continue;
  }
  const [command, magnitudeStr] = line.split(" ");
  const magnitude = +magnitudeStr;
  switch (command) {
    case "up":
      pos.aim += magnitude;
      break;
    case "down":
      pos.aim -= magnitude;
      break;
    case "forward":
      pos.x += magnitude;
      pos.depth += pos.aim * magnitude;
  }
}
console.log("final pos", pos);
console.log("final answer", pos.x * pos.depth);
