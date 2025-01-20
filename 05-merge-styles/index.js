const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const projectDir = path.join(__dirname, 'project-dist');
const bundle = path.join(projectDir, 'bundle.css');

async function compileStyles() {
  try {
    await fs.promises.mkdir(projectDir, { recursive: true });

    const bundleStream = fs.createWriteStream(bundle, { flags: 'w' });
    const files = await fs.promises.readdir(stylesDir, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(stylesDir, file.name);

      if (file.isFile() && path.extname(file.name) === '.css') {
        const fileStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
        fileStream.pipe(bundleStream, { end: false });

        await new Promise((resolve, reject) => {
          fileStream.on('end', resolve);
          fileStream.on('error', reject);
        });
      }
    }

    console.log('done');
    
  } catch (error) {
    console.error(error.message);
  }
}

compileStyles();
