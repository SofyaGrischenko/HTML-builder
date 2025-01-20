const { promises } = require('dns');
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'files');
const newDir = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fs.promises.mkdir(newDir, { recursive: true });

    const files = await fs.promises.readdir(sourceDir, { withFileTypes: true });
    const newDirFiles = await fs.promises.readdir(newDir);
    await Promise.all(
      newDirFiles.map(async (file) => {
        const dirFilePath = path.join(newDir, file);
        await fs.promises.unlink(dirFilePath);
      }),
    );

    for (const file of files) {
      const sourceFilePath = path.join(sourceDir, file.name);
      const dirFilePath = path.join(newDir, file.name);

      if (file.isFile()) {
        await fs.promises.copyFile(sourceFilePath, dirFilePath);
      } else if (file.isDirectory) {
        await copyDirRecursive(sourceFilePath, dirFilePath);
      }
    }

    console.log('Dir copied');
  } catch (error) {
    console.error(error.message);
  }
}

copyDir();
