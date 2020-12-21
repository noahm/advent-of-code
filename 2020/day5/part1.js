const readline = require("readline");

function decodeSeat(code) {
  let row = 0;
  let column = 0;
  for (const char of code) {
    switch (char) {
      case "F": //0
      case "B": //1
        row *= 2;
        if (char === "B") {
          row += 1;
        }
        break;

      case "L": //0
      case "R": //1
        column *= 2;
        if (char === "R") {
          column += 1;
        }
    }
  }

  return { row, column, id: row * 8 + column };
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
  });
  let lineCount = 0;
  let maxID = 0;
  for await (const line of rl) {
    if (line) {
      lineCount++;
      maxID = Math.max(maxID, decodeSeat(line).id);
    }
  }
  console.log(`read ${lineCount} boarding passes, max id was ${maxID}`);
}
main();
