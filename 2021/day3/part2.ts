import { stdinLines } from "../shared/stdin.ts";

function binStrToNumber(str: string) {
  let ret = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "1") {
      ret += 1 << (str.length - 1 - i);
    }
  }
  return ret;
}

function mostCommonAtPos(arr: string[], pos: number) {
  let ones = 0;
  for (const item of arr) {
    const char = item[pos];
    if (char === "1") ones += 1;
  }
  if (ones >= arr.length / 2) {
    return "1";
  }
  return "0";
}

const lines: string[] = [];
for await (const line of stdinLines()) {
  if (!line) {
    continue;
  }
  lines.push(line);
}

const totalBits = lines[0].length;
let oxygens = lines;
let scrubbers = lines;
let finalOxGen: number | undefined;
let finalScrubber: number | undefined;

for (let i = 0; i < totalBits; i++) {
  const mostCommonValue = mostCommonAtPos(oxygens, i);
  oxygens = oxygens.filter((v) => v[i] === mostCommonValue);
  if (oxygens.length === 1) {
    finalOxGen = binStrToNumber(oxygens[0]);
  }

  const mostCommonCO2 = mostCommonAtPos(scrubbers, i);
  scrubbers = scrubbers.filter((v) => v[i] !== mostCommonCO2);
  if (scrubbers.length === 1) {
    finalScrubber = binStrToNumber(scrubbers[0]);
  }
}

console.log("final", { finalOxGen, finalScrubber });
console.log("final answer", finalOxGen! * finalScrubber!);
