const fs = require('fs-extra');
const path = require('path');

// Source and destination directories
const publicDir = path.join(__dirname, '../public');
const outDir = path.join(__dirname, '../out');

// Ensure the out directory exists
fs.ensureDirSync(outDir);

// Copy public directory contents
fs.copySync(publicDir, outDir, {
  dereference: true,
  filter: (src) => {
    // Don't copy .gitkeep files
    return !src.includes('.gitkeep');
  }
});

// Create .nojekyll file
fs.writeFileSync(path.join(outDir, '.nojekyll'), '');

console.log('Static assets copied successfully!');
