// ── CUSTOM CURSOR ──
// ── THEME TOGGLE ──
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
  document.documentElement.setAttribute('data-theme', currentTheme);
  if (currentTheme === 'light') {
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  }
}

themeToggle.addEventListener('click', () => {
  let theme = document.documentElement.getAttribute('data-theme');
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('theme', 'light');
  }
});

const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

const updateCursor = (x, y) => {
  cursorDot.style.left = x + 'px';
  cursorDot.style.top = y + 'px';

  cursorRing.animate({
    left: x + 'px',
    top: y + 'px'
  }, { duration: 500, fill: 'forwards' });
};

document.addEventListener('mousemove', (e) => updateCursor(e.clientX, e.clientY));
document.addEventListener('touchmove', (e) => {
  if (e.touches[0]) updateCursor(e.touches[0].clientX, e.touches[0].clientY);
});
document.addEventListener('touchstart', (e) => {
  if (e.touches[0]) updateCursor(e.touches[0].clientX, e.touches[0].clientY);
});

// Cursor expansion on hoverable elements
const hoverables = document.querySelectorAll('a, button, .skill-card, .project-card, .cert-card, .menu-toggle, #theme-toggle');
hoverables.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorRing.style.width = '60px';
    cursorRing.style.height = '60px';
    cursorRing.style.borderColor = 'var(--accent-cyan)';
    cursorRing.style.background = 'rgba(0, 245, 212, 0.05)';
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.style.width = '40px';
    cursorRing.style.height = '40px';
    cursorRing.style.borderColor = 'var(--accent-violet)';
    cursorRing.style.background = 'transparent';
  });
});

// ── SCROLL PROGRESS & NAVBAR HIDE/SHOW ──
const scrollProgress = document.getElementById('scroll-progress');
const navbar = document.getElementById('navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  let scrolled = (winScroll / height) * 100;
  scrollProgress.style.width = scrolled + '%';

  // Navbar Hide on Scroll Down, Show on Scroll Up
  if (winScroll > lastScrollTop && winScroll > 100) {
    navbar.classList.add('nav-hidden');
  } else {
    navbar.classList.remove('nav-hidden');
  }
  lastScrollTop = winScroll;

  // Show Back to Top
  if (winScroll > 500) {
    document.getElementById('back-to-top').classList.add('visible');
  } else {
    document.getElementById('back-to-top').classList.remove('visible');
  }
});

document.getElementById('back-to-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── TYPEWRITER EFFECT ──
const typewriterSpan = document.getElementById('typewriter');
const roles = ["Data Scientist", "Web Developer", "Data Analyst"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    typewriterSpan.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 50;
  } else {
    typewriterSpan.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 150;
  }

  if (!isDeleting && charIndex === currentRole.length) {
    isDeleting = true;
    typeSpeed = 2000; // Pause at end
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    typeSpeed = 500;
  }

  setTimeout(type, typeSpeed);
}

type();

// ── REVEAL ANIMATIONS ON SCROLL (Intersection Observer) ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (entry.isIntersecting) {
      // Determine direction relative to last scroll position
      if (currentScrollTop > lastScrollTop) {
        // Scrolling Down: Reveal from bottom
        entry.target.classList.remove('scroll-up');
      } else {
        // Scrolling Up: Reveal from top
        entry.target.classList.add('scroll-up');
      }
      entry.target.classList.add('visible');
    } else {
      // Remove visible class when it leaves the viewport to allow re-animation "each time"
      entry.target.classList.remove('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px 0px 0px' });

document.querySelectorAll('.reveal, .reveal-heading').forEach(el => revealObserver.observe(el));

// ── PROJECT CARD 3D TILT EFFECT ──
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = (x / rect.width - 0.5) * 15; // Max 15deg tilt
    const yPct = (y / rect.height - 0.5) * -15;

    card.style.transform = `perspective(1000px) rotateX(${yPct}deg) rotateY(${xPct}deg) translateY(-8px) scale(1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
  });
});

// ── CONTACT FORM ──
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button');
    const responseDiv = document.getElementById('formResponse');
    const originalText = btn.innerHTML;

    btn.innerHTML = 'Sending...';
    btn.disabled = true;

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        btn.innerHTML = '✓ Message Sent!';
        btn.style.background = '#00F5D4';
        btn.style.color = '#080810';

        responseDiv.innerHTML = '<i class="fas fa-check-circle"></i> Success! Your message has been sent.';
        responseDiv.style.display = 'block';
        responseDiv.style.background = 'rgba(0, 245, 212, 0.1)';
        responseDiv.style.color = '#00F5D4';
        responseDiv.style.border = '1px solid rgba(0, 245, 212, 0.2)';

        contactForm.reset();
      } else {
        throw new Error('Failed');
      }
    } catch (err) {
      btn.innerHTML = 'Error! Try again';
      btn.style.background = '#FF6B6B';

      responseDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error! Please try again later.';
      responseDiv.style.display = 'block';
      responseDiv.style.background = 'rgba(255, 107, 107, 0.1)';
      responseDiv.style.color = '#FF6B6B';
      responseDiv.style.border = '1px solid rgba(255, 107, 107, 0.2)';
    } finally {
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
        responseDiv.style.display = 'none';
      }, 5000);
    }
  });
}

// ── MOBILE MENU TOGGLE ──
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    if(menuToggle) menuToggle.classList.remove('active');
    if(navLinks) navLinks.classList.remove('active');
  });
});
