// ── Supabase Configuration & Initialization ──
const SUPABASE_URL = "https://xjpirlckvvqjoorzheq.supabase.co";
const SUPABASE_KEY = "sb_publishable_jhU2211MCzw4L_AEqyp2rw_8i90W5cA";
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

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


// ── Flip Cards & Booking Handlers ──
(function initFlipCardsAndBooking() {
  const cards = document.querySelectorAll('.flip-card');
  const bookingServiceSelect = document.getElementById('bookingService');

  // Manual flipping via the "Learn More" buttons
  cards.forEach(card => {
    const flipBtn = card.querySelector('.card-flip-btn');
    const inner = card.querySelector('.flip-card-inner');

    if (flipBtn && inner) {
      flipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Unflip all other cards first to keep layout clean
        cards.forEach(c => {
          if (c !== card) c.classList.remove('flipped');
        });
        card.classList.toggle('flipped');
      });
    }

    // Allow tapping on the back card (except the booking button itself) to flip it back to the front
    const backCard = card.querySelector('.flip-card-back');
    if (backCard && inner) {
      backCard.addEventListener('click', (e) => {
        if (e.target.classList.contains('card-book-btn')) return;
        card.classList.remove('flipped');
      });
    }

    // "Book This Service Now" click handler
    const bookBtn = card.querySelector('.card-book-btn');
    if (bookBtn) {
      bookBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const serviceId = card.getAttribute('data-service');
        
        // Pre-fill selection dropdown
        if (bookingServiceSelect && serviceId) {
          bookingServiceSelect.value = serviceId;
        }

        // Flip card back to front
        card.classList.remove('flipped');

        // Scroll smoothly to booking section
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  });

  // Service booking form handler
  const bookingForm = document.getElementById('bookingForm');
  const successModal = document.getElementById('successModal');
  const successCloseBtn = document.getElementById('successCloseBtn');

  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const service = document.getElementById('bookingService').value;
      const brief = document.getElementById('bookingBrief').value.trim();
      const name = document.getElementById('bookingName').value.trim();
      const email = document.getElementById('bookingEmail').value.trim();
      const phone = document.getElementById('bookingPhone').value.trim();

      if (!service || !brief || !name || !email || !phone) return;

      // Disable submit button during upload
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Booking...';

      try {
        if (supabaseClient) {
          const { error } = await supabaseClient
            .from('bookings')
            .insert([{
              service,
              brief,
              client_name: name,
              client_email: email,
              client_phone: phone
            }]);

          if (error) throw error;
        } else {
          console.warn('Supabase not initialized, falling back to local simulation.');
        }

        // Clear inputs
        bookingForm.reset();

        // Show success modal
        if (successModal) {
          successModal.classList.add('active');
        }
      } catch (err) {
        console.error('Error booking service:', err.message);
        alert('Booking failed. Please try again. Error: ' + err.message);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  if (successCloseBtn && successModal) {
    successCloseBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });
  }
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
  if (!starRating || !ratingValue) return;

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


// ── Reviews System (Supabase Live Integration) ──
(function initReviews() {
  const form = document.getElementById('reviewForm');
  const carousel = document.getElementById('reviewsCarousel');
  if (!form || !carousel) return;

  function getLocalReviews() {
    const stored = localStorage.getItem('graphixlab_reviews');
    return stored ? JSON.parse(stored) : [];
  }

  function saveLocalReviews(reviews) {
    localStorage.setItem('graphixlab_reviews', JSON.stringify(reviews));
  }

  async function fetchReviews() {
    if (!supabaseClient) {
      return getLocalReviews();
    }

    try {
      const { data, error } = await supabaseClient
        .from('reviews')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching reviews from Supabase:', err.message);
      return getLocalReviews();
    }
  }

  async function renderReviews() {
    carousel.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); width: 100%; padding: 2rem;">
        Loading live reviews...
      </div>
    `;

    const reviews = await fetchReviews();
    carousel.innerHTML = '';

    if (reviews.length === 0) {
      carousel.innerHTML = `
        <div class="empty-reviews-message">
          <p>No reviews yet. Be the first to share your experience!</p>
        </div>
      `;
      return;
    }

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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('reviewerName').value.trim();
    const comment = document.getElementById('reviewComment').value.trim();
    const rating = parseInt(document.getElementById('ratingValue').value);

    if (!name || !comment) return;
    if (rating === 0) {
      showToast('Please select a star rating');
      return;
    }

    // Disable submit
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Submitting...';

    try {
      if (supabaseClient) {
        const { error } = await supabaseClient
          .from('reviews')
          .insert([{ name, comment, rating, approved: true }]);

        if (error) throw error;
      } else {
        const local = getLocalReviews();
        local.push({ name, comment, rating, approved: true });
        saveLocalReviews(local);
      }

      form.reset();
      document.getElementById('ratingValue').value = '0';
      document.querySelectorAll('.star').forEach(s => {
        s.classList.remove('active');
        s.classList.remove('hover');
      });

      showToast('Thank you for your review! Live updated. ✨');
      await renderReviews();

      setTimeout(() => {
        carousel.scrollTo({
          left: carousel.scrollWidth,
          behavior: 'smooth'
        });
      }, 300);
    } catch (err) {
      console.error('Error saving review to Supabase:', err.message);
      showToast('Error saving review. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  renderReviews();
})();


// ── Simulated Local Authentication Manager ──
(function initSimulatedAuth() {
  const authBtn = document.getElementById('authBtn');
  const profileBtn = document.getElementById('profileBtn');
  const navProfilePic = document.getElementById('navProfilePic');
  
  const authModal = document.getElementById('authModal');
  const loginModalContent = document.getElementById('loginModalContent');
  const signupModalContent = document.getElementById('signupModalContent');
  
  const profileModal = document.getElementById('profileModal');
  
  const switchToSignup = document.getElementById('switchToSignup');
  const switchToLogin = document.getElementById('switchToLogin');
  
  const loginCloseBtn = document.getElementById('loginCloseBtn');
  const signupCloseBtn = document.getElementById('signupCloseBtn');
  const profileCloseBtn = document.getElementById('profileCloseBtn');
  
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const profileForm = document.getElementById('profileForm');
  const logoutBtn = document.getElementById('logoutBtn');

  // Load existing accounts or initialize
  function getAccounts() {
    const stored = localStorage.getItem('graphixlab_profiles');
    return stored ? JSON.parse(stored) : [];
  }

  function saveAccounts(accounts) {
    localStorage.setItem('graphixlab_profiles', JSON.stringify(accounts));
  }

  function getActiveUser() {
    const active = localStorage.getItem('graphixlab_active_user');
    return active ? JSON.parse(active) : null;
  }

  function setActiveUser(user) {
    if (user) {
      localStorage.setItem('graphixlab_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('graphixlab_active_user');
    }
    updateAuthUI();
  }

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

  function updateAuthUI() {
    const activeUser = getActiveUser();
    if (activeUser) {
      authBtn.style.display = 'none';
      profileBtn.style.display = 'inline-flex';
      
      const seed = activeUser.avatarSeed || 'Riya';
      navProfilePic.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
    } else {
      authBtn.style.display = 'inline-flex';
      profileBtn.style.display = 'none';
    }
  }

  // Event Listeners for Modal Toggles
  authBtn.addEventListener('click', () => {
    authModal.classList.add('active');
    loginModalContent.style.display = 'block';
    signupModalContent.style.display = 'none';
  });

  profileBtn.addEventListener('click', () => {
    const activeUser = getActiveUser();
    if (!activeUser) return;
    
    // Fill forms
    document.getElementById('profileName').value = activeUser.name || '';
    document.getElementById('profileEmailDisplay').value = activeUser.email || '';
    document.getElementById('profilePassword').value = '';
    
    // Select correct avatar option
    document.querySelectorAll('.avatar-opt').forEach(opt => {
      if (opt.getAttribute('data-seed') === activeUser.avatarSeed) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });

    document.getElementById('profilePicLarge').src = `https://api.dicebear.com/7.x/bottts/svg?seed=${activeUser.avatarSeed || 'Riya'}`;
    profileModal.classList.add('active');
  });

  // Switch between Login and Signup modals
  switchToSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginModalContent.style.display = 'none';
    signupModalContent.style.display = 'block';
  });

  switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupModalContent.style.display = 'none';
    loginModalContent.style.display = 'block';
  });

  // Close modals
  const closeAllModals = () => {
    authModal.classList.remove('active');
    profileModal.classList.remove('active');
  };

  loginCloseBtn.addEventListener('click', closeAllModals);
  signupCloseBtn.addEventListener('click', closeAllModals);
  profileCloseBtn.addEventListener('click', closeAllModals);

  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) closeAllModals();
  });
  profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) closeAllModals();
  });

  // Handle Signup
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (password !== confirmPassword) {
      showToast("Passwords don't match!");
      return;
    }

    const accounts = getAccounts();
    const exists = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      showToast("An account with this email already exists!");
      return;
    }

    const newAcc = {
      email: email,
      password: password,
      name: email.split('@')[0],
      avatarSeed: 'Riya'
    };

    accounts.push(newAcc);
    saveAccounts(accounts);
    setActiveUser(newAcc);
    
    closeAllModals();
    signupForm.reset();
    showToast("Account created successfully! Welcome to Graphix Lab. 🎉");
  });

  // Handle Login
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const accounts = getAccounts();
    const user = accounts.find(acc => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password);
    
    if (!user) {
      showToast("Invalid email or password!");
      return;
    }

    setActiveUser(user);
    closeAllModals();
    loginForm.reset();
    showToast(`Logged in successfully. Welcome back, ${user.name}!`);
  });

  // Avatar Selection logic
  document.querySelectorAll('.avatar-opt').forEach(opt => {
    opt.addEventListener('click', function() {
      document.querySelectorAll('.avatar-opt').forEach(o => o.classList.remove('active'));
      this.classList.add('active');
      const seed = this.getAttribute('data-seed');
      document.getElementById('profilePicLarge').src = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
    });
  });

  // Handle Profile Update
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('profileName').value.trim();
    const newPassword = document.getElementById('profilePassword').value;
    const activeUser = getActiveUser();
    
    if (!activeUser) return;

    const selectedAvatar = document.querySelector('.avatar-opt.active');
    const avatarSeed = selectedAvatar ? selectedAvatar.getAttribute('data-seed') : 'Riya';

    const accounts = getAccounts();
    const index = accounts.findIndex(acc => acc.email.toLowerCase() === activeUser.email.toLowerCase());

    if (index !== -1) {
      accounts[index].name = name;
      accounts[index].avatarSeed = avatarSeed;
      if (newPassword) {
        accounts[index].password = newPassword;
      }
      saveAccounts(accounts);
      setActiveUser(accounts[index]);
    }

    closeAllModals();
    showToast("Profile settings saved! ✨");
  });

  // Handle Logout
  logoutBtn.addEventListener('click', () => {
    setActiveUser(null);
    closeAllModals();
    showToast("Logged out successfully.");
  });

  // Initial check
  updateAuthUI();
})();


// ── AI Chatbot "Riya Assist" ──
(function initRiyaChat() {
  const chatFloatBtn = document.getElementById('chatFloatBtn');
  const chatPanel = document.getElementById('chatPanel');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatInputForm = document.getElementById('chatInputForm');
  const chatMessageInput = document.getElementById('chatMessageInput');
  const chatBody = document.getElementById('chatBody');

  if (!chatFloatBtn || !chatPanel || !chatCloseBtn || !chatInputForm) return;

  chatFloatBtn.addEventListener('click', () => {
    chatPanel.classList.toggle('active');
    if (chatPanel.classList.contains('active')) {
      setTimeout(() => chatMessageInput.focus(), 150);
    }
  });

  chatCloseBtn.addEventListener('click', () => {
    chatPanel.classList.remove('active');
  });

  // Basic Auto-responses regarding Graphix Lab
  const riyaResponses = [
    {
      keywords: ['hi', 'hello', 'hey', 'greetings'],
      answer: "Hello! I am Riya, your AI design assistant. How can I help you discover or commission design projects with Graphix Lab today?"
    },
    {
      keywords: ['service', 'services', 'what do you do', 'offerings'],
      answer: "At Graphix Lab, we offer 6 design services: 1. Logo Designs, 2. Branding/Landing Pages, 3. Short Video Editing, 4. Thumbnails/Covers, 5. Prototypes/3D Models, and 6. Vibe Coding Websites. Tap 'Learn More' on any service card to read details!"
    },
    {
      keywords: ['logo', 'identity'],
      answer: "Our Logo Designs are engineered to capture your brand's unique values cleanly and memorably. We deliver fully vectorized, scalable assets ready for web, mobile, and print."
    },
    {
      keywords: ['branding', 'landing'],
      answer: "Our Branding & Landing Page service builds consistent visual guidelines and high-converting pages tailored to turn visitors into loyal customers."
    },
    {
      keywords: ['video', 'editing', 'reels', 'shorts'],
      answer: "We edit raw footage into cinematic transitions, sound-designed hooks, and custom graphics optimized for TikTok, YouTube Shorts, and Reels."
    },
    {
      keywords: ['thumbnail', 'cover'],
      answer: "We engineer high-contrast thumbnails and cover designs crafted to trigger curiosity and maximize your click-through rates (CTR)."
    },
    {
      keywords: ['prototype', '3d', 'dodecahedron', 'structure'],
      answer: "We build realistic interactive prototypes and 3D model structures that allow you to preview and perfect product details before manufacturing."
    },
    {
      keywords: ['website', 'code', 'vibe coding', 'web'],
      answer: "We construct lightweight, ultra-smooth 'Vibe Coding' websites featuring custom interactive animations, fully responsive layouts, and modern aesthetics."
    },
    {
      keywords: ['book', 'order', 'commission', 'request'],
      answer: "To book a service, simply click the 'Book This Service Now' button on any card back. It will scroll you down to our 'Start Your Project' commission portal where you can enter your requirements!"
    },
    {
      keywords: ['price', 'pricing', 'cost', 'rates'],
      answer: "We do not list flat pricing, as every design project is bespoke. Tell us about your scope and details in the 'Start Your Project' section, and we will contact you with a customized estimate."
    },
    {
      keywords: ['ai', 'artificial', 'intelligence', 'human'],
      answer: "Graphix Lab is unique because we combine advanced generative AI tools with human creative talent to deliver perfect designs quickly and with extreme detail."
    }
  ];

  function getBotResponse(userMsg) {
    const cleanMsg = userMsg.toLowerCase().trim();
    
    // Look for exact keyword matches
    for (const item of riyaResponses) {
      if (item.keywords.some(kw => cleanMsg.includes(kw))) {
        return item.answer;
      }
    }

    // Default response for off-topic or unmatched questions
    return "I'm sorry, I can only answer questions related to Graphix Lab and our design services. Feel free to ask about our logo designs, video editing, vibe websites, or how to commission a project!";
  }

  function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;
    msgDiv.textContent = text;
    chatBody.appendChild(msgDiv);
    
    // Scroll to bottom
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  chatInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userText = chatMessageInput.value.trim();
    if (!userText) return;

    // Append User message
    appendMessage('user', userText);
    chatMessageInput.value = '';

    // Simulate typing delay
    setTimeout(() => {
      const botReply = getBotResponse(userText);
      appendMessage('bot', botReply);
    }, 450);
  });
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

