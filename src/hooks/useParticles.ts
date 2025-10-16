import { useEffect } from "react";

// The particlesJS types are imported from src/types/particles.d.ts
export const useParticles = (): void => {
  useEffect(() => {
    // Only run on client-side
    if (typeof window === "undefined") return;

    // Check if particles.js is loaded
    if (!window.particlesJS) {
      if (process.env.NODE_ENV === "development") {
        console.warn("particlesJS is not loaded");
      }
      return;
    }

    // Immediately-invoked async function to handle async/await
    (async () => {
      try {
        // Load particles configuration
        const response = await fetch("/particles.json");
        const config = await response.json();
        
        // Initialize particles with the loaded config
        window.particlesJS("particles-js", config);
        
        if (process.env.NODE_ENV === "development") {
          console.log("Particles.js initialized");
        }
      } catch (error) {
        console.error("Error initializing particles:", error);
      }
    })();

    // Cleanup function
    return (): void => {
      const particlesContainer = document.getElementById("particles-js");
      if (particlesContainer) {
        particlesContainer.innerHTML = "";
      }
    };
  }, []);
};
