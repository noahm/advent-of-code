const readline = require("readline");

function parseRule(rule) {
  const [range, char] = rule.split(" ");
  const [low, high] = range.split("-").map((n) => +n);
  return {
    char,
    high,
    low,
  };
}

function isValidPassword(rule, password) {
  const { char: targetChar, high, low } = parseRule(rule);
  let total = 0;
  for (const char of password.split("")) {
    if (char === targetChar) {
      total++;
      if (total > high) {
        return false;
      }
    }
  }
  if (total < low) {
    return false;
  }
  return true;
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
  });
  let total = 0;
  let valid = 0;
  for await (const line of rl) {
    if (!line) continue;
    total++;
    const [rule, password] = line.split(": ");
    if (isValidPassword(rule, password)) {
      valid++;
    } else {
      console.log(line);
    }
  }
  console.log(
    `read ${valid} valid passwords of ${total} (${total - valid} invalid)`
  );
}
main();
