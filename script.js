/* ═══════════════════════════════════════════
   GRAPHIX LAB — Interactive Script
   ═══════════════════════════════════════════ */

// ── Three.js 3D Background ──
(function initThreeBackground() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  // Floating geometry group
  const group = new THREE.Group();
  scene.add(group);

  // Pastel materials
  const pastelColors = [
    0xc8b6ff, // lavender
    0xb8c0ff, // periwinkle
    0xbbd0ff, // baby blue
    0xffc6ff, // rose
    0xb9fbc0, // mint
    0xffd6a5, // peach
    0xffadad, // pink
    0xc5deff  // sky
  ];

  function createMaterial(color) {
    return new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: 0.12,
      shininess: 100,
      wireframe: Math.random() > 0.5
    });
  }

  // Create floating shapes
  const geometries = [
    new THREE.IcosahedronGeometry(1, 0),
    new THREE.OctahedronGeometry(1, 0),
    new THREE.TetrahedronGeometry(1, 0),
    new THREE.TorusGeometry(0.8, 0.3, 8, 16),
    new THREE.TorusKnotGeometry(0.7, 0.25, 64, 8),
    new THREE.DodecahedronGeometry(1, 0),
    new THREE.SphereGeometry(0.8, 16, 16),
    new THREE.BoxGeometry(1, 1, 1)
  ];

  const meshes = [];

  for (let i = 0; i < 35; i++) {
    const geo = geometries[Math.floor(Math.random() * geometries.length)];
    const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
    const material = createMaterial(color);
    const mesh = new THREE.Mesh(geo, material);

    const spread = 40;
    mesh.position.set(
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * spread * 0.5
    );

    const scale = Math.random() * 1.5 + 0.4;
    mesh.scale.set(scale, scale, scale);

    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    mesh.userData = {
      rotSpeed: {
        x: (Math.random() - 0.5) * 0.008,
        y: (Math.random() - 0.5) * 0.008,
        z: (Math.random() - 0.5) * 0.004
      },
      floatSpeed: Math.random() * 0.5 + 0.3,
      floatAmplitude: Math.random() * 0.4 + 0.1,
      initialY: mesh.position.y
    };

    group.add(mesh);
    meshes.push(mesh);
  }

  // Particle system for stardust effect
  const particleCount = 200;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 60;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0xc8b6ff,
    size: 0.06,
    transparent: true,
    opacity: 0.5
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0xc8b6ff, 0.8, 80);
  pointLight1.position.set(10, 10, 10);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xffc6ff, 0.6, 80);
  pointLight2.position.set(-10, -10, 5);
  scene.add(pointLight2);

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation loop
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    // Rotate main group slowly towards mouse
    group.rotation.y += (mouseX * 0.05 - group.rotation.y) * 0.02;
    group.rotation.x += (-mouseY * 0.05 - group.rotation.x) * 0.02;

    // Animate individual meshes
    meshes.forEach((mesh) => {
      mesh.rotation.x += mesh.userData.rotSpeed.x;
      mesh.rotation.y += mesh.userData.rotSpeed.y;
      mesh.rotation.z += mesh.userData.rotSpeed.z;
      mesh.position.y = mesh.userData.initialY +
        Math.sin(time * mesh.userData.floatSpeed) * mesh.userData.floatAmplitude;
    });

    // Rotate particles
    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.0001;

    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
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
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't flip when clicking the "Learn More" link
      if (e.target.closest('.card-learn-more')) return;
      this.classList.toggle('flipped');
    });
  });
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
