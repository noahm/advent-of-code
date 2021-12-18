interface LiteralNumber {
  type: "literal";
  value: number;
  parent: NumberPair;
  prev: LiteralNumber | null;
  next: LiteralNumber | null;
}

interface NumberPair {
  type: "pair";
  left: LiteralNumber | NumberPair;
  right: LiteralNumber | NumberPair;
  parent: null | NumberPair;
}

export type Node = NumberPair | LiteralNumber;

/** Yes, I realized later I could just use JSON.parse but I'm proud of this too */
export function parseLineToPair(line: string): NumberPair {
  let lastLiteral: LiteralNumber | null = null;
  function readNumberPair(line: string): NumberPair {
    const ret: NumberPair = {
      type: "pair",
      left: {},
      right: {},
      parent: null,
    } as NumberPair;
    let depth = 0;
    let dividerPos: number | undefined;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === "[") {
        depth += 1;
      } else if (char === "]") {
        depth -= 1;
      } else if (char === "," && depth === 1) {
        dividerPos = i;
        break;
      }
    }
    if (dividerPos === undefined) {
      throw new Error("malformed pair: " + line);
    }
    const left = line.slice(1, dividerPos);
    const right = line.slice(dividerPos + 1, -1);
    if (left.startsWith("[")) {
      ret.left = readNumberPair(left);
      ret.left.parent = ret;
    } else {
      ret.left = {
        type: "literal",
        value: +left,
        parent: ret,
        prev: lastLiteral,
        next: null,
      };
      if (lastLiteral) {
        lastLiteral.next = ret.left;
      }
      lastLiteral = ret.left;
    }
    if (right.startsWith("[")) {
      ret.right = readNumberPair(right);
      ret.right.parent = ret;
    } else {
      ret.right = {
        type: "literal",
        value: +right,
        parent: ret,
        prev: lastLiteral,
        next: null,
      };
      if (lastLiteral) {
        lastLiteral.next = ret.right;
      }
      lastLiteral = ret.right;
    }
    return ret;
  }
  return readNumberPair(line);
}

function reducePair(p: NumberPair) {
  let changes = true;
  while (changes) {
    changes = reduceStep(p);
    // console.log(printPair(p));
  }
}

function findPairToExplode(p: Node, depth = 1): NumberPair | null {
  if (p.type === "literal") {
    return null;
  }
  if (depth < 4) {
    return (
      findPairToExplode(p.left, depth + 1) ||
      findPairToExplode(p.right, depth + 1)
    );
  }
  if (depth === 4) {
    if (p.left.type === "pair") {
      return p.left;
    }
    if (p.right.type === "pair") {
      return p.right;
    }
  }
  return null;
}

function explodePair(p: NumberPair) {
  // explodes should only ever happen on pairs with parents
  const parent = p.parent!;
  // explodes should only ever happen on pairs of literals
  const left = p.left as LiteralNumber;
  const right = p.right as LiteralNumber;

  const replacement: LiteralNumber = {
    type: "literal",
    value: 0,
    parent,
    prev: left.prev,
    next: right.next,
  };

  if (left.prev) {
    left.prev.value += left.value;
    left.prev.next = replacement;
  }
  if (right.next) {
    right.next.value += right.value;
    right.next.prev = replacement;
  }
  if (parent.left === p) {
    parent.left = replacement;
  } else {
    parent.right = replacement;
  }
}

function splitIfNeeded(p: Node): boolean {
  if (p.type === "pair") {
    return splitIfNeeded(p.left) || splitIfNeeded(p.right);
  }
  if (p.value > 9) {
    const half = p.value / 2;
    const left: LiteralNumber = {
      type: "literal",
      value: Math.floor(half),
      parent: p.parent,
      prev: p.prev,
      next: null,
    };
    const right: LiteralNumber = {
      type: "literal",
      value: Math.ceil(half),
      parent: p.parent,
      prev: left,
      next: p.next,
    };
    left.next = right;
    const replacement: NumberPair = {
      type: "pair",
      left,
      right,
      parent: p.parent,
    };
    left.parent = replacement;
    right.parent = replacement;
    if (p.prev) {
      p.prev.next = left;
    }
    if (p.next) {
      p.next.prev = right;
    }
    if (p.parent.left === p) {
      p.parent.left = replacement;
    } else {
      p.parent.right = replacement;
    }
    return true;
  }
  return false;
}

/** returns true if step was taken */
function reduceStep(p: NumberPair): boolean {
  const pairToExplode = findPairToExplode(p);
  if (pairToExplode) {
    explodePair(pairToExplode);
    return true;
  }
  return splitIfNeeded(p);
}

function literalAtEdge(p: Node, dir: "right" | "left"): LiteralNumber {
  if (p.type === "literal") {
    return p;
  }
  return literalAtEdge(p[dir], dir);
}

export function addPairs(left: NumberPair, right: NumberPair): NumberPair {
  const ret: NumberPair = { type: "pair", left, right, parent: null };
  left.parent = ret;
  right.parent = ret;
  const seamLeft = literalAtEdge(left, "right");
  const seamRight = literalAtEdge(right, "left");
  seamLeft.next = seamRight;
  seamRight.prev = seamLeft;
  reducePair(ret);
  return ret;
}

export function printPair(p: Node): string {
  if (p.type === "literal") {
    return p.value.toString();
  }
  return `[${printPair(p.left)},${printPair(p.right)}]`;
}

export function magnitude(n: Node): number {
  if (n.type === "literal") {
    return n.value;
  }
  return magnitude(n.left) * 3 + magnitude(n.right) * 2;
}
