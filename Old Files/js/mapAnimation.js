document.addEventListener('DOMContentLoaded', function() {
    // Wait for the map to be fully loaded
    setTimeout(function() {
        const map = $('#map');
        const countries = map.find('path');
        const mapWidth = map.width();
        const mapHeight = map.height();

        // Store original positions and styles
        countries.each(function() {
            const country = $(this);
            const bbox = this.getBBox();
            
            // Store original attributes
            const originalTransform = country.attr('transform') || '';
            const originalStyle = country.attr('style') || '';
            
            // Set initial state (scattered outside the viewport)
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.max(mapWidth, mapHeight) * 1.2; // Start further away
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const scale = 0.1 + Math.random() * 0.5;
            
            // Create a group for each country to handle transforms separately
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('class', 'country-group');
            
            // Wrap the path in the group
            this.parentNode.insertBefore(g, this);
            g.appendChild(this);
            
            // Set initial transform on the group
            gsap.set(g, {
                x: x,
                y: y,
                scale: scale,
                opacity: 0,
                transformOrigin: 'center center'
            });
            
            // Store original transform on the group
            $(g).data('original-transform', originalTransform);
        });

        // Show the map now that we're ready to animate
        $('#map').addClass('ready');
        
        // Animate countries back to their positions
        const countryGroups = $('.country-group');
        let delay = 0;
        
        countryGroups.each(function() {
            const group = $(this);
            const duration = 1.6; // Reduced from 2s to 1.6s (20% faster)
            
            // Animate with staggered delay
            setTimeout(function() {
                gsap.to(group[0], {
                    duration: duration,
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    ease: 'power2.out', // Smoother easing without bounce
                    onComplete: function() {
                        // Restore original transform on the path
                        const path = group.find('path');
                        path.attr('transform', group.data('original-transform'));
                        
                        // Remove the group transform
                        group.attr('transform', '');
                        
                        // Move the path out of the group and remove the group
                        const pathNode = path[0];
                        group.after(pathNode);
                        group.remove();
                        
                        // Restore original style
                        path.attr('style', path.data('original-style'));
                    }
                });
            }, delay);
            
            // Add some randomness to the delay (reduced by 20%)
            delay += 24 + Math.random() * 40; // Reduced from 30-80ms to 24-64ms
        });
        
        // Add hover effects after all animations complete
        setTimeout(initializeHoverEffects, delay + duration * 1000 + 500);
        
    }, 500); // Small delay to ensure the map is fully loaded
});

function initializeHoverEffects() {
    const countries = $('#map').find('path');
    
    countries.hover(
        function() {
            // Store original transform for later restoration
            const originalTransform = $(this).attr('transform') || '';
            $(this).data('original-transform', originalTransform);
            
            // Get bounding box for transform origin
            const bbox = this.getBBox();
            const centerX = bbox.x + bbox.width / 2;
            const centerY = bbox.y + bbox.height / 2;
            
            // Apply new transform with origin at center
            $(this).attr('transform-origin', `${centerX}px ${centerY}px`);
            
            gsap.to(this, {
                duration: 0.3,
                scale: 1.1,
                transformOrigin: 'center center',
                ease: 'power2.out'
            });
        },
        function() {
            gsap.to(this, {
                duration: 0.3,
                scale: 1,
                transformOrigin: 'center center',
                ease: 'power2.out',
                onComplete: () => {
                    // Restore original transform
                    const originalTransform = $(this).data('original-transform');
                    if (originalTransform) {
                        $(this).attr('transform', originalTransform);
                    }
                }
            });
        }
    );
}
