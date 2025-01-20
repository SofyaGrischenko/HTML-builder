const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function displayFile() {
  try {
    const allFiles = await fs.promises.readdir(folderPath, {
      withFileTypes: true,
    });

    for (const file of allFiles) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);

        const data = await fs.promises.stat(filePath);

        const name = path.parse(file.name).name;
        const extention = path.extname(file.name).slice(1);

        const size = (data.size / 1024).toFixed(3);

        console.table(`${name} - ${extention} - ${size}kb`);
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}

displayFile();
