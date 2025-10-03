// Mapping of video filenames to YouTube video IDs
export const youtubeVideos: Record<string, string> = {
  // Slovenia
  'Slovenia 2025 Recap 2k.mp4': 'be6ymyLlnE8',
  
  // Other countries
  'Austria 2025 Recap 2k.mp4': 'wy2P_X96J8Y',
  'Belgium 2025 Recap 2K.mp4': '4JV1n0iVC0c',
  'Costa Rica 2025 Recap 2k.mp4': 'YOUR_COSTA_RICA_VIDEO_ID',
  'France 2025 Recap 2k.mp4': 'IxwI3ugcBK4',
  'Germany 2025 Recap 2k.mp4': '5_WTv7idP8w',
  'Greece 2025 Recap 2k.mp4': 'YOUR_GREECE_VIDEO_ID',
  'Scotland 2025 Recap 2k.mp4': 'YOUR_SCOTLAND_VIDEO_ID',
  'Switzerland 2025 Recap 2k.mp4': 'YOUR_SWITZERLAND_VIDEO_ID',
  'United Kingdom 2025 Recap 2k.mp4': 'YOUR_UK_VIDEO_ID',
  'USA 2025 Recap 2k.mp4': 'YOUR_USA_VIDEO_ID',
};

// Get YouTube ID from filename
export function getYouTubeId(filename: string): string {
  return youtubeVideos[filename] || '';
}
