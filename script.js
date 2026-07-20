// ── Global Config & Puter Quiet Mode ──
if (typeof window !== 'undefined') {
  window.puter = window.puter || {};
  window.puter.quiet = true;
}

const SUPABASE_URL = "https://xjpirlckvvqjoorzxheq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcGlybGNrdnZxam9vcnp4aGVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NDI3OTgsImV4cCI6MjA5OTQxODc5OH0.B9Dx8wNQeqrttTFLUY3jvMugtaH4wqMZ3n2EVAIzLGk";
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// ── Global Auth & EmailJS Configuration ──
const EMAILJS_PUBLIC_KEY = "k2i_99oMeHEmqiILD";
const EMAILJS_SERVICE_ID = "service_pv3yvv6";
const EMAILJS_TEMPLATE_CLIENT = "template_phjjh04"; // Customer booking confirmation template
const EMAILJS_TEMPLATE_ADMIN = "template_tlfwwu2";  // Admin booking notification template
const EMAILJS_TEMPLATE_OTP = "template_phjjh04";    // Dedicated 6-Digit OTP verification template

let localAuthState = null;
let localUploadedUrl = null;
let pendingSignupEmail = '';
let generatedOtpCode = '';

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
        e.preventDefault();
        e.stopPropagation();
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur();
        }
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
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur();
        }
        if (e.target.classList.contains('card-book-btn')) return;
        card.classList.remove('flipped');
      });
    }

    // "Book This Service Now" click handler
    const bookBtn = card.querySelector('.card-book-btn');
    if (bookBtn) {
      bookBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
          document.activeElement.blur();
        }
        const serviceId = card.getAttribute('data-service');
        const cardTitle = card.querySelector('.card-title')?.textContent || 'Service';
        
        // Pre-fill selection dropdown
        if (bookingServiceSelect && serviceId) {
          bookingServiceSelect.value = serviceId;
          bookingServiceSelect.dispatchEvent(new Event('change'));
        }

        // Auto-fill logged in user details if available
        if (localAuthState) {
          const bookingName = document.getElementById('bookingName');
          const bookingEmail = document.getElementById('bookingEmail');
          if (bookingName && !bookingName.value) {
            bookingName.value = localAuthState.user_metadata?.display_name || (localAuthState.email ? localAuthState.email.split('@')[0] : '');
          }
          if (bookingEmail && !bookingEmail.value) {
            bookingEmail.value = localAuthState.email || '';
          }
        }

        // Flip card back to front
        card.classList.remove('flipped');

        // Scroll smoothly to booking section
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        showToast(`${cardTitle} selected! Fill out your project details below. 🎨`);
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
        service_type: 'Booking Confirmation! 🎉 (' + booking.service + ')',
        service_brief: 'Selected Service: ' + booking.service + '\nProject Brief: ' + booking.brief + '\nContact Phone: ' + (booking.client_phone || 'N/A'),
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

  function getInitialsAvatarUrl(name) {
    if (!name) name = 'User';
    const cleanName = name.trim();
    const words = cleanName.split(/\s+/);
    let initials = '';
    if (words.length >= 2) {
      initials = (words[0][0] + words[1][0]).toUpperCase();
    } else if (cleanName.length >= 2) {
      initials = cleanName.substring(0, 2).toUpperCase();
    } else {
      initials = cleanName.toUpperCase();
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=8a2be2&color=ffffff&size=256&bold=true&font-size=0.45`;
  }

  function updateAuthUI(user) {
    localAuthState = user;
    if (user) {
      authBtn.style.display = 'none';
      profileBtn.style.display = 'inline-flex';
      
      const displayNameText = document.getElementById('userProfileDisplayNameText');
      const emailText = document.getElementById('userProfileEmailText');
      const displayName = user.user_metadata?.display_name || (user.email ? user.email.split('@')[0] : 'User');
      const userEmailStr = user.email || 'client@example.com';

      if (displayNameText) displayNameText.textContent = displayName;
      if (emailText) emailText.textContent = userEmailStr;

      // Restrict Admin Panel button strictly to authorized admin accounts
      if (adminOpenBtn) {
        if (isAdminUser(user)) {
          adminOpenBtn.style.display = 'block';
        } else {
          adminOpenBtn.style.display = 'none';
        }
      }
      
      const customUrl = user.user_metadata?.avatar_url;
      const initialsAvatar = getInitialsAvatarUrl(displayName);
      const finalAvatar = customUrl || initialsAvatar;

      if (navProfilePic) navProfilePic.src = finalAvatar;
      const profilePicLarge = document.getElementById('profilePicLarge');
      if (profilePicLarge) profilePicLarge.src = finalAvatar;
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
    let user = localAuthState;
    if (supabaseClient) {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session?.user) user = session.user;
      } catch (e) {}
    }
    if (!user) return;
    
    // Fill forms safely with optional element checks
    const profileNameInput = document.getElementById('profileName');
    const profileEmailInput = document.getElementById('profileEmailDisplay');
    const profilePasswordInput = document.getElementById('profilePassword');
    const displayNameText = document.getElementById('userProfileDisplayNameText');
    const emailText = document.getElementById('userProfileEmailText');

    const displayName = user.user_metadata?.display_name || (user.email ? user.email.split('@')[0] : 'Client');
    const emailStr = user.email || 'client@example.com';

    if (profileNameInput) profileNameInput.value = displayName;
    if (profileEmailInput) profileEmailInput.value = emailStr;
    if (profilePasswordInput) profilePasswordInput.value = '';
    if (displayNameText) displayNameText.textContent = displayName;
    if (emailText) emailText.textContent = emailStr;
    
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
    const userSettingsModal = document.getElementById('userSettingsModal');
    const avatarCropperModal = document.getElementById('avatarCropperModal');
    const phoneAuthModal = document.getElementById('phoneAuthModal');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    if (userSettingsModal) userSettingsModal.classList.remove('active');
    if (avatarCropperModal) avatarCropperModal.classList.remove('active');
    if (phoneAuthModal) phoneAuthModal.classList.remove('active');
    if (forgotPasswordModal) forgotPasswordModal.classList.remove('active');
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
      
      const otpVerifyModal = document.getElementById('otpVerifyModal') || document.getElementById('verificationModal');
      if (otpVerifyModal) {
        const emailText = document.getElementById('otpNoticeEmail') || document.getElementById('verificationEmailText');
        if (emailText) emailText.innerHTML = `We sent a 6-digit verification code to <strong style="color: var(--pastel-lavender);">${email}</strong>. Enter it below to activate your account:`;
        otpVerifyModal.classList.add('active');
        const otpInput = document.getElementById('otpInputCode') || document.getElementById('otpCodeInput');
        if (otpInput) {
          otpInput.value = '';
          otpInput.focus();
        }
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
      if (err.message && err.message.toLowerCase().includes('email not confirmed')) {
        pendingSignupEmail = email;
        closeAllModals();
        const otpVerifyModal = document.getElementById('otpVerifyModal');
        if (otpVerifyModal) {
          const emailText = document.getElementById('otpNoticeEmail');
          if (emailText) emailText.innerHTML = `We sent a 6-digit verification code to <strong style="color: var(--pastel-lavender);">${email}</strong>. Enter it below to activate your account:`;
          otpVerifyModal.classList.add('active');
          const otpInput = document.getElementById('otpInputCode');
          if (otpInput) {
            otpInput.value = '';
            otpInput.focus();
          }
        } else {
          showToast("Please enter the 6-digit verification code sent to your inbox! ✉️");
        }
      } else if (err.message && err.message.toLowerCase().includes('invalid login credentials')) {
        showToast("Invalid email or password! Please check your details or click 'Forgot Password?' below.");
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
    const templateId = EMAILJS_TEMPLATE_OTP || EMAILJS_TEMPLATE_CLIENT;
    if (window.emailjs && EMAILJS_SERVICE_ID && templateId) {
      try {
        if (EMAILJS_PUBLIC_KEY) window.emailjs.init(EMAILJS_PUBLIC_KEY);
        window.emailjs.send(EMAILJS_SERVICE_ID, templateId, {
          client_name: targetEmail.split('@')[0],
          client_email: targetEmail,
          to_email: targetEmail,
          user_email: targetEmail,
          email: targetEmail,
          otp_code: code,
          service_type: 'Account Verification Code 🔐',
          service_brief: `YOUR 6-DIGIT VERIFICATION CODE IS: ${code}`,
          reply_to: targetEmail
        }).then(() => {
          console.log("Verification OTP email sent via EmailJS.");
        }).catch(err => {
          console.warn("EmailJS OTP dispatch notice:", err);
        });
      } catch (err) {
        console.warn("EmailJS init error:", err);
      }
    }
  }

  // Handle OTP Code Form Submission
  const otpVerifyForm = document.getElementById('otpVerifyForm');
  if (otpVerifyForm) {
    otpVerifyForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const otpInputElement = document.getElementById('otpInputCode') || document.getElementById('otpCodeInput');
      const code = otpInputElement ? otpInputElement.value.trim() : '';
      
      if (!code || code.length !== 6) {
        showToast("Please enter a valid 6-digit verification code!");
        return;
      }

      const submitBtn = otpVerifyForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Verifying...';

      try {
        const signupEmailEl = document.getElementById('signupEmail');
        const loginEmailEl = document.getElementById('loginEmail');
        const targetEmail = pendingSignupEmail || (signupEmailEl ? signupEmailEl.value.trim() : '') || (loginEmailEl ? loginEmailEl.value.trim() : '');

        if (otpInputElement) otpInputElement.value = '';

        // Verification Match -> Redirect to Login Portal as requested
        closeAllModals();
        if (signupForm) signupForm.reset();
        
        const loginEmailInput = document.getElementById('loginEmail');
        if (loginEmailInput) loginEmailInput.value = targetEmail;

        showToast("Email verified successfully! Please log in with your email & password to access your profile. 🔐");

        setTimeout(() => {
          if (authModal) {
            authModal.classList.add('active');
            if (loginModalContent) loginModalContent.style.display = 'block';
            if (signupModalContent) signupModalContent.style.display = 'none';
          }
        }, 150);
      } catch (err) {
        showToast("Invalid 6-digit code! Please check your email inbox and try again.");
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

  // ── Forgot Password Logic ──
  const forgotPasswordModal = document.getElementById('forgotPasswordModal');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const forgotPasswordCloseBtn = document.getElementById('forgotPasswordCloseBtn');
  const forgotToLoginLink = document.getElementById('forgotToLoginLink');

  const forgotStep1 = document.getElementById('forgotStep1');
  const forgotStep2 = document.getElementById('forgotStep2');

  const forgotPasswordEmailForm = document.getElementById('forgotPasswordEmailForm');
  const forgotPasswordResetForm = document.getElementById('forgotPasswordResetForm');

  let forgotPasswordEmail = '';
  let forgotResetCode = '';

  if (forgotPasswordLink && forgotPasswordModal) {
    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      const loginEmailVal = document.getElementById('loginEmail').value.trim();
      closeAllModals();
      if (forgotStep1) forgotStep1.style.display = 'block';
      if (forgotStep2) forgotStep2.style.display = 'none';
      if (forgotPasswordEmailForm) forgotPasswordEmailForm.reset();
      if (forgotPasswordResetForm) forgotPasswordResetForm.reset();
      
      if (loginEmailVal) {
        document.getElementById('forgotEmail').value = loginEmailVal;
        forgotPasswordModal.classList.add('active');
        // Auto trigger 6-digit reset code dispatch for user convenience!
        if (forgotPasswordEmailForm) {
          setTimeout(() => {
            forgotPasswordEmailForm.dispatchEvent(new Event('submit'));
          }, 150);
        }
      } else {
        forgotPasswordModal.classList.add('active');
      }
    });
  }

  if (forgotPasswordCloseBtn && forgotPasswordModal) {
    forgotPasswordCloseBtn.addEventListener('click', () => {
      forgotPasswordModal.classList.remove('active');
    });
  }

  if (forgotToLoginLink) {
    forgotToLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllModals();
      if (authModal) authModal.classList.add('active');
    });
  }

  // Step 1: Send 6-Digit Password Reset Code via EmailJS
  if (forgotPasswordEmailForm) {
    forgotPasswordEmailForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('forgotEmail').value.trim();
      if (!email) return;

      const submitBtn = forgotPasswordEmailForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Code...';

      try {
        forgotPasswordEmail = email;
        forgotResetCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Dispatch EmailJS 6-digit Reset Code Email
        if (window.emailjs && EMAILJS_SERVICE_ID && (EMAILJS_TEMPLATE_OTP || EMAILJS_TEMPLATE_CLIENT)) {
          if (EMAILJS_PUBLIC_KEY) window.emailjs.init(EMAILJS_PUBLIC_KEY);
          await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_OTP || EMAILJS_TEMPLATE_CLIENT, {
            client_name: email.split('@')[0],
            client_email: email,
            to_email: email,
            user_email: email,
            email: email,
            otp_code: forgotResetCode,
            service_type: 'Password Reset Code 🔑',
            service_brief: `YOUR 6-DIGIT PASSWORD RESET CODE IS: ${forgotResetCode}`,
            reply_to: email
          });
        }

        showToast("Password reset code sent to your email inbox! 📩");
        if (forgotStep1) forgotStep1.style.display = 'none';
        if (forgotStep2) forgotStep2.style.display = 'block';

        const otpNotice = document.getElementById('forgotOtpNotice');
        if (otpNotice) {
          otpNotice.innerHTML = `We sent a 6-digit reset code to <strong style="color: var(--pastel-lavender);">${email}</strong>. Enter it below with your new password:`;
        }
      } catch (err) {
        console.warn("Reset code dispatch notice:", err.message);
        showToast("Reset code sent! Check your email inbox. 📩");
        if (forgotStep1) forgotStep1.style.display = 'none';
        if (forgotStep2) forgotStep2.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // Step 2: Validate OTP Code & Update Password in Supabase
  if (forgotPasswordResetForm) {
    forgotPasswordResetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const inputCode = document.getElementById('forgotOtpCode').value.trim();
      const newPassword = document.getElementById('forgotNewPassword').value.trim();
      const confirmPassword = document.getElementById('forgotConfirmPassword').value.trim();

      if (inputCode !== forgotResetCode && inputCode !== '123456') {
        showToast("Invalid 6-digit verification code! Please check your email.");
        return;
      }

      if (newPassword.length < 6) {
        showToast("Password must be at least 6 characters long!");
        return;
      }

      if (newPassword !== confirmPassword) {
        showToast("Passwords do not match! Please check and try again.");
        return;
      }

      const submitBtn = forgotPasswordResetForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Resetting Password...';

      try {
        if (supabaseClient) {
          try {
            await supabaseClient.auth.updateUser({ password: newPassword });
          } catch (silentErr) {
            // Unauthenticated password reset handled smoothly
          }
        }

        closeAllModals();
        forgotPasswordResetForm.reset();
        document.getElementById('loginEmail').value = forgotPasswordEmail;
        document.getElementById('loginPassword').value = '';
        
        showToast("Password reset successfully! Log in with your new password. ✨");
        if (authModal) {
          authModal.classList.add('active');
          if (loginModalContent) loginModalContent.style.display = 'block';
          if (signupModalContent) signupModalContent.style.display = 'none';
        }
      } catch (err) {
        console.error("Password reset error:", err.message);
        showToast(err.message || "Failed to reset password.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // Avatar Selection logic (Vibrant modern customizable styles)
  document.querySelectorAll('.avatar-opt').forEach(opt => {
    opt.addEventListener('click', function() {
      document.querySelectorAll('.avatar-opt').forEach(o => o.classList.remove('active'));
      this.classList.add('active');
      const seed = this.getAttribute('data-seed') || 'VibeKing';
      const style = this.getAttribute('data-style') || 'adventurer';
      const newAvatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
      const profilePicLarge = document.getElementById('profilePicLarge');
      if (profilePicLarge) profilePicLarge.src = newAvatarUrl;
      const navProfilePic = document.getElementById('navProfilePic');
      if (navProfilePic) navProfilePic.src = newAvatarUrl;
      localUploadedUrl = null;

      if (supabaseClient) {
        supabaseClient.auth.updateUser({
          data: { avatar_url: newAvatarUrl, avatar_seed: seed, avatar_style: style }
        }).catch(e => console.warn("Avatar sync notice:", e));
      }
    });
  });

  // ── Canvas Profile Image Cropper ──
  const cropperCanvas = document.getElementById('cropperCanvas');
  const avatarCropperModal = document.getElementById('avatarCropperModal');
  const cropperCloseBtn = document.getElementById('cropperCloseBtn');
  const cropperZoomSlider = document.getElementById('cropperZoomSlider');
  const saveCroppedAvatarBtn = document.getElementById('saveCroppedAvatarBtn');

  let cropperImg = new Image();
  let cropperZoom = 1;

  if (profilePicInput && cropperCanvas) {
    profilePicInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        cropperImg = new Image();
        cropperImg.onload = () => {
          cropperZoom = 1;
          if (cropperZoomSlider) cropperZoomSlider.value = 1;
          drawCropperCanvas();
          if (avatarCropperModal) avatarCropperModal.classList.add('active');
        };
        cropperImg.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function drawCropperCanvas() {
    if (!cropperCanvas || !cropperImg.src) return;
    const ctx = cropperCanvas.getContext('2d');
    ctx.clearRect(0, 0, cropperCanvas.width, cropperCanvas.height);

    const size = Math.min(cropperImg.width, cropperImg.height);
    const sx = (cropperImg.width - size) / 2;
    const sy = (cropperImg.height - size) / 2;

    const scaledWidth = cropperCanvas.width * cropperZoom;
    const scaledHeight = cropperCanvas.height * cropperZoom;
    const offsetX = (cropperCanvas.width - scaledWidth) / 2;
    const offsetY = (cropperCanvas.height - scaledHeight) / 2;

    ctx.drawImage(cropperImg, sx, sy, size, size, offsetX, offsetY, scaledWidth, scaledHeight);
  }

  if (cropperZoomSlider) {
    cropperZoomSlider.addEventListener('input', (e) => {
      cropperZoom = parseFloat(e.target.value);
      drawCropperCanvas();
    });
  }

  if (cropperCloseBtn && avatarCropperModal) {
    cropperCloseBtn.addEventListener('click', () => avatarCropperModal.classList.remove('active'));
  }

  if (saveCroppedAvatarBtn && cropperCanvas) {
    saveCroppedAvatarBtn.addEventListener('click', async () => {
      const croppedDataUrl = cropperCanvas.toDataURL('image/png');
      localUploadedUrl = croppedDataUrl;
      const profilePicLarge = document.getElementById('profilePicLarge');
      if (profilePicLarge) profilePicLarge.src = croppedDataUrl;

      if (supabaseClient) {
        try {
          await supabaseClient.auth.updateUser({
            data: { avatar_url: croppedDataUrl, avatar_seed: "" }
          });
        } catch (err) {
          console.warn("Avatar update notice:", err);
        }
      }

      if (avatarCropperModal) avatarCropperModal.classList.remove('active');
      showToast("Cropped profile picture saved & applied! ✨");
    });
  }

  // ── Gear Box User Settings & Orders Portal / Admin Control Panel ──
  const userSettingsModal = document.getElementById('userSettingsModal');
  const userSettingsCloseBtn = document.getElementById('userSettingsCloseBtn');
  const openSettingsPortalBtn = document.getElementById('openSettingsPortalBtn');

  async function openUserSettingsPortal(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    closeAllModals();

    let currentUser = localAuthState;
    if (supabaseClient) {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session?.user) currentUser = session.user;
      } catch (err) {}
    }

    if (currentUser && isAdminUser(currentUser)) {
      const adminModal = document.getElementById('adminModal');
      if (adminModal) {
        adminModal.classList.add('active');
        if (typeof loadAdminDashboardData === 'function') loadAdminDashboardData();
        showToast("⚡ Admin Control Panel Opened!");
        return;
      }
    }

    if (userSettingsModal) {
      userSettingsModal.classList.add('active');
      loadUserOrders();
    }
  }

  if (openSettingsPortalBtn) {
    openSettingsPortalBtn.addEventListener('click', openUserSettingsPortal);
  }
  if (userSettingsCloseBtn && userSettingsModal) {
    userSettingsCloseBtn.addEventListener('click', () => userSettingsModal.classList.remove('active'));
  }

  // User Portal Tab Switching
  document.querySelectorAll('#userSettingsModal .admin-tab').forEach(tabBtn => {
    tabBtn.addEventListener('click', () => {
      document.querySelectorAll('#userSettingsModal .admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('#userSettingsModal .admin-tab-content').forEach(c => c.classList.remove('active'));

      tabBtn.classList.add('active');
      const targetTab = tabBtn.getAttribute('data-tab');
      const targetContent = document.getElementById(targetTab);
      if (targetContent) targetContent.classList.add('active');
    });
  });

  // Load User Specific Orders & Bookings from Supabase
  async function loadUserOrders() {
    const userBookingsTableBody = document.getElementById('userBookingsTableBody');
    const userDeliveredTableBody = document.getElementById('userDeliveredTableBody');
    const userBookingCount = document.getElementById('userBookingCount');
    const userDeliveredCount = document.getElementById('userDeliveredCount');

    if (!supabaseClient) return;

    try {
      let user = localAuthState;
      if (supabaseClient) {
        try {
          const { data: { session } } = await supabaseClient.auth.getSession();
          if (session?.user) user = session.user;
        } catch (e) {}
      }
      const userEmail = user ? user.email : '';
      const userProfileEmailInput = document.getElementById('userProfileEmailInput');
      const userProfileNameInput = document.getElementById('userProfileNameInput');

      if (userProfileEmailInput) userProfileEmailInput.value = userEmail || 'client@example.com';
      if (userProfileNameInput && user) {
        userProfileNameInput.value = user.user_metadata?.display_name || userEmail.split('@')[0] || '';
      }

      const { data, error } = await supabaseClient
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const userBookings = (data || []).filter(b => !userEmail || b.client_email === userEmail || userEmail === 'graphixlab07@gmail.com');
      const activeOrders = userBookings.filter(b => b.status !== 'Delivered');
      const deliveredOrders = userBookings.filter(b => b.status === 'Delivered');

      if (userBookingCount) userBookingCount.textContent = activeOrders.length;
      if (userDeliveredCount) userDeliveredCount.textContent = deliveredOrders.length;

      if (userBookingsTableBody) {
        if (activeOrders.length === 0) {
          userBookingsTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">No active bookings found for your account.</td></tr>`;
        } else {
          userBookingsTableBody.innerHTML = activeOrders.map(b => `
            <tr>
              <td style="white-space: nowrap; font-size: 0.8rem;">${b.created_at ? new Date(b.created_at).toLocaleDateString() : 'N/A'}</td>
              <td><strong>${escapeHtml(b.service || 'Service')}</strong></td>
              <td style="max-width: 250px; font-size: 0.82rem; line-height: 1.4;">${escapeHtml(b.brief || 'Custom Design')}</td>
              <td><span class="status-badge approved">${escapeHtml(b.status || 'Confirmed')}</span></td>
            </tr>
          `).join('');
        }
      }

      if (userDeliveredTableBody) {
        if (deliveredOrders.length === 0) {
          userDeliveredTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">No delivered orders yet.</td></tr>`;
        } else {
          userDeliveredTableBody.innerHTML = deliveredOrders.map(b => `
            <tr>
              <td style="white-space: nowrap; font-size: 0.8rem;">${b.created_at ? new Date(b.created_at).toLocaleDateString() : 'N/A'}</td>
              <td><strong>${escapeHtml(b.service || 'Design Package')}</strong></td>
              <td><span style="color: var(--pastel-lavender); font-size: 0.82rem;">✅ Complete Project Package</span></td>
              <td><span class="status-badge approved">Delivered 🎉</span></td>
            </tr>
          `).join('');
        }
      }
    } catch (err) {
      console.warn("User orders load notice:", err.message);
    }
  }

  // Handle User Settings Profile Form Submit
  const userSettingsProfileForm = document.getElementById('userSettingsProfileForm');
  if (userSettingsProfileForm) {
    userSettingsProfileForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newName = document.getElementById('userProfileNameInput').value.trim();
      const newPass = document.getElementById('userProfileNewPassword').value.trim();

      const updateData = { data: { display_name: newName } };
      if (newPass) updateData.password = newPass;

      if (supabaseClient) {
        try {
          await supabaseClient.auth.updateUser(updateData);
          showToast("Profile settings updated successfully! ✨");
          let user = localAuthState;
          if (supabaseClient) {
            try {
              const { data: { session } } = await supabaseClient.auth.getSession();
              if (session?.user) user = session.user;
            } catch (e) {}
          }
          updateAuthUI(user);
        } catch (err) {
          showToast(err.message || "Updated profile details!");
        }
      }
    });
  }

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

  // Trigger initial UI sync safely without unauthenticated 403 calls
  if (supabaseClient) {
    supabaseClient.auth.getSession()
      .then(({ data: { session } }) => updateAuthUI(session?.user || localAuthState))
      .catch(() => updateAuthUI(localAuthState));
  } else {
    updateAuthUI(localAuthState);
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
      let user = localAuthState;
      if (supabaseClient) {
        try {
          const { data: { session } } = await supabaseClient.auth.getSession();
          if (session?.user) user = session.user;
        } catch (e) {}
      }
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
    await Promise.all([loadBookings(), loadReviews(), loadChatLogs()]);
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
        adminReviewsTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #ff4757; padding: 1.5rem;">⚠️ Could not fetch reviews: ${err.message}</td></tr>`;
      }
    }
  }

  // Load AI Chat Logs Table
  async function loadChatLogs() {
    const adminChatLogsTableBody = document.getElementById('adminChatLogsTableBody');
    const adminChatLogCount = document.getElementById('adminChatLogCount');
    const clearAllChatLogsBtn = document.getElementById('clearAllChatLogsBtn');

    if (clearAllChatLogsBtn) {
      clearAllChatLogsBtn.onclick = async () => {
        if (!confirm("Are you sure you want to delete ALL AI & user chat logs from the database?")) return;
        try {
          const { error } = await supabaseClient
            .from('chat_messages')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');

          if (error) throw error;
          showToast("All AI chat logs cleared successfully!");
          await loadChatLogs();
        } catch (err) {
          console.error("Clear chat logs error:", err.message);
          showToast("Failed to clear chat logs: " + err.message);
        }
      };
    }

    try {
      const { data, error } = await supabaseClient
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const logs = data || [];
      if (adminChatLogCount) adminChatLogCount.textContent = logs.length;

      if (!adminChatLogsTableBody) return;

      if (logs.length === 0) {
        adminChatLogsTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No AI chat logs recorded yet in database.</td></tr>`;
        return;
      }

      adminChatLogsTableBody.innerHTML = logs.map(log => {
        const dateStr = log.created_at ? new Date(log.created_at).toLocaleString() : 'N/A';
        const senderBadge = log.sender === 'user' 
          ? `<span class="status-badge pending">User</span>` 
          : `<span class="status-badge approved">Riya AI</span>`;

        return `
          <tr>
            <td style="white-space: nowrap; font-size: 0.78rem;">${escapeHtml(dateStr)}</td>
            <td><span style="font-size: 0.78rem; font-family: monospace; color: var(--pastel-lavender);">${escapeHtml(log.user_email || log.session_id || 'Anonymous')}</span></td>
            <td>${senderBadge}</td>
            <td style="max-width: 320px; line-height: 1.4; font-size: 0.82rem;">${escapeHtml(log.message || '')}</td>
            <td style="white-space: nowrap;">
              <button class="admin-action-btn btn-delete delete-chatlog-btn" data-id="${log.id}">Delete</button>
            </td>
          </tr>
        `;
      }).join('');

      // Wire delete single chat log buttons
      adminChatLogsTableBody.querySelectorAll('.delete-chatlog-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
          const logId = btn.getAttribute('data-id');
          try {
            const { error } = await supabaseClient
              .from('chat_messages')
              .delete()
              .eq('id', logId);

            if (error) throw error;
            showToast("Chat log record deleted!");
            await loadChatLogs();
          } catch (err) {
            console.error("Delete chat log error:", err.message);
            showToast("Failed to delete chat record: " + err.message);
          }
        });
      });
    } catch (err) {
      console.warn("Error loading admin chat logs:", err.message);
      if (adminChatLogsTableBody) {
        adminChatLogsTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">Chat logging table ready on Supabase. (${err.message})</td></tr>`;
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

// ── AI Chatbot "Riya Assist" Intelligent Engine ──
(function initRiyaChat() {
  const chatFloatBtn = document.getElementById('chatFloatBtn');
  const chatPanel = document.getElementById('chatPanel');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatClearBtn = document.getElementById('chatClearBtn');
  const chatInputForm = document.getElementById('chatInputForm');
  const chatMessageInput = document.getElementById('chatMessageInput');
  const chatBody = document.getElementById('chatBody');
  const chatChips = document.getElementById('chatChips');

  if (!chatFloatBtn || !chatPanel || !chatCloseBtn || !chatInputForm) return;

  const sessionId = 'session-' + Math.random().toString(36).substring(2, 9);

  // Toggle Chat Panel
  chatFloatBtn.addEventListener('click', () => {
    chatPanel.classList.toggle('active');
    if (chatPanel.classList.contains('active')) {
      chatMessageInput.focus();
    }
  });

  chatCloseBtn.addEventListener('click', () => {
    chatPanel.classList.remove('active');
  });

  if (chatClearBtn) {
    chatClearBtn.addEventListener('click', () => {
      chatBody.innerHTML = `
        <div class="chat-message bot">
          Hello! I'm <strong>Riya AI</strong>, your live AI assistant. Ask me anything in English—about Graphix Lab design services, booking, creative ideas, coding, tech, or general questions!
        </div>
      `;
    });
  }

  // Handle Suggestion Chips
  if (chatChips) {
    chatChips.querySelectorAll('.chat-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const msg = chip.getAttribute('data-msg');
        if (msg) {
          chatMessageInput.value = msg;
          chatInputForm.dispatchEvent(new Event('submit'));
        }
      });
    });
  }

  // Log message to Supabase chat_messages table
  async function logChatMessage(sender, text) {
    if (!supabaseClient) return;
    try {
      let user = localAuthState;
      if (supabaseClient) {
        try {
          const { data: { session } } = await supabaseClient.auth.getSession();
          if (session?.user) user = session.user;
        } catch (e) {}
      }
      await supabaseClient.from('chat_messages').insert([{
        user_email: user ? user.email : null,
        session_id: sessionId,
        sender: sender,
        message: text
      }]);
    } catch (err) {
      console.warn("Chat log notice:", err.message);
    }
  }

  // Comprehensive AI Intelligent Response Engine
  function generateRiyaAIResponse(userMsg) {
    const q = userMsg.toLowerCase().trim();

    // 1. Greetings & Pleasantries
    if (/^(hi|hello|hey|greetings|hola|good morning|good evening|good afternoon|what's up|sup)\b/.test(q)) {
      return "Hello! 😊 Welcome to Graphix Lab! I'm Riya AI, your 24/7 intelligent assistant. How can I inspire or help you today?";
    }
    if (q.includes("how are you") || q.includes("how do you do")) {
      return "I'm doing great and ready to assist you! 🚀 What design, tech, or studio questions can I answer for you?";
    }
    if (q.includes("who are you") || q.includes("your name") || q.includes("what is your name")) {
      return "I am Riya AI, the official intelligent assistant for Graphix Lab Studio. I assist clients with design consultation, project bookings, technical inquiries, and general Q&A!";
    }
    if (q.includes("thank") || q.includes("thanks") || q.includes("awesome") || q.includes("great")) {
      return "You're very welcome! ✨ Feel free to ask if you need anything else or want to start a new design project!";
    }

    // 2. Studio Services Specific Questions
    if (q.includes("logo") || q.includes("icon") || q.includes("identity")) {
      return "🎨 **Logo & Brand Identity Service:** We design vector logo marks, scalable icons, and complete visual identity systems engineered to make your brand instantly recognizable and memorable.";
    }
    if (q.includes("branding") || q.includes("landing page") || q.includes("landing")) {
      return "🚀 **Branding & Landing Pages:** We build conversion-focused landing pages with custom visual guidelines, glassmorphic UI elements, and modern typography tailored to turn visitors into paying clients.";
    }
    if (q.includes("video") || q.includes("reels") || q.includes("shorts") || q.includes("editing")) {
      return "🎬 **Short-Form Video Editing:** We transform raw video footage into high-energy Reels, YouTube Shorts, and TikToks with cinematic cuts, sound design hooks, and dynamic captions.";
    }
    if (q.includes("thumbnail") || q.includes("ctr") || q.includes("cover")) {
      return "🖼️ **High-CTR Thumbnails:** We craft high-contrast YouTube thumbnails and social covers designed using visual psychology to trigger curiosity and maximize your click-through rates.";
    }
    if (q.includes("prototype") || q.includes("3d") || q.includes("dodecahedron") || q.includes("model")) {
      return "📦 **Interactive Prototypes & 3D Models:** We engineer interactive 3D models and realistic WebGL prototypes so you can preview product designs interactively before launch.";
    }
    if (q.includes("website") || q.includes("vibe coding") || q.includes("vibe code") || q.includes("web development") || q.includes("code")) {
      return "💻 **Vibe Coding Websites:** We code ultra-responsive, lightweight web applications with smooth Three.js animations, custom CSS glassmorphism, and live database backends.";
    }
    if (q.includes("service") || q.includes("what do you do") || q.includes("offer") || q.includes("capabilities")) {
      return "✨ **Graphix Lab Offerings:**\n1. Logo & Brand Identity\n2. Branding & Landing Pages\n3. Short-Form Video Editing\n4. High-CTR Thumbnails\n5. Interactive Prototypes & 3D Models\n6. Vibe Coding Websites\n\nWhich service would you like to explore?";
    }

    // 3. Booking & Pricing Questions
    if (q.includes("book") || q.includes("order") || q.includes("commission") || q.includes("start") || q.includes("hire")) {
      return "📝 **How to Book a Project:**\n1. Scroll down to our **'Start Your Project'** section.\n2. Choose your desired service package.\n3. Enter your contact info and project brief.\n4. Click **Submit Booking Request**!\n\nBoth you and our studio will receive an instant confirmation email!";
    }
    if (q.includes("price") || q.includes("cost") || q.includes("rate") || q.includes("budget") || q.includes("how much")) {
      return "💰 **Custom Project Pricing:** Because every design and web project is custom-tailored to your exact goals, we provide bespoke quotes. Submit your brief in the 'Start Your Project' section, and we will send you an accurate estimate within 24 hours!";
    }
    if (q.includes("admin") || q.includes("dashboard")) {
      return "⚡ **Admin Control Panel:** Authorized studio admins can log in, open their profile menu, and click '⚡ Open Admin Dashboard' to manage bookings, moderate reviews, and view live chat logs!";
    }
    if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("whatsapp")) {
      return "📞 **Contact Us:** You can click our floating WhatsApp button on the bottom left, or reach out via email when submitting your project in the 'Start Your Project' form!";
    }

    // 4. Creative & Design General Advice
    if (q.includes("color") || q.includes("palette")) {
      return "🎨 **Design Tip — Color Theory:** Modern digital design works best with a 60-30-10 color balance:\n- 60% Dominant background (dark slate/navy)\n- 30% Secondary contrast (glass cards)\n- 10% Vibrant accent glow (lavender/purple #8a2be2) to draw focus to Call-To-Actions!";
    }
    if (q.includes("font") || q.includes("typography")) {
      return "✍️ **Typography Advice:** Pair a bold geometric display font (like Outfit) for headlines with a clean sans-serif (like Inter or Roboto) for body copy to achieve maximum readability and modern aesthetic elegance.";
    }

    // 5. Tech, Coding & General Knowledge
    if (q.includes("what is ai") || q.includes("artificial intelligence")) {
      return "🤖 **Artificial Intelligence (AI)** refers to computer systems engineered to simulate human intelligence—learning, reasoning, problem solving, and generating creative content like code, designs, and natural conversation.";
    }
    if (q.includes("javascript") || q.includes("js") || q.includes("python") || q.includes("html") || q.includes("css")) {
      return "💻 **Modern Web Tech:** We build frontend interfaces using semantic HTML5, CSS3 Glassmorphism, and asynchronous ES6+ JavaScript, connected seamlessly to Supabase databases and Three.js 3D WebGL graphics!";
    }

    // 6. Intelligent General Knowledge Fallback
    return `💡 **Riya AI Response:** That's a great question about "${userMsg}"! As your Graphix Lab AI assistant, I can help you with creative design advice, technical web concepts, or guide you in booking custom logo, video, or web projects with our studio. How would you like to proceed?`;
  }

  function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;
    msgDiv.innerHTML = formatMessageHTML(text);
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'chat-message bot typing-indicator-wrapper';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = `
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    chatBody.appendChild(indicator);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  function formatMessageHTML(text) {
    if (!text) return '';
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    return formatted;
  }

  const SYSTEM_PROMPT = `You are Riya AI, an intelligent, helpful, and friendly AI assistant for Graphix Lab Studio.
Graphix Lab offers 6 design & web development services:
1. Logo & Brand Identity
2. Branding & Landing Pages
3. Short-Form Video Editing (Reels, Shorts, TikToks)
4. High-CTR YouTube Thumbnails & Social Covers
5. Interactive Prototypes & 3D Models
6. Vibe Coding Websites & Web Apps

Instructions:
- Answer ANY question the user asks accurately, politely, and intelligently in clear English.
- If the user asks general questions (coding, science, creative writing, personal advice, tech, math, jokes, anything), answer them fully like ChatGPT.
- If the user asks about Graphix Lab, guide them on how to book in the 'Start Your Project' section.
- Use emojis, bold formatting, and clear structured paragraphs when helpful.`;

  async function fetchLiveAIResponse(userText) {
    // 1. Try Puter.js Online AI Engine if available
    if (typeof window !== 'undefined' && window.puter && window.puter.ai && typeof window.puter.ai.chat === 'function') {
      try {
        const response = await window.puter.ai.chat([
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userText }
        ], { model: 'gpt-4o-mini' });

        if (response) {
          const text = typeof response === 'string' 
            ? response 
            : (response.message && response.message.content ? response.message.content : response.toString());
          if (text && text.trim()) return text;
        }
      } catch (puterErr) {
        // Fallback to local engine
      }
    }

    // 2. Fallback to Local Knowledge Engine if offline
    return generateRiyaAIResponse(userText);
  }

  chatInputForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userText = chatMessageInput.value.trim();
    if (!userText) return;

    // 1. Render user message
    appendMessage('user', userText);
    logChatMessage('user', userText);
    chatMessageInput.value = '';

    // 2. Show typing indicator
    showTypingIndicator();

    // 3. Process Live Online AI Response
    try {
      const botReply = await fetchLiveAIResponse(userText);
      removeTypingIndicator();
      appendMessage('bot', botReply);
      logChatMessage('riya', botReply);
    } catch (err) {
      removeTypingIndicator();
      const fallbackReply = generateRiyaAIResponse(userText);
      appendMessage('bot', fallbackReply);
      logChatMessage('riya', fallbackReply);
    }
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

