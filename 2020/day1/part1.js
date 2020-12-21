const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
});

const wanted = new Set();

rl.on("line", (input) => {
  const number = +input;
  const pair = 2020 - number;
  if (wanted.has(number)) {
    console.log(`Found: ${pair} + ${number} = 2020`);
    console.log(`Answer: ${pair} x ${number} = ${pair * number}`);
    process.exit(0);
  }
  wanted.add(pair);
});
