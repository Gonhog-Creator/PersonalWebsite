// gallery.js

document.addEventListener("DOMContentLoaded", function () {
  // Initialize Masonry
  var elem = document.querySelector('.gallery');
  if (elem) {
    var msnry = new Masonry(elem, {
      itemSelector: '.gallery-item',
      columnWidth: '.gallery-item',
      percentPosition: true,
      gutter: 10,
    });

    // Progressive layout as images load
    imagesLoaded(elem).on('progress', function() {
      msnry.layout();
    });
  }

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

  // Modal image zoom and pan functionality
  const galleryImages = document.querySelectorAll('.gallery img, .panoramas img');
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const closeModal = document.getElementById('closeModal');

  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;

  function updateTransform() {
    modalImage.style.transform = `translate(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px)) scale(${scale})`;
  }

  function centerImage() {
    translateX = 0;
    translateY = 0;
    updateTransform();
  }

  // Open modal on image click
  galleryImages.forEach(image => {
    image.addEventListener('click', () => {
      scale = 1;
      centerImage();
      modal.style.display = 'flex';
      modalImage.src = image.src;
      modalImage.alt = image.alt;
      centerImage();
    });
  });

  // Close modal functions
  function closeModalWindow() {
    modal.style.display = 'none';
  }

  if (closeModal) {
    closeModal.addEventListener('click', closeModalWindow);
  }

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal || event.target === document.getElementById('imageWrapper')) {
        closeModalWindow();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModalWindow();
  });

  // Zoom functionality on modal image
  if (modal) {
    modal.addEventListener('wheel', (e) => {
      e.preventDefault();
      const imgRect = modalImage.getBoundingClientRect();
      const pointerX = e.clientX - imgRect.left;
      const pointerY = e.clientY - imgRect.top;
      const oldScale = scale;
      if (e.deltaY < 0) {
        scale *= 1.1;
      } else {
        scale /= 1.1;
      }
      scale = Math.max(0.5, Math.min(scale, 5));
      translateX += (pointerX - imgRect.width / 2) * (1 - scale / oldScale);
      translateY += (pointerY - imgRect.height / 2) * (1 - scale / oldScale);
      updateTransform();
    });
  }

  // Panning functionality on modal image
  if (modalImage) {
    modalImage.addEventListener('mousedown', (e) => {
      e.preventDefault();
      isDragging = true;
      dragStartX = e.clientX - translateX;
      dragStartY = e.clientY - translateY;
      modalImage.style.cursor = 'grabbing';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    translateX = e.clientX - dragStartX;
    translateY = e.clientY - dragStartY;
    updateTransform();
  }

  function onMouseUp() {
    isDragging = false;
    modalImage.style.cursor = 'grab';
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
});
