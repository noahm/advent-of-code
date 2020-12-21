const readline = require("readline");

const requiredFields = ["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"];
const optionalFields = ["cid"];

const eyeColors = new Set(["amb", "blu", "brn", "gry", "grn", "hzl", "oth"]);

function validateField(key, val) {
  switch (key) {
    case "byr": {
      const asInt = +val;
      return asInt >= 1920 && asInt <= 2002;
    }
    case "iyr": {
      const asInt = +val;
      return asInt >= 2010 && asInt <= 2020;
    }
    case "eyr": {
      const asInt = +val;
      return asInt >= 2020 && asInt <= 2030;
    }
    case "hgt": {
      const m = val.match(/^(\d+)(cm|in)$/);
      if (!m) {
        return false;
      }
      const asInt = +m[1];
      if (m[2] === "in" && (asInt < 59 || asInt > 76)) {
        return false;
      } else if (m[2] === "cm" && (asInt < 150 || asInt > 193)) {
        return false;
      }
      return true;
    }
    case "hcl":
      return !!val.match(/^#[0-9a-f]{6}$/);
    case "ecl":
      return eyeColors.has(val);
    case "pid":
      return !!val.match(/^[0-9]{9}$/);
  }
  return true;
}

function addPassportFields(line, passportObj) {
  for (const field of line.split(" ")) {
    const [key, val] = field.split(":");
    if (validateField(key, val)) {
      passportObj[key] = val;
    }
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
