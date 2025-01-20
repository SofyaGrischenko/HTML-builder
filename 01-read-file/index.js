const fs = require('fs');

const file = './01-read-file/text.txt';

fs.readFile(file, { encoding: 'utf-8' }, (err, data) => {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log('File read successfully:');
    console.log(data);
  }
});
