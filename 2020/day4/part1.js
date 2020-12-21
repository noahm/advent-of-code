const readline = require("readline");

const requiredFields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
const optionalFields = ["cid"];

function addPassportFields(line, passportObj) {
  for (const field of line.split(" ")) {
    const [key, val] = field.split(":");
    passportObj[key] = val;
  }
}

function isPassportValid(passportObj) {
  return requiredFields.every((field) => passportObj.hasOwnProperty(field));
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
  });
  let total = 0;
  let valid = 0;
  let passport = {};
  for await (const line of rl) {
    if (line) {
      addPassportFields(line, passport);
    } else {
      total++;
      if (isPassportValid(passport)) {
        valid++;
      }
      passport = {};
    }
  }
  total++;
  if (isPassportValid(passport)) {
    valid++;
  }
  console.log(
    `read ${valid} valid passports of ${total} (${total - valid} invalid)`
  );
}
main();
