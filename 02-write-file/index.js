const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const fileStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('start');

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('end');
    rl.close();
  } else {
    fileStream.write(`${input}\n`, (err) => {
      if (err) {
        console.error(err.message);
      }
    });
  }
});

rl.on('SIGINT', () => {
  console.log('\nBYE');
  rl.close();
});

rl.on('close', () => {
  fileStream.end();
});
