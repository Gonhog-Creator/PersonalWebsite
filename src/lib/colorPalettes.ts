// Array of color palettes to cycle through
export const colorPalettes = [
  // Cool Blues
  ["#38bdf8", "#22d3ee", "#818cf8"],
  // Sunset
  ["#f43f5e", "#f59e0b", "#ec4899"],
  // Forest
  ["#10b981", "#84cc16", "#22c55e"],
  // Royal
  ["#8b5cf6", "#6366f1", "#a855f7"],
  // Ocean
  ["#06b6d4", "#3b82f6", "#0ea5e9"],
  // Neon
  ["#f472b6", "#a855f7", "#6366f1"],
];

// Function to get a random color palette
export const getRandomPalette = () => {
  return colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
};
