const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const year = 2020;
const maxDay = 25;
const currentDay = new Date().getDate();
// get your session cookie for https://adventofcode.com/ and set it in your terminal:
// export AOC_COOKIE=""
const cookie = process.env.AOC_COOKIE;

(async () => {
  for (let day = 1; day <= currentDay && day <= maxDay; day++) {
    const dayPad = day.toString().padStart(2, 0);
    const dayFolder = path.resolve(__dirname, `../day/${dayPad}`);
    const dayInput = path.resolve(dayFolder, 'input');
    if (!fs.existsSync(dayFolder)) {
      console.log(`Creating path:\n${dayFolder}`);
      fs.mkdirSync(dayFolder, { recursive: true });
    }
    if (!fs.existsSync(dayInput)) {
      const inputUrl = `https://adventofcode.com/${year}/day/${day}/input`;
      console.log(`Downloading input:\n${inputUrl}\nand saving:\n${dayInput}`);
      const res = await fetch(inputUrl, {
        headers: { Cookie: `session=${cookie}` },
      });
      const input = await res.text();
      fs.writeFileSync(dayInput, input, 'utf8');
    }
  }
})().catch(console.error);
