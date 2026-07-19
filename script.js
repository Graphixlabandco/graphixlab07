// ── Supabase Configuration & Initialization ──
const SUPABASE_URL = "https://xjpirlckvvqjoorzxheq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcGlybGNrdnZxam9vcnp4aGVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NDI3OTgsImV4cCI6MjA5OTQxODc5OH0.B9Dx8wNQeqrttTFLUY3jvMugtaH4wqMZ3n2EVAIzLGk";
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

  // Helper to send email alerts via EmailJS
  async function sendBookingEmails(booking) {
    if (!window.emailjs) {
      console.warn("EmailJS SDK is not loaded. Skipping confirmation emails.");
      return;
    }

    // EmailJS configurations (User can customize these values in script.js when ready)
    const EMAILJS_PUBLIC_KEY = "k2i_99oMeHEmqiILD"; // Put your EmailJS Public Key here
    const EMAILJS_SERVICE_ID = "service_pv3yvv6"; // Put your EmailJS Service ID here
    const EMAILJS_TEMPLATE_CLIENT = "template_phjjh04"; // Template ID for customer confirmation
    const EMAILJS_TEMPLATE_ADMIN = "template_tlfwwu2"; // Template ID for admin notification

    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID) {
      console.warn("EmailJS keys are empty. Configure EmailJS variables in script.js to trigger customer and admin email confirmations.");
      return;
    }

    try {
      window.emailjs.init(EMAILJS_PUBLIC_KEY);

      const templateParams = {
        client_name: booking.client_name,
        client_email: booking.client_email,
        to_email: booking.client_email,
        user_email: booking.client_email,
        email: booking.client_email,
        to_name: booking.client_name,
        client_phone: booking.client_phone,
        service_type: booking.service,
        service_brief: booking.brief,
        booking_time: new Date().toLocaleString(),
        reply_to: booking.client_email
      };

      // 1. Send confirmation email to Customer
      if (EMAILJS_TEMPLATE_CLIENT) {
        try {
          await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CLIENT, templateParams);
          console.log("Confirmation email sent to customer.");
        } catch (clientErr) {
          console.warn("Client confirmation email dispatch notice:", clientErr);
        }
      }

      // 2. Send notification email to Admin (me)
      if (EMAILJS_TEMPLATE_ADMIN) {
        try {
          await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ADMIN, templateParams);
          console.log("Alert email sent to admin.");
        } catch (adminErr) {
          console.warn("Admin notification email dispatch notice:", adminErr);
        }
      }
    } catch (err) {
      console.error("Error initializing EmailJS:", err);
    }
  }

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

        // Trigger email sends to customer and admin
        sendBookingEmails({
          service,
          brief,
          client_name: name,
          client_email: email,
          client_phone: phone
        });

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
  window.refreshWebsiteReviews = renderReviews;
})();


// ── Supabase Live Authentication Manager ──
(function initSupabaseAuth() {
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
  const verificationModal = document.getElementById('verificationModal');
  const verificationCloseBtn = document.getElementById('verificationCloseBtn');
  const profilePicInput = document.getElementById('profilePicInput');
  let localUploadedUrl = null;

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

  // Handle password visibility toggle click
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.password-input-wrapper');
      const input = wrapper.querySelector('input');
      const eyeSlash = btn.querySelector('.eye-slash');

      if (input.type === 'password') {
        input.type = 'text';
        if (eyeSlash) eyeSlash.style.display = 'block';
      } else {
        input.type = 'password';
        if (eyeSlash) eyeSlash.style.display = 'none';
      }
    });
  });

  // Authorized Admin Emails list
  const ADMIN_EMAILS = [
    'graphixlab07@gmail.com'
  ];

  function isAdminUser(user) {
    if (!user) return false;
    if (user.user_metadata?.is_admin === true) return true;
    if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) return true;
    return false;
  }

  // Update navbar trigger UI
  const adminOpenBtn = document.getElementById('adminOpenBtn');
  const adminModal = document.getElementById('adminModal');

  function updateAuthUI(user) {
    if (user) {
      authBtn.style.display = 'none';
      profileBtn.style.display = 'inline-flex';
      
      // Restrict Admin Panel button strictly to authorized admin accounts
      if (adminOpenBtn) {
        if (isAdminUser(user)) {
          adminOpenBtn.style.display = 'block';
        } else {
          adminOpenBtn.style.display = 'none';
        }
      }
      
      const seed = user.user_metadata?.avatar_seed || 'Riya';
      const customUrl = user.user_metadata?.avatar_url;
      if (customUrl) {
        navProfilePic.src = customUrl;
      } else {
        navProfilePic.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
      }
    } else {
      authBtn.style.display = 'inline-flex';
      profileBtn.style.display = 'none';
      if (adminOpenBtn) adminOpenBtn.style.display = 'none';
    }
  }

  // Set up Supabase Auth state listener
  if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange((event, session) => {
      const user = session?.user || null;
      updateAuthUI(user);

      if (event === 'SIGNED_IN' && window.location.hash.includes('access_token')) {
        showToast("Email verified successfully! Welcome to Graphix Lab! 🎉");
        history.replaceState(null, document.title, window.location.pathname + window.location.search);
      }
    });
  }

  // Event Listeners for Modal Toggles
  authBtn.addEventListener('click', () => {
    authModal.classList.add('active');
    loginModalContent.style.display = 'block';
    signupModalContent.style.display = 'none';
  });

  profileBtn.addEventListener('click', async () => {
    if (!supabaseClient) return;
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;
    
    // Fill forms
    document.getElementById('profileName').value = user.user_metadata?.display_name || user.email.split('@')[0];
    document.getElementById('profileEmailDisplay').value = user.email || '';
    document.getElementById('profilePassword').value = '';
    
    // Select correct avatar option
    document.querySelectorAll('.avatar-opt').forEach(opt => {
      if (opt.getAttribute('data-seed') === user.user_metadata?.avatar_seed) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });

    const seed = user.user_metadata?.avatar_seed || 'Riya';
    const customUrl = user.user_metadata?.avatar_url;
    if (customUrl) {
      document.getElementById('profilePicLarge').src = customUrl;
    } else {
      document.getElementById('profilePicLarge').src = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
    }
    
    localUploadedUrl = null; // Reset uploaded reference
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
    if (verificationModal) verificationModal.classList.remove('active');
    if (adminModal) adminModal.classList.remove('active');
  };

  loginCloseBtn.addEventListener('click', closeAllModals);
  signupCloseBtn.addEventListener('click', closeAllModals);
  profileCloseBtn.addEventListener('click', closeAllModals);
  if (verificationCloseBtn) verificationCloseBtn.addEventListener('click', closeAllModals);

  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) closeAllModals();
  });
  profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) closeAllModals();
  });
  if (verificationModal) {
    verificationModal.addEventListener('click', (e) => {
      if (e.target === verificationModal) closeAllModals();
    });
  }

  // Handle Signup (Live Supabase)
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (password !== confirmPassword) {
      showToast("Passwords don't match!");
      return;
    }

    if (!supabaseClient) {
      showToast("Supabase is not initialized!");
      return;
    }

    const submitBtn = signupForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Signing up...';

    try {
      const redirectUrl = window.location.origin + window.location.pathname;
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: email.split('@')[0],
            avatar_seed: 'Riya-' + Math.random().toString(36).substring(2, 8)
          }
        }
      });

      if (error) throw error;

      pendingSignupEmail = email;
      generatedOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
      sendOtpViaEmailJS(email, generatedOtpCode);

      closeAllModals();
      signupForm.reset();
      
      if (verificationModal) {
        const emailText = document.getElementById('verificationEmailText');
        if (emailText) emailText.textContent = email;
        verificationModal.classList.add('active');
        const otpInput = document.getElementById('otpCodeInput');
        if (otpInput) {
          otpInput.value = '';
          otpInput.focus();
        }
      } else {
        showToast("Account created! Check your email for the 6-digit verification code. ✉️");
      }
    } catch (err) {
      console.error('Signup error:', err.message);
      if (err.message && err.message.toLowerCase().includes('rate limit')) {
        showToast("Supabase Email Rate Limit reached (max 4 signup emails per hour). Please wait a few minutes or check your inbox! ⏳");
      } else {
        showToast(err.message || "Failed to create account.");
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  // Handle Login (Live Supabase)
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!supabaseClient) {
      showToast("Supabase is not initialized!");
      return;
    }

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Logging in...';

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      closeAllModals();
      loginForm.reset();
      showToast(`Logged in successfully! Welcome, ${data.user.user_metadata?.display_name || data.user.email.split('@')[0]}!`);
    } catch (err) {
      console.error('Login error:', err.message);
      if (err.message && err.message.toLowerCase().includes('email not confirmed')) {
        pendingSignupEmail = email;
        closeAllModals();
        if (verificationModal) {
          const emailText = document.getElementById('verificationEmailText');
          if (emailText) emailText.textContent = email;
          verificationModal.classList.add('active');
          const otpInput = document.getElementById('otpCodeInput');
          if (otpInput) {
            otpInput.value = '';
            otpInput.focus();
          }
        } else {
          showToast("Please enter the 6-digit verification code sent to your inbox! ✉️");
        }
      } else if (err.message && err.message.toLowerCase().includes('invalid login credentials')) {
        showToast("Invalid email or password! If you don't have an account yet, please click 'Sign up' to create one.");
      } else {
        showToast(err.message || "Invalid email or password!");
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
  let generatedOtpCode = '';

  function sendOtpViaEmailJS(targetEmail, code) {
    if (window.emailjs && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_CLIENT) {
      window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_CLIENT, {
        client_name: targetEmail.split('@')[0],
        client_email: targetEmail,
        to_email: targetEmail,
        user_email: targetEmail,
        service_type: 'Account Verification',
        service_brief: `Your 6-Digit Graphix Lab Verification Code is: ${code}`,
        reply_to: targetEmail
      }).then(() => {
        console.log("Verification OTP email sent via EmailJS.");
      }).catch(err => {
        console.warn("EmailJS OTP dispatch notice:", err);
      });
    }
  }

  // Handle OTP Code Form Submission
  const otpVerifyForm = document.getElementById('otpVerifyForm');
  if (otpVerifyForm) {
    otpVerifyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const code = document.getElementById('otpCodeInput').value.trim();
      
      if (!code || code.length !== 6) {
        showToast("Please enter a valid 6-digit verification code!");
        return;
      }

      const submitBtn = otpVerifyForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Verifying...';

      try {
        const targetEmail = pendingSignupEmail || document.getElementById('signupEmail').value.trim() || document.getElementById('loginEmail').value.trim();

        // 1. Direct match with EmailJS generated OTP code
        if (generatedOtpCode && code === generatedOtpCode) {
          closeAllModals();
          signupForm.reset();
          loginForm.reset();
          document.getElementById('otpCodeInput').value = '';
          showToast("Account verified & logged in successfully! Welcome to Graphix Lab! 🎉");
          return;
        }

        // 2. Fallback check via Supabase verifyOtp API
        if (supabaseClient) {
          const { data, error } = await supabaseClient.auth.verifyOtp({
            email: targetEmail,
            token: code,
            type: 'signup'
          });

          if (error) {
            const { data: data2, error: error2 } = await supabaseClient.auth.verifyOtp({
              email: targetEmail,
              token: code,
              type: 'email'
            });

            if (error2) throw error;
          }
        }

        closeAllModals();
        signupForm.reset();
        loginForm.reset();
        document.getElementById('otpCodeInput').value = '';
        showToast("Account verified & logged in successfully! Welcome to Graphix Lab! 🎉");
      } catch (err) {
        console.error("OTP verification error:", err.message);
        showToast("Invalid code: " + (err.message || "Please check the 6-digit code and try again."));
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // Handle Resend OTP Code
  const resendOtpBtn = document.getElementById('resendOtpBtn');
  if (resendOtpBtn) {
    resendOtpBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const targetEmail = pendingSignupEmail || document.getElementById('signupEmail').value.trim() || document.getElementById('loginEmail').value.trim();
      if (!targetEmail) {
        showToast("No email address found to resend code.");
        return;
      }

      generatedOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
      sendOtpViaEmailJS(targetEmail, generatedOtpCode);

      if (supabaseClient) {
        try {
          await supabaseClient.auth.resend({
            type: 'signup',
            email: targetEmail
          });
        } catch (err) {
          console.warn("Supabase resend notice:", err);
        }
      }

      showToast(`Resent 6-digit verification code to ${targetEmail}! ✉️`);
    });
  }

  // Avatar Selection logic
  document.querySelectorAll('.avatar-opt').forEach(opt => {
    opt.addEventListener('click', function() {
      document.querySelectorAll('.avatar-opt').forEach(o => o.classList.remove('active'));
      this.classList.add('active');
      const seed = this.getAttribute('data-seed');
      document.getElementById('profilePicLarge').src = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
      localUploadedUrl = null; // Override upload with chosen seed
    });
  });

  // Profile picture upload to Supabase Storage
  if (profilePicInput) {
    profilePicInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!supabaseClient) {
        showToast("Supabase client is not loaded.");
        return;
      }

      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) {
        showToast("Please log in to upload images.");
        return;
      }

      showToast("Uploading profile image...");

      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}-${Date.now()}.${fileExt}`;

        // Upload to public 'avatars' bucket
        const { data, error } = await supabaseClient.storage
          .from('avatars')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabaseClient.storage
          .from('avatars')
          .getPublicUrl(filePath);

        localUploadedUrl = publicUrl;

        // Update preview in modal
        document.getElementById('profilePicLarge').src = publicUrl;
        showToast("Image uploaded to cloud! Remember to save changes. ✨");
      } catch (err) {
        console.warn("Storage upload error (falling back to local image data):", err.message);
        
        // Fallback: Read file locally as Data URL so image upload works regardless of Supabase Storage RLS policies
        const reader = new FileReader();
        reader.onload = (evt) => {
          localUploadedUrl = evt.target.result;
          document.getElementById('profilePicLarge').src = localUploadedUrl;
          showToast("Profile image loaded! Click 'Save Changes' to update. ✨");
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Handle Profile Update (Live Supabase)
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('profileName').value.trim();
    const newPassword = document.getElementById('profilePassword').value.trim();
    
    if (!supabaseClient) return;

    const selectedAvatar = document.querySelector('.avatar-opt.active');
    const avatarSeed = selectedAvatar ? selectedAvatar.getAttribute('data-seed') : 'Riya';

    const submitBtn = profileForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Saving...';

    try {
      const updateData = {
        data: {
          display_name: name,
          avatar_seed: avatarSeed
        }
      };

      if (localUploadedUrl) {
        updateData.data.avatar_url = localUploadedUrl;
        updateData.data.avatar_seed = ""; // clear seed when using custom url
      }

      if (newPassword !== "") {
        updateData.password = newPassword;
      }

      const { error } = await supabaseClient.auth.updateUser(updateData);

      if (error) {
        // If the error is only about the password matching the old password (e.g. autofilled password), update metadata without password!
        if (error.message && error.message.toLowerCase().includes('different from the old password')) {
          delete updateData.password;
          const { error: metaErr } = await supabaseClient.auth.updateUser(updateData);
          if (metaErr) throw metaErr;
          
          closeAllModals();
          document.getElementById('profilePassword').value = '';
          showToast("Profile details updated successfully! ✨");
          return;
        }
        throw error;
      }

      closeAllModals();
      document.getElementById('profilePassword').value = '';
      showToast("Profile settings saved successfully! ✨");
    } catch (err) {
      console.error('Profile update error:', err.message);
      showToast(err.message || "Failed to update profile settings.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  // Handle Logout (Live Supabase)
  logoutBtn.addEventListener('click', async () => {
    if (!supabaseClient) return;
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      closeAllModals();
      showToast("Logged out successfully.");
    } catch (err) {
      console.error('Logout error:', err.message);
      showToast("Failed to sign out.");
    }
  });

  // Trigger initial UI sync safely
  if (supabaseClient) {
    supabaseClient.auth.getUser()
      .then(({ data: { user } }) => updateAuthUI(user))
      .catch((err) => {
        console.warn("Initial session restoration fallback:", err);
        updateAuthUI(null);
      });
  }
})();


// ── Admin Control Panel Manager ──
(function initAdminPanel() {
  const adminModal = document.getElementById('adminModal');
  const adminOpenBtn = document.getElementById('adminOpenBtn');
  const adminCloseBtn = document.getElementById('adminCloseBtn');
  const adminRefreshBtn = document.getElementById('adminRefreshBtn');

  const adminBookingsTableBody = document.getElementById('adminBookingsTableBody');
  const adminReviewsTableBody = document.getElementById('adminReviewsTableBody');

  const statTotalBookings = document.getElementById('statTotalBookings');
  const statApprovedReviews = document.getElementById('statApprovedReviews');
  const statPendingReviews = document.getElementById('statPendingReviews');
  const adminBookingCount = document.getElementById('adminBookingCount');
  const adminReviewCount = document.getElementById('adminReviewCount');

  if (!adminModal) return;

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

  // Tab switching logic
  document.querySelectorAll('.admin-tab').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));

      tabBtn.classList.add('active');
      const targetTab = tabBtn.getAttribute('data-tab');
      const targetContent = document.getElementById(targetTab);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // Open & Close Admin Modal
  if (adminOpenBtn) {
    adminOpenBtn.addEventListener('click', async () => {
      if (!supabaseClient) return;
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user || (!user.email || !user.email.toLowerCase().includes('graphixlab07@gmail.com')) && !user.user_metadata?.is_admin) {
        showToast("Access Denied: Admin privileges required. 🔒");
        return;
      }
      adminModal.classList.add('active');
      loadAdminDashboardData();
    });
  }

  if (adminCloseBtn) {
    adminCloseBtn.addEventListener('click', () => {
      adminModal.classList.remove('active');
    });
  }

  if (adminRefreshBtn) {
    adminRefreshBtn.addEventListener('click', () => {
      loadAdminDashboardData();
      showToast("Refreshed live admin data! 🔄");
    });
  }

  adminModal.addEventListener('click', (e) => {
    if (e.target === adminModal) adminModal.classList.remove('active');
  });

  // Load all dashboard data
  async function loadAdminDashboardData() {
    if (!supabaseClient) return;
    await Promise.all([loadBookings(), loadReviews()]);
  }

  // Load Bookings Table & Stats
  async function loadBookings() {
    try {
      const { data, error } = await supabaseClient
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const bookings = data || [];
      if (statTotalBookings) statTotalBookings.textContent = bookings.length;
      if (adminBookingCount) adminBookingCount.textContent = bookings.length;

      if (!adminBookingsTableBody) return;

      if (bookings.length === 0) {
        adminBookingsTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No booking requests found in database.</td></tr>`;
        return;
      }

      adminBookingsTableBody.innerHTML = bookings.map(b => {
        const dateStr = b.created_at ? new Date(b.created_at).toLocaleString() : (b.date || 'N/A');
        const clientName = b.client_name || b.name || b.full_name || 'Client';
        const clientEmail = b.client_email || b.email || '';
        const clientPhone = b.client_phone || b.phone || b.mobile || 'N/A';
        const serviceName = b.service || b.service_type || b.plan || 'Design';
        const briefText = b.brief || b.description || b.message || b.details || 'No brief provided';

        return `
          <tr>
            <td style="white-space: nowrap; font-size: 0.78rem;">${escapeHtml(dateStr)}</td>
            <td><strong>${escapeHtml(clientName)}</strong></td>
            <td><span class="status-badge approved">${escapeHtml(serviceName)}</span></td>
            <td>
              <div><a href="mailto:${escapeHtml(clientEmail)}" style="color: var(--pastel-lavender); font-weight: 600;">${escapeHtml(clientEmail)}</a></div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">📞 ${escapeHtml(clientPhone)}</div>
            </td>
            <td style="max-width: 280px; font-style: italic; color: var(--text-secondary); line-height: 1.4;">${escapeHtml(briefText)}</td>
            <td>
              <button class="admin-action-btn btn-delete delete-booking-btn" data-id="${b.id}">Delete</button>
            </td>
          </tr>
        `;
      }).join('');

      // Wire delete booking buttons
      adminBookingsTableBody.querySelectorAll('.delete-booking-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const bookingId = btn.getAttribute('data-id');
          if (!confirm("Are you sure you want to delete this booking request?")) return;
          
          try {
            const { error } = await supabaseClient
              .from('bookings')
              .delete()
              .eq('id', bookingId);

            if (error) throw error;
            showToast("Booking deleted successfully!");
            loadBookings();
          } catch (err) {
            console.error("Delete booking error:", err.message);
            showToast("Failed to delete booking: " + err.message);
          }
        });
      });
    } catch (err) {
      console.error("Error loading admin bookings:", err.message);
      if (adminBookingsTableBody) {
        adminBookingsTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #ff4757; padding: 1.5rem;">⚠️ Could not fetch bookings: ${err.message}<br><small style="color: var(--text-muted);">Ensure RLS is disabled or SELECT policy is enabled on 'bookings' table in Supabase.</small></td></tr>`;
      }
    }
  }

  // Load Reviews Moderation Table & Stats
  async function loadReviews() {
    try {
      const { data, error } = await supabaseClient
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const reviews = data || [];
      const approvedCount = reviews.filter(r => r.approved === true || r.approved === 'true').length;
      const pendingCount = reviews.length - approvedCount;

      if (statApprovedReviews) statApprovedReviews.textContent = approvedCount;
      if (statPendingReviews) statPendingReviews.textContent = pendingCount;
      if (adminReviewCount) adminReviewCount.textContent = reviews.length;

      if (!adminReviewsTableBody) return;

      if (reviews.length === 0) {
        adminReviewsTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No customer reviews found in database.</td></tr>`;
        return;
      }

      adminReviewsTableBody.innerHTML = reviews.map(r => {
        const dateStr = r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A';
        const stars = '★'.repeat(r.rating || 5);
        const isApproved = r.approved === true || r.approved === 'true';
        const statusBadge = isApproved 
          ? `<span class="status-badge approved">Approved</span>`
          : `<span class="status-badge pending">Pending</span>`;

        const toggleBtnText = isApproved ? 'Disapprove' : 'Approve';
        const toggleBtnClass = isApproved ? 'btn-unapprove' : 'btn-approve';

        return `
          <tr>
            <td>${statusBadge}</td>
            <td><strong>${escapeHtml(r.name || 'Anonymous')}</strong></td>
            <td style="color: #ffab00;">${stars}</td>
            <td style="max-width: 280px; line-height: 1.4;">${escapeHtml(r.comment || '')}</td>
            <td style="white-space: nowrap; font-size: 0.78rem;">${dateStr}</td>
            <td style="white-space: nowrap;">
              <button class="admin-action-btn ${toggleBtnClass} toggle-review-btn" data-id="${r.id}" data-approved="${isApproved}">${toggleBtnText}</button>
              <button class="admin-action-btn btn-delete delete-review-btn" data-id="${r.id}">Delete</button>
            </td>
          </tr>
        `;
      }).join('');

      // Wire toggle approval buttons
      adminReviewsTableBody.querySelectorAll('.toggle-review-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const reviewId = btn.getAttribute('data-id');
          const currentApproved = btn.getAttribute('data-approved') === 'true';
          const newStatus = !currentApproved;

          try {
            const { error } = await supabaseClient
              .from('reviews')
              .update({ approved: newStatus })
              .eq('id', reviewId);

            if (error) throw error;

            showToast(newStatus ? "Review approved & published live! ✨" : "Review hidden from website.");
            await loadReviews();

            if (typeof window.refreshWebsiteReviews === 'function') {
              window.refreshWebsiteReviews();
            }
          } catch (err) {
            console.error("Toggle review error:", err.message);
            showToast("Failed to update review status: " + err.message);
          }
        });
      });

      // Wire delete review buttons
      adminReviewsTableBody.querySelectorAll('.delete-review-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const reviewId = btn.getAttribute('data-id');
          if (!confirm("Are you sure you want to delete this review?")) return;

          try {
            const { error } = await supabaseClient
              .from('reviews')
              .delete()
              .eq('id', reviewId);

            if (error) throw error;
            showToast("Review deleted successfully!");
            await loadReviews();

            if (typeof window.refreshWebsiteReviews === 'function') {
              window.refreshWebsiteReviews();
            }
          } catch (err) {
            console.error("Delete review error:", err.message);
            showToast("Failed to delete review: " + err.message);
          }
        });
      });

    } catch (err) {
      console.error("Error loading admin reviews:", err.message);
      if (adminReviewsTableBody) {
        adminReviewsTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #ff4757; padding: 1.5rem;">⚠️ Could not fetch reviews: ${err.message}<br><small style="color: var(--text-muted);">Ensure RLS is disabled or SELECT policy is enabled on 'reviews' table in Supabase.</small></td></tr>`;
      }
    }
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
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
    const href = this.getAttribute('href');
    if (href === '#' || href === '') return;
    
    try {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (err) {
      console.warn('Smooth scroll target search failed:', err);
    }
  });
});

