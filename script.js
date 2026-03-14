/* ==========================================================
   IDR — Institute of Digital Risk  |  script.js
   - Sticky navbar scroll effect
   - Mobile menu toggle
   - Active nav link highlight
   - Smooth scrolling
   - Scroll-reveal animations
   - Contact form validation
   ========================================================== */

(function () {
  'use strict';

  /* ── DOM Refs ── */
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const navItems  = document.querySelectorAll('.nav-link:not(.nav-cta)');
  const sections  = document.querySelectorAll('main section[id]');
  const form      = document.getElementById('contactForm');

  /* ==========================================================
     1. NAVBAR — scroll shadow & active link
     ========================================================== */
  function onScroll () {
    // Sticky shadow
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    // Active nav highlight
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) { currentId = sec.id; }
    });
    navItems.forEach(a => {
      const href = a.getAttribute('href').replace('#', '');
      a.classList.toggle('active', href === currentId);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ==========================================================
     2. MOBILE MENU TOGGLE
     ========================================================== */
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') &&
        !navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ==========================================================
     3. SMOOTH SCROLLING (fallback for older browsers)
     ========================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId  = link.getAttribute('href').slice(1);
      const target    = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement)
                            .getPropertyValue('--nav-h')) || 70;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ==========================================================
     4. SCROLL-REVEAL ANIMATIONS
     ========================================================== */
  const revealTargets = [
    '.section-header',
    '.about-text',
    '.about-visual',
    '.service-card',
    '.community-intro',
    '.comm-feature',
    '.contact-info',
    '.contact-form',
    '.about-pillars .pillar',
  ];

  // Add reveal class to elements
  revealTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      // Stagger cards and features
      if (el.matches('.service-card, .comm-feature, .pillar')) {
        el.classList.add(`reveal-delay-${(i % 3) + 1}`);
      }
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ==========================================================
     5. CONTACT FORM — validation & submission
     ========================================================== */
  if (form) {
    const nameInput    = document.getElementById('name');
    const emailInput   = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameErr      = document.getElementById('nameErr');
    const emailErr     = document.getElementById('emailErr');
    const messageErr   = document.getElementById('messageErr');
    const successBox   = document.getElementById('formSuccess');
    const submitBtn    = document.getElementById('submitBtn');

    function showError(input, errEl, msg) {
      input.classList.add('error');
      errEl.textContent = msg;
    }
    function clearError(input, errEl) {
      input.classList.remove('error');
      errEl.textContent = '';
    }

    // Live validation
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim()) clearError(nameInput, nameErr);
    });
    emailInput.addEventListener('input', () => {
      if (isValidEmail(emailInput.value)) clearError(emailInput, emailErr);
    });
    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim()) clearError(messageInput, messageErr);
    });

    function isValidEmail(val) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
    }

    function validateForm() {
      let valid = true;
      clearError(nameInput, nameErr);
      clearError(emailInput, emailErr);
      clearError(messageInput, messageErr);

      if (!nameInput.value.trim()) {
        showError(nameInput, nameErr, 'Please enter your full name.');
        valid = false;
      }
      if (!emailInput.value.trim()) {
        showError(emailInput, emailErr, 'Please enter your email address.');
        valid = false;
      } else if (!isValidEmail(emailInput.value)) {
        showError(emailInput, emailErr, 'Please enter a valid email address.');
        valid = false;
      }
      if (!messageInput.value.trim()) {
        showError(messageInput, messageErr, 'Please enter a message.');
        valid = false;
      }
      return valid;
    }

    form.addEventListener('submit', e => {
      e.preventDefault();
      successBox.classList.remove('visible');

      if (!validateForm()) return;

      // Simulate async submission
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      setTimeout(() => {
        form.reset();
        submitBtn.disabled  = false;
        submitBtn.innerHTML = `Send Message
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>`;
        successBox.textContent = '✓ Thank you! Your message has been received. We\'ll be in touch shortly.';
        successBox.classList.add('visible');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Hide after 6 s
        setTimeout(() => successBox.classList.remove('visible'), 6000);
      }, 1200);
    });
  }

  /* ==========================================================
     6. HERO — parallax subtle effect on scroll
     ========================================================== */
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroContent.style.transform = `translateY(${y * 0.1}px)`;
        heroContent.style.opacity   = `${1 - y / 600}`;
      }
    }, { passive: true });
  }

})();
