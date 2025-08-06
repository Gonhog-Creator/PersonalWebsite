// Simple particle effect for social media tabs
document.addEventListener('DOMContentLoaded', function() {
  console.log('Particles script loaded');
  
  // Function to create particles
  function createParticles(link) {
    if (!link) return;
    
    // Create container
    const container = document.createElement('div');
    container.className = 'particle-container';
    container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
      pointer-events: none;
      z-index: 1;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    // Add container to the link
    link.style.position = 'relative';
    link.appendChild(container);
    
    // Create particles
    const isWhiteBg = link.classList.contains('bg-white');
    const particleCount = 22; // Increased from 15 by ~50%
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 2 + 1;
      const posY = 20 + (Math.random() * 60);
      const duration = Math.random() * 2 + 1.5;
      const delay = Math.random() * 3;
      
      // Make particles more visible on white background
      let particleColor, particleShadow;
      if (isWhiteBg) {
        // Darker gray with reduced opacity for better visibility on white
        particleColor = 'rgba(24, 26, 27, 1)';  // Same color but with 50% opacity
        particleShadow = '0 0 2px rgba(31, 41, 55, 0.9)';  // Lighter shadow to match
      } else {
        // White with shadow for better visibility on blue
        particleColor = 'rgba(255, 255, 255, 0.9)';
        particleShadow = '0 0 3px rgba(0, 0, 0, 0.5)';
      }
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${particleColor};
        border-radius: 50%;
        left: -20px;
        top: ${posY}%;
        animation: moveRight ${duration}s linear infinite ${delay}s;
        pointer-events: none;
        box-shadow: ${particleShadow};
      `;
      
      container.appendChild(particle);
    }
    
    // Show/hide on hover
    link.addEventListener('mouseenter', () => {
      container.style.opacity = '1';
    });
    
    link.addEventListener('mouseleave', () => {
      container.style.opacity = '0';
    });
    
    return container;
  }
  
  // Initialize particles for each social link
  const socialLinks = document.querySelectorAll('.socials li a');
  socialLinks.forEach(link => {
    createParticles(link);
  });
});
