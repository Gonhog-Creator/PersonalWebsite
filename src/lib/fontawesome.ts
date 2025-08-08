import { config, library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

// Add all icons to the library so you can use them without importing them individually in your components
library.add(fas, fab, far);

// This ensures that the icon CSS is loaded immediately before attempting to render icons
config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported in globals.css

// Import the CSS for Font Awesome
import '@fortawesome/fontawesome-svg-core/styles.css';
