// gallery
document.addEventListener('DOMContentLoaded', function() {
  // Modal and video state variables
  let modal, modalImage, closeModal;
  let isDragging = false;
  let startX, startY, startTranslateX = 0, startTranslateY = 0;
  let translateX = 0, translateY = 0, scale = 1;
  // Log when DOM is fully loaded
  console.log('DOM fully loaded, initializing gallery...');
  
  // Debug video loading
  const debugVideoLoading = () => {
    const video = document.querySelector('#drone video');
    if (!video) {
      console.error('Video element not found in #drone tab');
      return;
    }
    
    console.log('Video element found:', video);
    
    // Log video events
    const events = [
      'loadstart', 'progress', 'loadedmetadata', 'loadeddata',
      'canplay', 'canplaythrough', 'error', 'stalled'
    ];
    
    events.forEach(event => {
      video.addEventListener(event, (e) => {
        console.log(`Video ${event} event fired`, {
          readyState: video.readyState,
          networkState: video.networkState,
          error: video.error,
          src: video.currentSrc || video.src
        });
      });
    });
    
    // Log when source is set
    const source = video.querySelector('source');
    if (source) {
      console.log('Video source element found:', {
        src: source.src,
        type: source.type
      });
    } else {
      console.error('No source element found in video tag');
    }
  };
  
  // Run debug when switching to drone tab
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      if (this.getAttribute('data-tab') === 'drone') {
        setTimeout(debugVideoLoading, 100);
      }
    });
  });
  
  // Run debug on initial load if drone tab is active
  if (document.querySelector('.tab-button.active')?.getAttribute('data-tab') === 'drone') {
    setTimeout(debugVideoLoading, 300);
  }
  console.log('DOM fully loaded, initializing gallery...');
  
  // Simple tab switching
  function switchTab(tabId) {
    console.log('Switching to tab:', tabId);
    
    // Hide all tab contents
    const allTabs = document.querySelectorAll('.tab-content');
    console.log('Hiding all tabs:', allTabs);
    allTabs.forEach(tab => {
      tab.style.display = 'none';
      tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    const allButtons = document.querySelectorAll('.tab-button');
    console.log('Updating tab buttons:', allButtons);
    allButtons.forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Show the selected tab
    const tab = document.getElementById(tabId);
    console.log('Target tab element:', tab);
    
    if (tab) {
      tab.style.display = 'block';
      tab.classList.add('active');
      console.log('Tab shown and active class added');
      
      // Trigger Masonry layout after a small delay
      setTimeout(function() {
        console.log('Initializing Masonry for tab:', tabId);
        initMasonry();
      }, 100);
    } else {
      console.error('Tab not found:', tabId);
    }
    
    // Mark the clicked button as active
    const activeButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
      console.log('Active button updated:', activeButton);
    }
  }
  
  // Set up tab click handlers
  function setupTabs() {
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
      tab.addEventListener('click', function(e) {
        e.preventDefault();
        switchTab(this.getAttribute('data-tab'));
      });
    });
    
    // Activate the first tab by default
    if (tabs.length > 0) {
      switchTab(tabs[0].getAttribute('data-tab'));
    }
  }
  
  // Initialize Masonry for the active tab's gallery
  function initMasonry() {
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) return;
    
    const gallery = activeTab.querySelector('.gallery');
    if (!gallery) return;
    
    // Set gallery layout
    gallery.style.display = 'flex';
    gallery.style.flexWrap = 'wrap';
    gallery.style.justifyContent = 'space-between';
    
    // Set item widths
    const itemWidth = 'calc(20% - 8px)';
    const items = gallery.querySelectorAll('.gallery-item');
    items.forEach(item => {
      item.style.width = itemWidth;
      item.style.marginBottom = '10px';
    });
    
    // Clean up existing Masonry instance
    if (gallery.msnry) {
      gallery.msnry.destroy();
      delete gallery.msnry;
    }
    
    // Initialize new Masonry instance
    const msnry = new Masonry(gallery, {
      itemSelector: '.gallery-item',
      columnWidth: '.gallery-item',
      percentPosition: false,
      gutter: 10,
      transitionDuration: '0.2s',
      fitWidth: true
    });
    
    gallery.msnry = msnry;
    
    // Update layout when images are loaded
    imagesLoaded(gallery, () => msnry.layout());
    
    // Delayed layout update
    const resizeTimeout = setTimeout(() => {
      msnry.layout();
      gallery.style.display = 'none';
      gallery.offsetHeight; // Trigger reflow
      gallery.style.display = 'flex';
      msnry.layout();
    }, 100);
    
    return () => clearTimeout(resizeTimeout);
  }
  
  // Initialize modal elements
  modal = document.getElementById('imageModal');
  modalImage = document.getElementById('modalImage');
  closeModal = document.getElementById('closeModal');
  
  // Reset modal state
  function resetModalState() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    isDragging = false;
    startX = startY = startTranslateX = startTranslateY = 0;
    updateTransform();
  }
  
  // Initialize modal event listeners
  closeModal.addEventListener('click', closeModalWindow);
  
  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target === document.getElementById('imageWrapper')) {
      closeModalWindow();
    }
  });
  
  // Update modal image transform
  function updateTransform() {
    if (modalImage) {
      modalImage.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${scale})`;
    }
  }
  
  // Reset transform to initial state
  function resetTransform() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    updateTransform();
  }
  
  // Pause video when modal is closed or when clicking play button
  document.addEventListener('click', function(e) {
    // Handle play button clicks
    if (e.target.classList.contains('play-button')) {
      const video = e.target.previousElementSibling;
      if (video && video.tagName === 'VIDEO') {
        video.play();
        e.target.style.display = 'none';
        video.setAttribute('controls', 'true');
      }
    }
    
    // Handle modal close
    if (modal && (e.target === modal || e.target.classList.contains('close'))) {
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        if (!video.paused) {
          video.pause();
        }
        // Show play button and hide controls
        const playButton = video.parentElement.querySelector('.play-button');
        if (playButton) {
          playButton.style.display = 'block';
          video.removeAttribute('controls');
        }
      });
    }
  });
  
  // Pause other videos when one starts playing
  document.addEventListener('play', function(e) {
    if (e.target.tagName === 'VIDEO') {
      document.querySelectorAll('video').forEach(video => {
        if (video !== e.target) {
          video.pause();
          const playButton = video.parentElement.querySelector('.play-button');
          if (playButton) playButton.style.display = 'block';
        }
      });
    }
  }, true);
  
  // Hover text fade-in/out for gallery items and panoramas
  const hoverItems = document.querySelectorAll('.gallery-item, .panorama-section');

  hoverItems.forEach(item => {
    const overlay = item.querySelector('.hover-text');
    if (overlay) {
      item.addEventListener('mouseenter', () => {
        overlay.style.opacity = '1';
      });
      item.addEventListener('mouseleave', () => {
        overlay.style.opacity = '0';
      });
    }
  });
  
  // Click handling for gallery items (images and videos)
  document.addEventListener('click', function(e) {
    // Handle video play/pause
    const videoItem = e.target.closest('.video-item');
    if (videoItem) {
      const video = videoItem.querySelector('video');
      const playButton = videoItem.querySelector('.play-button');
      
      if (video) {
        if (video.paused) {
          // Pause all other videos
          document.querySelectorAll('video').forEach(v => {
            if (v !== video) {
              v.pause();
              const otherPlayButton = v.closest('.video-item')?.querySelector('.play-button');
              if (otherPlayButton) otherPlayButton.style.display = 'flex';
            }
          });
          
          video.play().then(() => {
            if (playButton) playButton.style.display = 'none';
          }).catch(error => {
            console.error('Error playing video:', error);
          });
          
          e.stopPropagation();
        } else {
          video.pause();
          if (playButton) playButton.style.display = 'flex';
          e.stopPropagation();
        }
      }
      return;
    }
    
    // Handle image clicks for modal
    const img = e.target.closest('.gallery-item:not(.video-item) img');
    if (img && modal && modalImage) {
      e.preventDefault();
      modal.style.display = 'flex';
      modalImage.src = img.src;
      modalImage.alt = img.alt;
      resetTransform();
      return;
    }
  });
  
  // Handle video ended event
  document.querySelectorAll('.video-item video').forEach(video => {
    video.addEventListener('ended', function() {
      const playButton = this.closest('.video-item')?.querySelector('.play-button');
      if (playButton) playButton.style.display = 'flex';
    });
  });

  // Close modal functions
  function closeModalWindow() {
    if (modal) {
      modal.style.display = 'none';
      // Pause all videos when modal is closed
      document.querySelectorAll('video').forEach(video => {
        video.pause();
        const playButton = video.closest('.video-item')?.querySelector('.play-button');
        if (playButton) playButton.style.display = 'flex';
      });
    }
  }

  // Initialize tabs and setup modal
  setupTabs();
  
  // Initialize modal if elements exist
  if (modal && modalImage && closeModal) {
    console.log('Modal elements found and initialized');
    
    // Add event listeners for modal dragging
    modalImage.addEventListener('mousedown', (e) => {
      if (scale <= 1) return;
      
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startTranslateX = translateX;
      startTranslateY = translateY;
      modalImage.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      translateX = startTranslateX + dx;
      translateY = startTranslateY + dy;
      
      modalImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
      modalImage.style.cursor = 'grab';
    });
  } else {
    console.warn('Some modal elements not found');
  }
  
  // Debug video on page load if on drone tab
  if (window.location.hash === '#drone') {
    setTimeout(debugVideoLoading, 500);
  }

  // Panning functionality on modal image
  if (modalImage) {
    modalImage.addEventListener('mousedown', (e) => {
      if (scale <= 1) return;
      
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startTranslateX = translateX;
      startTranslateY = translateY;
      modalImage.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      
      translateX = startTranslateX + dx;
      translateY = startTranslateY + dy;
      
      updateTransform();
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
      modalImage.style.cursor = 'grab';
    });
    
    // Reset cursor when mouse leaves the window
    document.addEventListener('mouseleave', () => {
      isDragging = false;
      modalImage.style.cursor = 'grab';
    });
  }

  // Close modal with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      closeModalWindow();
    }
  });
});

// ... (rest of the code remains the same)
