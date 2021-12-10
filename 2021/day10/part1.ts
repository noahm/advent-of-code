import { stdinLines } from "../shared/stdin.ts";

const openers = new Set(["<", "[", "{", "("]);
const closers = new Set([">", "]", "}", ")"]);

function scoreForErr(char: string) {
  switch (char) {
    case ")":
      return 3;
    case "}":
      return 1197;
    case "]":
      return 57;
    case ">":
      return 25137;
    default:
      return 0;
  }
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
    };

function parseLine(line: string): ParseResult {
  const stack = [];
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
    return { type: "incomplete" };
  }
  return { type: "success" };
}

let score = 0;
for await (const line of stdinLines()) {
  if (!line) {
    continue;
  }
  const parsed = parseLine(line);
  if (parsed.type === "corrupt") {
    score += scoreForErr(parsed.found);
  }
}

console.log(score);
