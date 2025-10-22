// Extend the Window interface to include the gc property
declare global {
  interface Window {
    gc?: () => void;
  }
}

export {}; // This file needs to be a module
