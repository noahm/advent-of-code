import { stdinLines } from "../shared/stdin.ts";

const BOARD_SIZE = 5;

function* chunk<T>(arr: T[], chunkSize = BOARD_SIZE) {
  for (
    let chunkOffset = 0;
    chunkOffset + chunkSize <= arr.length;
    chunkOffset += chunkSize
  ) {
    const chunk: T[] = [];
    for (let j = 0; j < chunkSize; j++) {
      chunk.push(arr[chunkOffset + j]);
    }
    yield chunk;
  }
}

const potentialWinSequences = new Map([
  [0, [1, BOARD_SIZE, BOARD_SIZE + 1]],
  [1, [BOARD_SIZE]],
  [2, [BOARD_SIZE]],
  [3, [BOARD_SIZE]],
  [4, [BOARD_SIZE, BOARD_SIZE - 1]],
  [5, [1]],
  [10, [1]],
  [15, [1]],
  [20, [1]],
]);

/** models a NxN bingo board */
class BingoBoard {
  private field: number[] = [];
  private numbersToLoc = new Map<number, number>();
  private marks: boolean[] = [];
  private hasWon = false;

  constructor(rows: string[]) {
    for (const row of rows) {
      this.field.push(
        ...row
          .split(/\s+/)
          .filter((s) => !!s)
          .map((n) => +n)
      );
    }
    this.field.forEach((n, i) => {
      this.numbersToLoc.set(n, i);
    });
  }

  markDrawnNumber(n: number) {
    const locInField = this.numbersToLoc.get(n);
    if (locInField === undefined) {
      return false;
    }
    this.marks[locInField] = true;
    if (this.hasWon) {
      return false;
    }
    const didWin = this.areMarksWinning();
    if (didWin) {
      this.hasWon = true;
    }
    return didWin;
  }

  areMarksWinning() {
    for (const [start, intervals] of potentialWinSequences.entries()) {
      interval: for (const interval of intervals) {
        for (let idx = start, loops = 0; loops < 5; idx += interval, loops++) {
          if (!this.marks[idx]) {
            break interval;
          }
        }
        return true;
      }
    }
  }

  /** sum of all unmarked numbers */
  score() {
    return this.field.reduce((score, curr, idx) => {
      if (!this.marks[idx]) {
        return score + curr;
      }
      return score;
    }, 0);
  }

  toString() {
    return Array.from(chunk(this.field)).reduce(
      (str, cur) => str + cur.toString() + "\n",
      `BingoBoard:\n`
    );
  }
}

const lines: string[] = [];
for await (const line of stdinLines()) {
  if (!line) {
    continue;
  }
  lines.push(line);
}

const drawOrder: number[] = lines
  .shift()!
  .split(",")
  .map((n) => +n);

const boards: BingoBoard[] = [];
for (const board of chunk(lines)) {
  boards.push(new BingoBoard(board));
}

let lastWinScore: number | undefined;

for (const drawnNumber of drawOrder) {
  for (const board of boards) {
    if (board.markDrawnNumber(drawnNumber)) {
      lastWinScore = board.score() * drawnNumber;
    }
  }
}

console.log("last winning board score", lastWinScore);
