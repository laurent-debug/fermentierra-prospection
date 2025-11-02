// Smooth scrolling for navigation links
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section, .hero');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');

    if (!targetId || !targetId.startsWith('#')) {
      return;
    }

    e.preventDefault();
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      const navHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = targetSection.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Update active link
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Close mobile menu if open
      const navMenu = document.getElementById('navMenu');
      navMenu.classList.remove('active');
    }
  });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  // Update active nav link based on scroll position
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - navbar.offsetHeight - 100;
    const sectionHeight = section.offsetHeight;
    
    if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
  
  lastScrollTop = scrollTop;
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  navToggle.classList.toggle('active');
});

// Scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Add fade-in class to elements
const animateElements = document.querySelectorAll('.advantage-card, .product-card, .service-card, .about-content, .contact-content');
animateElements.forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm && formSuccess) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const formData = {
      name: document.getElementById('name').value,
      establishment: document.getElementById('establishment').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      interest: document.getElementById('interest').value,
      message: document.getElementById('message').value
    };

    // Log form data (in a real application, this would send to a server)
    console.log('Form submitted:', formData);

    // Show success message
    contactForm.style.display = 'none';
    formSuccess.classList.add('show');

    // Reset form after 5 seconds
    setTimeout(() => {
      contactForm.style.display = 'block';
      formSuccess.classList.remove('show');
      contactForm.reset();
    }, 5000);
  });
}

// Add hover effects to product cards
const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-8px) scale(1.02)';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) scale(1)';
  });

  card.addEventListener('click', () => {
    const target = card.dataset.target || card.getAttribute('href');

    if (target && card.tagName.toLowerCase() !== 'a') {
      window.location.href = target;
    }
  });
});

// Add hover effects to advantage and service cards
const hoverCards = document.querySelectorAll('.advantage-card, .service-card');
hoverCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-5px) scale(1.02)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) scale(1)';
  });
});

// Smooth scroll to top on logo click
const logos = document.querySelectorAll('.nav-logo, .footer-logo');
logos.forEach(logo => {
  logo.style.cursor = 'pointer';
  logo.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});

// Initialize on page load
window.addEventListener('load', () => {
  // Add initial animations
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 100);
  }
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (hero) {
    const scrolled = window.pageYOffset;
    const parallax = scrolled * 0.5;
    hero.style.transform = `translateY(${parallax}px)`;
  }
});