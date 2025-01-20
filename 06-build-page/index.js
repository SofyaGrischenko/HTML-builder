const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const components = path.join(__dirname, 'components');
const templateFile = path.join(__dirname, 'template.html');
const stylesDir = path.join(__dirname, 'styles');
const assets = path.join(__dirname, 'assets');
const distAssets = path.join(projectDist, 'assets');

async function copyFolder(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    try {
      if (entry.isDirectory()) {
        await copyFolder(srcPath, destPath);
      } else if (entry.isFile()) {
        if (entry.name === 'Karolina-Regular.woff2') {
          continue;
        }
        await fs.promises.copyFile(srcPath, destPath);
      }
    } catch (err) {
      console.error(`Unable to copy file "${srcPath}" to "${destPath}".`);
      console.error('Error details:', err);
    }
  }
}

async function createProject() {
  await fs.promises.mkdir(projectDist, { recursive: true });
}

async function replaceTemplate() {
  let template = await fs.promises.readFile(templateFile, 'utf8');
  const tags = template.match(/{{\s*[\w]+\s*}}/g) || [];

  for (const tag of tags) {
    const componentName = tag.replace(/{{\s*|\s*}}/g, '');
    const componentPath = path.join(components, `${componentName}.html`);
    try {
      const content = await fs.promises.readFile(componentPath, 'utf8');
      template = template.replace(new RegExp(tag, 'g'), content);
    } catch (err) {
      console.error(`Component "${componentName}" not found.`);
    }
  }

  await fs.promises.writeFile(path.join(projectDist, 'index.html'), template);
}

async function compileStyles() {
  const stylesDir = path.join(__dirname, 'styles');
  const outputFile = path.join(__dirname, 'project-dist', 'style.css');

  const files = await fs.promises.readdir(stylesDir, { withFileTypes: true });
  const cssFiles = files.filter(
    (file) => file.isFile() && path.extname(file.name) === '.css',
  );

  const styles = [];
  for (const file of cssFiles) {
    const fileContent = await fs.promises.readFile(
      path.join(stylesDir, file.name),
      'utf8',
    );
    styles.push(fileContent);
  }
  await fs.promises.writeFile(outputFile, styles.join('\n'));
}

async function copyAssets() {
  await copyFolder(assets, distAssets);
}

async function build() {
  try {
    await createProject();
    console.log('create project');

    await replaceTemplate();
    console.log('replace template');

    await compileStyles();
    console.log('merge styles');

    await copyAssets();
    console.log('copy assets');

    console.log('complete');
  } catch (error) {
    console.error(error);
  }
}

build();
