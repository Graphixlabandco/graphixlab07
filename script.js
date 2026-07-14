// ── Three.js Glossy 3D Glass Background ──
(function initThreeBackground() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const scene = new THREE.Scene();
  
  // Perspective camera
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 24;

  // Group to contain floating structures
  const shapesGroup = new THREE.Group();
  scene.add(shapesGroup);

  // High-fidelity shiny glass material
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.35,
    transmission: 0.95, // Highly refractive glass
    roughness: 0.04,    // Extremely polished
    metalness: 0.05,
    ior: 1.54,          // Glass Index of Refraction
    thickness: 2.5,     // Light path bending depth
    clearcoat: 1.0,     // Glossy outer coat
    clearcoatRoughness: 0.03,
    specularIntensity: 1.0,
    side: THREE.DoubleSide
  });

  // Create premium geometries
  const geometries = [
    new THREE.TorusKnotGeometry(1.6, 0.55, 120, 16),
    new THREE.IcosahedronGeometry(2.0, 1),
    new THREE.TorusGeometry(1.8, 0.5, 16, 100),
    new THREE.SphereGeometry(1.9, 32, 32),
    new THREE.OctahedronGeometry(2.0, 0),
    new THREE.ConeGeometry(1.6, 3.0, 4)
  ];

  const floatingObjects = [];
  const objectCount = 14;

  for (let i = 0; i < objectCount; i++) {
    const geo = geometries[i % geometries.length];
    const mesh = new THREE.Mesh(geo, glassMaterial);

    // Initial random placement
    const xRange = 30;
    const yRange = 18;
    mesh.position.set(
      (Math.random() - 0.5) * xRange,
      (Math.random() - 0.5) * yRange,
      (Math.random() - 0.5) * 8 - 4
    );

    // Dynamic scale variation
    const scale = Math.random() * 0.7 + 0.6;
    mesh.scale.set(scale, scale, scale);

    // Custom properties for drift kinematics
    mesh.userData = {
      velocity: {
        x: (Math.random() - 0.5) * 0.008 + 0.003, // slow horizontal drift
        y: (Math.random() - 0.5) * 0.006,
        z: (Math.random() - 0.5) * 0.002
      },
      rotSpeed: {
        x: (Math.random() - 0.5) * 0.005,
        y: (Math.random() - 0.5) * 0.005,
        z: (Math.random() - 0.5) * 0.003
      }
    };

    shapesGroup.add(mesh);
    floatingObjects.push(mesh);
  }

  // Lights for high shine and specular highlights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambientLight);

  // Dynamic moving colored lights to project colored reflections
  const lightColors = [
    0xc8b6ff, // lavender
    0xffc6ff, // rose
    0xbbd0ff, // baby blue
    0xb9fbc0  // mint
  ];

  const pointLights = [];
  lightColors.forEach((color) => {
    const light = new THREE.PointLight(color, 2.5, 60);
    scene.add(light);
    pointLights.push(light);
  });

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation Loop
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.008;

    // Move lights in overlapping orbital paths for shifting reflections
    pointLights[0].position.set(Math.sin(time) * 15, Math.cos(time * 0.7) * 10, Math.sin(time * 0.5) * 10);
    pointLights[1].position.set(Math.cos(time * 0.8) * 15, Math.sin(time * 1.1) * 10, Math.cos(time * 0.3) * 10);
    pointLights[2].position.set(Math.sin(time * 1.2) * 12, Math.cos(time) * 12, Math.sin(time * 0.8) * 12);
    pointLights[3].position.set(Math.cos(time * 0.5) * 12, Math.sin(time * 0.9) * 12, Math.cos(time * 1.3) * 12);

    // Update glass objects
    floatingObjects.forEach((obj) => {
      // Rotate slowly
      obj.rotation.x += obj.userData.rotSpeed.x;
      obj.rotation.y += obj.userData.rotSpeed.y;
      obj.rotation.z += obj.userData.rotSpeed.z;

      // Translate slowly
      obj.position.x += obj.userData.velocity.x;
      obj.position.y += obj.userData.velocity.y;
      obj.position.z += obj.userData.velocity.z;

      // Bounds wrapping (screen limits at Z=0 range approx x: -22 to +22, y: -13 to +13)
      const xBound = 22;
      const yBound = 13;

      if (obj.position.x > xBound) {
        obj.position.x = -xBound;
      } else if (obj.position.x < -xBound) {
        obj.position.x = xBound;
      }

      if (obj.position.y > yBound) {
        obj.position.y = -yBound;
      } else if (obj.position.y < -yBound) {
        obj.position.y = yBound;
      }
    });

    renderer.render(scene, camera);
  }

  animate();
})();






// ── Navbar Scroll Effect ──
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  });
})();


// ── Mobile Menu ──
(function initMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const menuClose = document.getElementById('menuClose');
  const mobileMenu = document.getElementById('mobileMenu');

  // Create backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'menu-backdrop';
  document.body.appendChild(backdrop);

  function openMenu() {
    mobileMenu.classList.add('active');
    backdrop.classList.add('active');
    menuBtn.classList.add('active');
  }

  function closeMenu() {
    mobileMenu.classList.remove('active');
    backdrop.classList.remove('active');
    menuBtn.classList.remove('active');
  }

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.contains('active') ? closeMenu() : openMenu();
  });

  menuClose.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  // Close on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
})();


// ── Search Overlay ──
(function initSearch() {
  const searchBtn = document.getElementById('searchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  const searchableItems = [
    { title: 'Home', href: '#hero', keywords: 'home hero welcome' },
    { title: 'Logo Designs', href: '#services', keywords: 'logo brand mark icon' },
    { title: 'Branding / Landing Page', href: '#services', keywords: 'branding landing page identity' },
    { title: 'Short Video Editing', href: '#services', keywords: 'video editing reels shorts' },
    { title: 'Thumbnails / Cover Pages', href: '#services', keywords: 'thumbnail cover youtube' },
    { title: 'Prototypes / 3D Model Structure', href: '#services', keywords: 'prototype 3d model mockup' },
    { title: 'Vibe Coding Websites', href: '#services', keywords: 'website code development web' },
    { title: 'About Us', href: '#about', keywords: 'about why choose trust ai' },
    { title: 'Reviews', href: '#reviews', keywords: 'review testimonial rating feedback' },
    { title: 'Contact', href: '#reviews', keywords: 'contact email phone whatsapp instagram' }
  ];

  function openSearch() {
    searchOverlay.classList.add('active');
    setTimeout(() => searchInput.focus(), 100);
  }

  function closeSearch() {
    searchOverlay.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '';
  }

  searchBtn.addEventListener('click', openSearch);
  searchClose.addEventListener('click', closeSearch);
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSearch();
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
  });

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    searchResults.innerHTML = '';

    if (!query) return;

    const matches = searchableItems.filter(item =>
      item.title.toLowerCase().includes(query) || item.keywords.includes(query)
    );

    matches.forEach(item => {
      const el = document.createElement('a');
      el.href = item.href;
      el.className = 'search-result-item';
      el.textContent = item.title;
      el.addEventListener('click', closeSearch);
      searchResults.appendChild(el);
    });
  });
})();


// ── Flip Cards ──
(function initFlipCards() {
  const cards = document.querySelectorAll('.flip-card');
  const isTouchDevice = window.matchMedia('(hover: none)').matches || window.innerWidth < 769;

  if (isTouchDevice) {
    // Mobile: auto-flip when card reaches the center of the viewport
    const flipObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('flipped');
        } else {
          entry.target.classList.remove('flipped');
        }
      });
    }, {
      // rootMargin: shrink the observation zone to roughly the middle 30% of the screen
      rootMargin: '-35% 0px -35% 0px',
      threshold: 0.3
    });

    cards.forEach(card => flipObserver.observe(card));
  }
  // Desktop: hover flip is handled entirely by CSS (no JS needed)
})();


// ── Scroll Animations (Intersection Observer) ──
(function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
})();


// ── Star Rating ──
(function initStarRating() {
  const starRating = document.getElementById('starRating');
  const ratingValue = document.getElementById('ratingValue');
  const stars = starRating.querySelectorAll('.star');
  let currentRating = 0;

  stars.forEach(star => {
    star.addEventListener('mouseenter', function() {
      const value = parseInt(this.dataset.value);
      highlightStars(value);
    });

    star.addEventListener('mouseleave', () => {
      highlightStars(currentRating);
    });

    star.addEventListener('click', function() {
      currentRating = parseInt(this.dataset.value);
      ratingValue.value = currentRating;
      highlightStars(currentRating);
    });
  });

  function highlightStars(count) {
    stars.forEach(star => {
      const value = parseInt(star.dataset.value);
      if (value <= count) {
        star.classList.add('active');
        star.classList.add('hover');
      } else {
        star.classList.remove('active');
        star.classList.remove('hover');
      }
    });
  }
})();


// ── Reviews System (localStorage) ──
(function initReviews() {
  const form = document.getElementById('reviewForm');
  const carousel = document.getElementById('reviewsCarousel');

  // Default sample reviews
  const defaultReviews = [
    { name: 'Arjun Patel', comment: 'Graphix Lab transformed our brand identity completely. The logo and landing page they designed exceeded all our expectations. Pure artistry!', rating: 5 },
    { name: 'Sneha Reddy', comment: 'The video editing team delivered scroll-stopping reels for our product launch. Professional, creative, and incredibly fast turnaround.', rating: 5 },
    { name: 'Vikram Sharma', comment: 'Their 3D prototyping service saved us months of development time. Seeing our product in realistic renders before production was game-changing.', rating: 4 },
    { name: 'Priya Menon', comment: 'Outstanding thumbnail designs for my YouTube channel. My click-through rate jumped by 40% after switching to their designs. Highly recommend!', rating: 5 }
  ];

  function getReviews() {
    const stored = localStorage.getItem('graphixlab_reviews');
    return stored ? JSON.parse(stored) : defaultReviews;
  }

  function saveReviews(reviews) {
    localStorage.setItem('graphixlab_reviews', JSON.stringify(reviews));
  }

  function renderReviews() {
    const reviews = getReviews();
    carousel.innerHTML = '';

    reviews.forEach(review => {
      const card = document.createElement('div');
      card.className = 'review-card glass-card';

      const starsHtml = Array.from({ length: 5 }, (_, i) =>
        `<span>${i < review.rating ? '★' : '☆'}</span>`
      ).join('');

      const initial = review.name.charAt(0).toUpperCase();

      card.innerHTML = `
        <div class="review-card-header">
          <div class="review-avatar">${initial}</div>
          <span class="review-name">${escapeHtml(review.name)}</span>
        </div>
        <div class="review-stars">${starsHtml}</div>
        <p class="review-text">"${escapeHtml(review.comment)}"</p>
      `;

      carousel.appendChild(card);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Toast notification
  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('reviewerName').value.trim();
    const comment = document.getElementById('reviewComment').value.trim();
    const rating = parseInt(document.getElementById('ratingValue').value);

    if (!name || !comment) return;
    if (rating === 0) {
      showToast('Please select a star rating');
      return;
    }

    const reviews = getReviews();
    reviews.push({ name, comment, rating });
    saveReviews(reviews);

    renderReviews();
    form.reset();
    document.getElementById('ratingValue').value = '0';
    document.querySelectorAll('.star').forEach(s => {
      s.classList.remove('active');
      s.classList.remove('hover');
    });

    showToast('Thank you for your review! ✨');

    // Scroll carousel to new review
    setTimeout(() => {
      carousel.scrollTo({
        left: carousel.scrollWidth,
        behavior: 'smooth'
      });
    }, 300);
  });

  // Initial render
  renderReviews();
})();


// ── Smooth Anchor Scroll ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
