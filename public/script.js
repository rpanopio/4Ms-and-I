// ===========================
// 4Ms and I — JavaScript
// ===========================

// --- Sticky Header Shadow ---
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// --- Mobile Menu Toggle ---
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mobile-link, .mobile-cta').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
  });
});

// --- Smooth Scroll for all anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const headerHeight = header.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

// --- Scroll Reveal Animation ---
const revealElements = document.querySelectorAll(
  '.service-card, .step, .why-item, .stat-card, .testimonial-card, .contact-item'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, 80 * (entry.target.dataset.index || 0));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  el.dataset.index = i % 6;
  revealObserver.observe(el);
});

// --- Contact Form Submission ---
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const successMsg = document.getElementById('form-success');
const errorMsg = document.getElementById('form-error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Reset messages
  successMsg.style.display = 'none';
  errorMsg.style.display = 'none';

  // Get form data
  const data = {
    name: document.getElementById('name').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    email: document.getElementById('email').value.trim(),
    service: document.getElementById('service').value,
    message: document.getElementById('message').value.trim(),
  };

  // Basic validation
  if (!data.name || !data.phone) {
    errorMsg.textContent = '⚠️ Please enter your name and phone number.';
    errorMsg.style.display = 'block';
    return;
  }

  // Loading state
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      successMsg.style.display = 'block';
      form.reset();
      // Scroll to success message
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      errorMsg.textContent = '⚠️ ' + (result.message || 'Something went wrong. Please call us directly.');
      errorMsg.style.display = 'block';
    }
  } catch (err) {
    errorMsg.style.display = 'block';
  } finally {
    submitBtn.textContent = 'Request My Home Visit';
    submitBtn.disabled = false;
  }
});

// --- Phone number formatting ---
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', (e) => {
  let val = e.target.value.replace(/\D/g, '');
  if (val.length >= 6) {
    val = '(' + val.slice(0,3) + ') ' + val.slice(3,6) + '-' + val.slice(6,10);
  } else if (val.length >= 3) {
    val = '(' + val.slice(0,3) + ') ' + val.slice(3);
  }
  e.target.value = val;
});
