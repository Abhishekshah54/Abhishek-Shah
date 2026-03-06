// Loader animation removal after initial page load
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.classList.add("hidden");
  }, 500);
});

// Footer year setup
document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle with localStorage persistence
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

function applyTheme(theme) {
  const icon = themeToggle.querySelector("i");
  if (theme === "light") {
    body.classList.add("light-theme");
    icon.className = "fa-solid fa-sun";
  } else {
    body.classList.remove("light-theme");
    icon.className = "fa-solid fa-moon";
  }
}

const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const isLight = body.classList.toggle("light-theme");
  const nextTheme = isLight ? "light" : "dark";
  localStorage.setItem("portfolio-theme", nextTheme);
  applyTheme(nextTheme);
});

// Mobile navigation toggle
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

// Typing effect for hero subtitle
const typingElement = document.getElementById("typingText");
const typingPhrases = [
  "Aspiring Full Stack Engineer",
  "Python Developer",
  "Web & Mobile App Developer",
  "AI Enthusiast",
  "Data Analyst"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  const currentPhrase = typingPhrases[phraseIndex];
  const visibleText = currentPhrase.substring(0, charIndex);
  typingElement.textContent = visibleText;

  if (!isDeleting && charIndex < currentPhrase.length) {
    charIndex += 1;
    setTimeout(typeLoop, 90);
    return;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    setTimeout(typeLoop, 1200);
    return;
  }

  if (isDeleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeLoop, 45);
    return;
  }

  isDeleting = false;
  phraseIndex = (phraseIndex + 1) % typingPhrases.length;
  setTimeout(typeLoop, 250);
}

typeLoop();

// Scroll reveal animation observer
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealElements.forEach((element) => revealObserver.observe(element));

// Active navigation link by visible section
const sections = document.querySelectorAll("main section[id]");
const navAnchors = document.querySelectorAll(".nav-links a");
const backToTopButton = document.getElementById("backToTop");

let scrollTicking = false;

function updateOnScroll() {
  let currentSectionId = "home";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    if (window.scrollY >= sectionTop) {
      currentSectionId = section.id;
    }
  });

  navAnchors.forEach((anchor) => {
    const isActive = anchor.getAttribute("href") === `#${currentSectionId}`;
    anchor.classList.toggle("active", isActive);
  });

  if (backToTopButton) {
    backToTopButton.classList.toggle("show", window.scrollY > 300);
  }

  scrollTicking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      requestAnimationFrame(updateOnScroll);
      scrollTicking = true;
    }
  },
  { passive: true }
);

// Ensure nav highlight and back-to-top state are correct on load.
updateOnScroll();

backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Contact form frontend behavior
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "Message sent successfully! I will get back to you soon.";
    contactForm.reset();

    setTimeout(() => {
      formStatus.textContent = "";
    }, 3500);
  });
}

// Particle animation background using canvas
const particleCanvas = document.getElementById("particle-canvas");
const context = particleCanvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}

function createParticles() {
  const particleCount = Math.max(40, Math.floor(window.innerWidth / 24));
  particles = [];

  for (let index = 0; index < particleCount; index += 1) {
    particles.push({
      x: Math.random() * particleCanvas.width,
      y: Math.random() * particleCanvas.height,
      radius: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.55,
      speedY: (Math.random() - 0.5) * 0.55
    });
  }
}

function getParticleColor() {
  return body.classList.contains("light-theme") ? "rgba(80, 102, 180, 0.45)" : "rgba(130, 165, 255, 0.5)";
}

function animateParticles() {
  context.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  const color = getParticleColor();

  particles.forEach((particle, particleIndex) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < 0 || particle.x > particleCanvas.width) particle.speedX *= -1;
    if (particle.y < 0 || particle.y > particleCanvas.height) particle.speedY *= -1;

    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fillStyle = color;
    context.fill();

    for (let linkIndex = particleIndex + 1; linkIndex < particles.length; linkIndex += 1) {
      const linkedParticle = particles[linkIndex];
      const deltaX = particle.x - linkedParticle.x;
      const deltaY = particle.y - linkedParticle.y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance < 95) {
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(linkedParticle.x, linkedParticle.y);
        context.strokeStyle = body.classList.contains("light-theme")
          ? "rgba(110, 130, 200, 0.14)"
          : "rgba(127, 177, 255, 0.13)";
        context.stroke();
      }
    }
  });

  requestAnimationFrame(animateParticles);
}

resizeCanvas();
createParticles();
animateParticles();

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});