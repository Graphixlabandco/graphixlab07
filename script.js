// ── Three.js Cosmic Space & Asteroids Background ──
(function initThreeBackground() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;

  const scene = new THREE.Scene();
  
  // Perspective camera
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 24;

  // ── 1. Twinkling Starfield ──
  const starCount = 600;
  const starGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  // Bright pastel star colors
  const pastelStarColors = [
    new THREE.Color(0xc8b6ff), // Lavender
    new THREE.Color(0xb8c0ff), // Periwinkle
    new THREE.Color(0xbbd0ff), // Baby Blue
    new THREE.Color(0xffc6ff), // Rose
    new THREE.Color(0xffffff)  // Pure White
  ];

  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 80;     // X
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 50; // Y
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10; // Z

    const color = pastelStarColors[Math.floor(Math.random() * pastelStarColors.length)];
    starColors[i * 3] = color.r;
    starColors[i * 3 + 1] = color.g;
    starColors[i * 3 + 2] = color.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });

  const starfield = new THREE.Points(starGeo, starMat);
  scene.add(starfield);

  // ── 2. Rotating Spiral Galaxy ──
  const galaxyCount = 2000;
  const galaxyGeo = new THREE.BufferGeometry();
  const galaxyPositions = new Float32Array(galaxyCount * 3);
  const galaxyColors = new Float32Array(galaxyCount * 3);

  const innerColor = new THREE.Color(0xffc6ff); // Hot pinkish-lavender
  const outerColor = new THREE.Color(0xbbd0ff); // Light blue

  for (let i = 0; i < galaxyCount; i++) {
    const dist = Math.pow(Math.random(), 2.2) * 18; // Concentrated in middle
    const numArms = 2;
    const armAngle = ((i % numArms) * 2 * Math.PI) / numArms;
    const spin = dist * 0.45;

    // Introduce random spreading so galaxy looks fluffy and nebulous
    const spreadX = Math.pow(Math.random() - 0.5, 3) * 4 * (18 - dist) / 18;
    const spreadY = Math.pow(Math.random() - 0.5, 3) * 4 * (18 - dist) / 18;
    const spreadZ = Math.pow(Math.random() - 0.5, 3) * 3 * (18 - dist) / 18;

    const angle = armAngle + spin;
    const x = Math.cos(angle) * dist + spreadX;
    const y = Math.sin(angle) * dist + spreadY;
    const z = spreadZ - 8; // Pushed deeper in Z for depth layering

    galaxyPositions[i * 3] = x;
    galaxyPositions[i * 3 + 1] = y;
    galaxyPositions[i * 3 + 2] = z;

    // Linear interpolation from inner to outer color
    const blendedColor = innerColor.clone().lerp(outerColor, dist / 18);
    galaxyColors[i * 3] = blendedColor.r;
    galaxyColors[i * 3 + 1] = blendedColor.g;
    galaxyColors[i * 3 + 2] = blendedColor.b;
  }

  galaxyGeo.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
  galaxyGeo.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));

  const galaxyMat = new THREE.PointsMaterial({
    size: 0.14,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });

  const galaxy = new THREE.Points(galaxyGeo, galaxyMat);
  scene.add(galaxy);

  // ── 3. High-Speed Shining Asteroids ──
  const asteroidsGroup = new THREE.Group();
  scene.add(asteroidsGroup);

  // Light bright emissive materials for asteroids
  const asteroidMaterials = [
    new THREE.MeshStandardMaterial({
      color: 0xc8b6ff,
      emissive: 0x9a7eff,
      emissiveIntensity: 1.5,
      roughness: 0.2,
      metalness: 0.8
    }), // Glowing Purple/Lavender
    new THREE.MeshStandardMaterial({
      color: 0xb9fbc0,
      emissive: 0x4eff8a,
      emissiveIntensity: 1.6,
      roughness: 0.1,
      metalness: 0.9
    }), // Glowing Neon Mint
    new THREE.MeshStandardMaterial({
      color: 0xffd6a5,
      emissive: 0xffaa44,
      emissiveIntensity: 1.8,
      roughness: 0.2,
      metalness: 0.8
    }), // Shining Golden Amber
    new THREE.MeshStandardMaterial({
      color: 0xbbd0ff,
      emissive: 0x66aaff,
      emissiveIntensity: 1.5,
      roughness: 0.1,
      metalness: 0.7
    })  // Shining Electric Blue
  ];

  const asteroidGeometries = [
    new THREE.DodecahedronGeometry(0.8, 1),
    new THREE.IcosahedronGeometry(0.7, 1),
    new THREE.OctahedronGeometry(0.9, 1)
  ];

  const asteroids = [];
  const asteroidCount = 8;

  for (let i = 0; i < asteroidCount; i++) {
    const geo = asteroidGeometries[i % asteroidGeometries.length];
    const mat = asteroidMaterials[i % asteroidMaterials.length];
    const mesh = new THREE.Mesh(geo, mat);

    // Position randomly along the X and Y bounds
    const spawnX = -25 - Math.random() * 20; // Spawn offscreen on the left
    const spawnY = (Math.random() - 0.5) * 16;
    const spawnZ = (Math.random() - 0.5) * 6; // Random depth
    mesh.position.set(spawnX, spawnY, spawnZ);

    const scale = Math.random() * 0.6 + 0.5;
    mesh.scale.set(scale, scale, scale);

    // Fast kinematics properties
    mesh.userData = {
      speedX: Math.random() * 0.14 + 0.08, // Fast movement left-to-right
      speedY: (Math.random() - 0.5) * 0.02,
      rotX: (Math.random() - 0.5) * 0.08,
      rotY: (Math.random() - 0.5) * 0.08,
      rotZ: (Math.random() - 0.5) * 0.04
    };

    asteroidsGroup.add(mesh);
    asteroids.push(mesh);
  }

  // Lights to illuminate the materials and reflect specular rays
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
  mainLight.position.set(5, 10, 10);
  scene.add(mainLight);

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ── 4. Scroll Visibility Logic (Hide on Hero Section) ──
  function updateCanvasVisibility() {
    const scrollY = window.scrollY;
    // Hide when at the top (Hero Page), fade in as soon as user scrolls past 150px
    if (scrollY > 150) {
      canvas.style.opacity = '1';
      canvas.style.visibility = 'visible';
    } else {
      canvas.style.opacity = '0';
      canvas.style.visibility = 'hidden';
    }
  }

  window.addEventListener('scroll', updateCanvasVisibility);
  updateCanvasVisibility(); // initial check

  // Animation Loop
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.005;

    // Rotate Galaxy slowly
    galaxy.rotation.z += 0.0012;

    // Twinkle effect on stars (subtle periodic scaling)
    starfield.rotation.y += 0.0004;
    starMat.opacity = 0.75 + Math.sin(time * 8) * 0.15;

    // Update Fast Asteroids
    asteroids.forEach((mesh) => {
      mesh.rotation.x += mesh.userData.rotX;
      mesh.rotation.y += mesh.userData.rotY;
      mesh.rotation.z += mesh.userData.rotZ;

      mesh.position.x += mesh.userData.speedX;
      mesh.position.y += mesh.userData.speedY;

      // Wrap back to the left side when moving past the right edge
      const wrapLimit = 25;
      if (mesh.position.x > wrapLimit) {
        mesh.position.x = -wrapLimit - Math.random() * 15;
        mesh.position.y = (Math.random() - 0.5) * 16;
        mesh.userData.speedX = Math.random() * 0.14 + 0.08; // new speed
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
