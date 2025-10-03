const fs = require('fs');
const path = require('path');
const { getYouTubeId } = require('../src/data/youtubeVideos');

// List of gallery page paths
const galleryPages = [
  'slovenia/page.tsx',
  'austria/page.tsx',
  'belgium/page.tsx',
  'costa-rica/page.tsx',
  'france/page.tsx',
  'germany/page.tsx',
  'greece/page.tsx',
  'scotland/page.tsx',
  'switzerland/page.tsx',
  'uk/page.tsx',
  'united-states/page.tsx',
  'australia/page.tsx'
];

// Base directory for gallery pages
const baseDir = path.join(__dirname, '..', 'src', 'app', 'galleries');

// Function to update a single gallery page
function updateGalleryPage(pagePath) {
  const fullPath = path.join(baseDir, pagePath);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // 1. Replace VideoPlayer import with YouTubePlayer
    content = content.replace(
      /import \{ VideoPlayer \} from '\@\/components\/gallery\/VideoPlayer';/,
      'import { YouTubePlayer } from \'@/components/gallery/YouTubePlayer\';'
    );
    
    // 2. Find and replace VideoPlayer components with YouTubePlayer
    const videoPlayerRegex = /<VideoPlayer\s+src=["']\/vids\/([^"']+)["']/g;
    let match;
    
    while ((match = videoPlayerRegex.exec(content)) !== null) {
      const filename = match[1];
      const videoId = getYouTubeId(filename);
      
      if (videoId) {
        const oldComponent = match[0];
        const newComponent = `<YouTubePlayer videoId="${videoId}"`;
        content = content.replace(oldComponent, newComponent);
      }
    }
    
    // 3. Fix any remaining props
    content = content.replace(/\s+src=[^\s>]+/g, ''); // Remove src prop
    content = content.replace(/\s+autoPlay=[^\s>]+/g, ''); // Remove autoPlay prop
    content = content.replace(/\s+loop=[^\s>]+/g, ''); // Remove loop prop
    
    // Write the updated content back to the file
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Updated ${pagePath}`);
    
  } catch (error) {
    console.error(`❌ Error updating ${pagePath}:`, error.message);
  }
}

// Update all gallery pages
galleryPages.forEach(pagePath => {
  updateGalleryPage(pagePath);
});

console.log('\n🎉 All gallery pages have been updated!');
