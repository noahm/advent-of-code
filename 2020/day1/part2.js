const readline = require("readline");

const inputs = [];

function report(a, b, c) {
  console.log(`Found: ${a} + ${b} + ${c} = 2020`);
  console.log(`Answer: ${a} x ${b} x ${c} = ${a * b * c}`);
  process.exit(0);
}

function trySum(stack, nextIndex) {
  const inputSum = stack.reduce((acc, next) => acc + next, 0);
  if (inputSum === 2020 && stack.length === 3) {
    report(...stack);
    return;
  }
  if (inputSum < 2020 && stack.length <= 2 && nextIndex < inputs.length) {
    console.log(inputSum, stack.length + 1, inputSum);
    const nextStack = [...stack, 0];
    const editIndex = nextStack.length - 1;
    for (let i = nextIndex; i < inputs.length; i++) {
      nextStack[editIndex] = inputs[i];
      trySum(nextStack, i + 1);
    }
  }
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
  });
  for await (const line of rl) {
    if (!line) continue;
    const number = +line;
    inputs.push(number);
  }
  console.log(`read ${inputs.length} inputs`);
  trySum([], 0);
}
main();
