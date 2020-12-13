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

const runTests = async (dayFolder, reason) => {
  console.clear();
  if (reason) {
    console.log(reason);
  }
  return new Promise((resolve) => {
    const options = { stdio: 'inherit' };
    // prettier-ignore
    spawn('node', [path.resolve(dayFolder, 'solve1.js')], options).on('close', () => {
        spawn('node', [path.resolve(dayFolder, 'solve2.js')], options).on('close', () => {
          printInstructions();
            resolve();
          }
        );
      }
    );
  });
};

const printInstructions = () => {
  console.log(`
    DAY ${currentDay}:
      press "q" or ctrl-c to quit
      press "d" to toggle debug mode
      any other key re-runs the tests
    `);
};

// https://stackoverflow.com/a/12506613
const setupKeyHandling = (dayFolder) => {
  const stdin = process.stdin;
  // without this, we would only get streams once enter is pressed
  stdin.setRawMode(true);
  // resume stdin in the parent process (node app won't quit all by itself
  // unless an error or process.exit() happens)
  stdin.resume();
  // i don't want binary, do you?
  stdin.setEncoding('utf8');
  // on any data into stdin
  stdin.on('data', async (key) => {
    const check = (k) => key.toLowerCase() === k;
    // ctrl-c ( end of text ) or q
    if (key === '\u0003' || check('q')) {
      process.exit();
    } else if (check('d')) {
      process.env.DEBUG = process.env.DEBUG === '*' ? undefined : '*';
      await runTests(
        dayFolder,
        `debug mode toggled. process.env.DEBUG=${process.env.DEBUG}`
      );
    } else {
      await runTests(dayFolder, `re-ran due to key: "${key}"`);
    }
  });
};

(async () => {
  const dayFolder = getDayFolder(currentDay);
  await writeTestFiles(dayFolder);
  const watcher = sane(dayFolder);
  watcher.on('ready', async () => {
    await runTests(
      dayFolder,
      `watching the "${dayFolder}" folder for changes.`
    );
  });
  ['change', 'add', 'delete'].forEach((eventName) => {
    watcher.on(eventName, async (filepath) => {
      await runTests(dayFolder, `${eventName} event:\n${filepath}`);
    });
  });
  setupKeyHandling(dayFolder);
})().catch(console.error);
