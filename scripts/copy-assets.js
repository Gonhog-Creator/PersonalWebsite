const fs = require('fs-extra');
const path = require('path');

// Define source and destination paths
const srcDir = path.join(__dirname, '..', 'public');
const outDir = path.join(__dirname, '..', 'out');

// Ensure the output directory exists
fs.ensureDirSync(outDir);

// Copy public directory to out directory
fs.copySync(srcDir, outDir, {
  dereference: true,
  filter: (src) => {
    // Skip node_modules and other unnecessary files
    return !src.includes('node_modules') && 
           !src.endsWith('.DS_Store') &&
           !src.endsWith('Thumbs.db');
  }
});

console.log('Successfully copied public assets to out directory');
