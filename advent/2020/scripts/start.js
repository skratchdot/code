const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const sane = require('sane');
const util = require('util');
const { spawn } = require('child_process');

const year = new Date().getFullYear();
const maxDay = 25;
const currentDay = new Date().getDate();
// get your session cookie for https://adventofcode.com/ and set it in your terminal:
// export AOC_COOKIE=""
const cookie = process.env.AOC_COOKIE;

const getDayFolder = (day) => {
  const dayPad = day.toString().padStart(2, 0);
  const dayFolder = path.resolve(__dirname, `../day/${dayPad}`);
  return dayFolder;
};

const writeTestFiles = async (dayFolder) => {
  try {
    for (let day = 1; day <= currentDay && day <= maxDay; day++) {
      const dayInput = path.resolve(dayFolder, 'input');
      if (!fs.existsSync(dayFolder)) {
        console.log(`Creating path:\n${dayFolder}`);
        fs.mkdirSync(dayFolder, { recursive: true });
      }
      if (!fs.existsSync(dayInput)) {
        const inputUrl = `https://adventofcode.com/${year}/day/${day}/input`;
        console.log(
          `Downloading input:\n${inputUrl}\nand saving:\n${dayInput}`
        );
        const res = await fetch(inputUrl, {
          headers: { Cookie: `session=${cookie}` },
        });
        const input = await res.text();
        fs.writeFileSync(dayInput, input, 'utf8');
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const runTests = async (dayFolder) =>
  new Promise((resolve) => {
    const options = { stdio: 'inherit' };
    // prettier-ignore
    spawn('node', [path.resolve(dayFolder, 'solve1.js')], options).on('close', () => {
        spawn('node', [path.resolve(dayFolder, 'solve2.js')], options).on('close', () => {
            resolve();
          }
        );
      }
    );
  });

(async () => {
  const dayFolder = getDayFolder(currentDay);
  await writeTestFiles(dayFolder);
  const watcher = sane(dayFolder);
  watcher.on('ready', async () => {
    console.log(`watching the "${dayFolder}" folder for changes.`);
    await runTests(dayFolder);
  });
  ['change', 'add', 'delete'].forEach((eventName) => {
    watcher.on(eventName, async (filepath) => {
      console.log(`${eventName} event:\n${filepath}`);
      await runTests(dayFolder);
    });
  });
})().catch(console.error);
