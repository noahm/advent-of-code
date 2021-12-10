import { stdinLines } from "../shared/stdin.ts";

const openers = new Set(["<", "[", "{", "("]);
const closers = new Set([">", "]", "}", ")"]);

function scoreForMissingChar(char: string) {
  switch (char) {
    case ")":
      return 1;
    case "}":
      return 3;
    case "]":
      return 2;
    case ">":
      return 4;
    default:
      return 0;
  }
}

function scoreForMissing(chars: string) {
  let score = 0;
  for (let i = 0; i < chars.length; i++) {
    score = score * 5 + scoreForMissingChar(chars[i]);
  }
  return score;
}

function pairForChar(char: string) {
  switch (char) {
    case "(":
      return ")";
    case "{":
      return "}";
    case "[":
      return "]";
    case "<":
      return ">";
    default:
      return "";
  }
}

type ParseResult =
  | {
      type: "success";
    }
  | {
      type: "corrupt";
      expected: string;
      found: string;
    }
  | {
      type: "incomplete";
      missing: string;
    };

function parseLine(line: string): ParseResult {
  const stack: string[] = [];
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (openers.has(char)) {
      stack.push(pairForChar(char));
      continue;
    } else if (closers.has(char)) {
      const expected = stack.pop();
      if (expected !== char) {
        return {
          type: "corrupt",
          expected: expected || "<<EOL>>",
          found: char,
        };
      }
    }
  }
  if (stack.length) {
    return { type: "incomplete", missing: stack.reverse().join("") };
  }
  return { type: "success" };
}

const scores: number[] = [];
for await (const line of stdinLines()) {
  if (!line) {
    continue;
  }
  const parsed = parseLine(line);
  if (parsed.type === "incomplete") {
    scores.push(scoreForMissing(parsed.missing));
  }
}
scores.sort((a, b) => a - b);

console.log(scores[Math.floor(scores.length / 2)]);
