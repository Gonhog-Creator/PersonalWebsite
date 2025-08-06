// Wait for both DOM and GSAP to be ready
function initWorldMap() {
    // Get the map container
    const mapContainer = document.querySelector('.world-map-container');
    
    if (!mapContainer) {
        console.error('World map container not found');
        return;
    }
    
    // Add a loading message
    mapContainer.innerHTML = '<div style="text-align: center; padding: 20px;">Loading world map...</div>';
    
    // Add the SVG world map
    const svgMap = `
    <svg id="world-map" viewBox="0 0 2000 1000" xmlns="http://www.w3.org/2000/svg">
        <!-- World Map Paths (simplified for example) -->
        <path class="country" d="M100,200c0,0 50,30 100,30s80-30 150-30s100,40 200,20s150-50 200-40s100,50 150,30s100-50 150-30s100,30 150,10s100-50 150-30v400c0,0 -50,20 -100,10s-50-30 -100-20s-100,50 -150,40s-100-40 -150-20s-100,50 -150,40s-100-30 -150-10s-100,10 -150-10s-100-30 -150-20s-100,20 -150,10s-100-20 -100-20v-400z" fill="#4a90e2" />
        <!-- Add more country paths as needed -->
    </svg>
    `;
    
    // Insert the map into the container
    mapContainer.innerHTML = svgMap;
    
    // Animate the countries
    const countries = document.querySelectorAll('.country');
    
    if (typeof gsap === 'undefined') {
        console.error('GSAP is not loaded');
        mapContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #ff4444;">Error: Animation library not loaded</div>';
        return;
    }

    if (countries.length === 0) {
        console.error('No country elements found');
        return;
    }
    
    // Set initial state (scattered)
    gsap.set(countries, {
        opacity: 0,
        scale: 0.5,
        transformOrigin: "center center",
        x: () => gsap.utils.random(-500, 500),
        y: () => gsap.utils.random(-300, 300),
        rotation: () => gsap.utils.random(-180, 180)
    });
    
    // Animate to final position
    gsap.to(countries, {
        duration: 2,
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        rotation: 0,
        ease: "back.out(1.7)",
        stagger: {
            amount: 1.5,
            from: "random"
        },
        onComplete: () => {
            // Add subtle hover effect after animation
            countries.forEach(country => {
                country.addEventListener('mouseenter', () => {
                    gsap.to(country, { 
                        scale: 1.05,
                        fill: '#6fa8dc',
                        duration: 0.3 
                    });
                });
                
                country.addEventListener('mouseleave', () => {
                    gsap.to(country, { 
                        scale: 1,
                        fill: '#4a90e2',
                        duration: 0.3 
                    });
                });
            });
        }
    });
}

// Initialize when everything is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWorldMap);
} else {
    // DOMContentLoaded has already fired
    initWorldMap();
}
