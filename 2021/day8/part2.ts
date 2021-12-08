import { stdinLines } from "../shared/stdin.ts";

interface DecodeClues {
  rightSides: string[];
  top: string;
  topLeftAndCenter: string[];
}

function decodeDigit(digit: string, clues: DecodeClues) {
  switch (digit.length) {
    case 2:
      return 1;
    case 3:
      return 7;
    case 4:
      return 4;
    case 5:
      if (clues.rightSides.every((v) => digit.includes(v))) {
        return 3;
      }
      if (clues.topLeftAndCenter.every((v) => digit.includes(v))) {
        return 5;
      }
      return 2;
    case 6:
      if (!clues.rightSides.every((v) => digit.includes(v))) {
        return 6;
      }
      if (clues.topLeftAndCenter.every((v) => digit.includes(v))) {
        return 9;
      }
      return 0;
    case 7:
      return 8;
  }
  return -1;
}

function decodeDisplay(display: string[], clues: DecodeClues) {
  let total = 0;
  let place = 10 ** (display.length - 1);
  for (const digit of display) {
    total += decodeDigit(digit, clues) * place;
    place /= 10;
  }
  return total;
}

let sum = 0;
for await (const line of stdinLines()) {
  if (!line) {
    continue;
  }
  const notes = line.split(" ");
  const observed = notes.slice(0, 10);
  const patternsByLength = new Map<number, string[]>();
  for (const pattern of observed) {
    if (patternsByLength.has(pattern.length)) {
      patternsByLength.get(pattern.length)!.push(pattern);
    } else {
      patternsByLength.set(pattern.length, [pattern]);
    }
  }
  const rightSides = patternsByLength.get(2)![0].split("");
  const top = patternsByLength
    .get(3)![0]
    .split("")
    .filter((l) => !rightSides.includes(l))[0];
  const topLeftAndCenter = patternsByLength
    .get(4)![0]
    .split("")
    .filter((l) => !rightSides.includes(l));

  const display = notes.slice(11);
  sum += decodeDisplay(display, { rightSides, top, topLeftAndCenter });
}

console.log(sum);
