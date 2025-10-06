const fs = require('fs');
const path = require('path');

function getImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    const filePath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      // Skip node_modules and .git directories
      if (file.name === 'node_modules' || file.name === '.git') {
        return;
      }
      getImageFiles(filePath, fileList);
    } else {
      // Only include image files
      const ext = path.extname(file.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
        // Convert to web-relative path
        const webPath = filePath
          .replace(/\\/g, '/') // Convert backslashes to forward slashes
          .replace(/^.*?public\//, '/'); // Make path relative to public folder
        
        fileList.push(webPath);
      }
    }
  });
  
  return fileList;
}

// Get all images from the public directory
const allImages = getImageFiles(path.join(__dirname, '../public'));

// Write to a JSON file
fs.writeFileSync(
  path.join(__dirname, '../src/data/galleryImages.json'), 
  JSON.stringify(allImages, null, 2)
);

console.log(`Found ${allImages.length} images`);
console.log('Image list saved to src/data/galleryImages.json');
