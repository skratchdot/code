const { debug, run } = require('../../lib');

const solve2 = (lines) => {
  const isFourDigits = (v) => /^\d{4}$/.test(v);
  const isAtLeast = (v, val) => parseFloat(v) >= val;
  const isAtMost = (v, val) => parseFloat(v) <= val;
  const isCm = (v) =>
    /^\d+cm$/.test(v) && isAtLeast(v, 150) && isAtMost(v, 193);
  const isIn = (v) => /^\d+in$/.test(v) && isAtLeast(v, 59) && isAtMost(v, 76);

  const required = [
    ['byr', (v) => isFourDigits(v) && isAtLeast(v, 1920) && isAtMost(v, 2002)],
    ['iyr', (v) => isFourDigits(v) && isAtLeast(v, 2010) && isAtMost(v, 2020)],
    ['eyr', (v) => isFourDigits(v) && isAtLeast(v, 2020) && isAtMost(v, 2030)],
    ['hgt', (v) => isCm(v) || isIn(v)],
    ['hcl', (v) => /^#[0-9a-f]{6}$/.test(v)],
    [
      'ecl',
      (v) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(v),
    ],
    ['pid', (v) => /^\d{9}$/.test(v)],
  ];

  let count = 0;
  let current = new Map();

  const check = () => {
    for (let i = 0; i < required.length; i++) {
      const [key, fn] = required[i];
      if (!current.has(key)) {
        return;
      } else {
        const val = current.get(key);
        if (!fn(val)) {
          return;
        }
      }
    }
    count++;
    debug(current);
  };

  lines.forEach((line) => {
    const keys = line
      .split(/\s+/)
      .filter((v) => v)
      .map((v) => v.split(':'));
    keys.forEach((v) => current.set(v[0], v[1]));
    // new passport
    if (keys.length === 0) {
      check();
      current = new Map();
    }
  });
  check();
  debug({ count });
  return count;
};

run(__dirname, 'inputtest', solve2, 2);
run(__dirname, 'inputinvalid', solve2, 0);
run(__dirname, 'inputvalid', solve2, 4);
run(__dirname, 'input', solve2, 150);

/*
--- Part Two ---

The line is moving more quickly now, but you overhear airport security talking about how passports with invalid data are getting through. Better add some data validation, quick!

You can continue to ignore the cid field, but each other field has strict rules about what values are valid for automatic validation:

    byr (Birth Year) - four digits; at least 1920 and at most 2002.
    iyr (Issue Year) - four digits; at least 2010 and at most 2020.
    eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
    hgt (Height) - a number followed by either cm or in:
        If cm, the number must be at least 150 and at most 193.
        If in, the number must be at least 59 and at most 76.
    hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
    ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
    pid (Passport ID) - a nine-digit number, including leading zeroes.
    cid (Country ID) - ignored, missing or not.

Your job is to count the passports where all required fields are both present and valid according to the above rules. Here are some example values:

byr valid:   2002
byr invalid: 2003

hgt valid:   60in
hgt valid:   190cm
hgt invalid: 190in
hgt invalid: 190

hcl valid:   #123abc
hcl invalid: #123abz
hcl invalid: 123abc

ecl valid:   brn
ecl invalid: wat

pid valid:   000000001
pid invalid: 0123456789

Here are some invalid passports:

eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946

hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007

Here are some valid passports:

pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f

eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719

Count the number of valid passports - those that have all required fields and valid values. Continue to treat cid as optional. In your batch file, how many passports are valid?

Your puzzle answer was 150.
*/
