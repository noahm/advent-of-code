import { stdinLines } from "../shared/stdin.ts";
import { SingleLinkedList } from "../shared/linked-list.ts";

type Counts = Record<string, number>;
function incr(c: Counts, k: string, v = 1) {
  if (!c[k]) {
    c[k] = v;
  } else {
    c[k] += v;
  }
}

const polymer = new SingleLinkedList<string>();
let counts: Counts = {};
const insertions = new Map<string, string>();

for await (const line of stdinLines()) {
  if (!line) {
    continue;
  }
  const [a, b] = line.split(" -> ");
  if (b) {
    insertions.set(a, b);
  } else {
    for (const char of line.split("")) {
      polymer.add(char);
      incr(counts, char);
    }
  }
}

function merge(...counts: Counts[]) {
  const ret: Counts = {};
  for (const item of counts) {
    for (const [k, v] of Object.entries(item)) {
      incr(ret, k, v);
    }
  }
  return ret;
}

const countsCache: Record<string, Counts> = {};

function cacheKey(pair: string, steps: number) {
  return `${pair}@${steps}`;
}

function countExpansions(pair: string, steps: number): Counts {
  const key = cacheKey(pair, steps);
  if (countsCache[key]) return countsCache[key];

  let counts: Counts = {};
  const newElement = insertions.get(pair);
  if (newElement) {
    incr(counts, newElement);
    if (steps > 1) {
      const [left, right] = pair;
      counts = merge(
        counts,
        countExpansions(left + newElement, steps - 1),
        countExpansions(newElement + right, steps - 1)
      );
    }
  }
  countsCache[key] = counts;
  return counts;
}

function* pairsOf<T>(gen: IterableIterator<T>) {
  let last: T | undefined;
  for (const item of gen) {
    if (last) {
      yield [last, item];
    }
    last = item;
  }
}

for (const [left, right] of pairsOf(polymer.values())) {
  counts = merge(counts, countExpansions(left + right, 40));
}

const sortedCounts = Object.entries(counts).sort((a, b) => a[1] - b[1]);
console.log(sortedCounts);
console.log(sortedCounts[sortedCounts.length - 1][1] - sortedCounts[0][1]);
