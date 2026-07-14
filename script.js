/* ═══════════════════════════════════════════
   GRAPHIX LAB — Interactive Script
   ═══════════════════════════════════════════ */




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
