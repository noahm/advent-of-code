import { stdinLines } from "../shared/stdin.ts";
import { SingleLinkedList } from "../shared/linked-list.ts";
import { CountingSet } from "../shared/counting-set.ts";

const polymer = new SingleLinkedList<string>();
const counts = new CountingSet<string>();
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
      counts.add(char);
    }
  }
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

for (let step = 1; step <= 10; step++) {
  for (const [a, b] of pairsOf(polymer.nodes())) {
    const newElement = insertions.get(a.item + b.item);
    if (newElement) {
      polymer.addAfter(a, newElement);
      counts.add(newElement);
    }
  }
}

const sortedCounts = Array.from(counts.entries()).sort((a, b) => a[1] - b[1]);
console.log(sortedCounts);
console.log(sortedCounts[sortedCounts.length - 1][1] - sortedCounts[0][1]);
