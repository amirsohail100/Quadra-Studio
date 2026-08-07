// --- Ambient Background Canvas Engine ---
const bgCanvas = document.getElementById("bg-canvas");
const bgCtx = bgCanvas.getContext("2d");
let bgWidth, bgHeight;
let bgParticles = [];

function resizeBgCanvas() {
  bgWidth = bgCanvas.width = window.innerWidth;
  bgHeight = bgCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeBgCanvas);
resizeBgCanvas();

class AmbientBubble {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * bgWidth;
    this.y = Math.random() * bgHeight + bgHeight;
    this.radius = Math.random() * 18 + 6;
    this.speedY = Math.random() * 0.8 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.4 + 0.1;
    this.pulse = Math.random() * 0.02;
    this.maxAlpha = Math.random() * 0.5 + 0.2;
  }
  update() {
    this.y -= this.speedY;
    this.x += this.speedX;
    this.alpha += this.pulse;
    if (this.alpha > this.maxAlpha || this.alpha < 0.1) this.pulse = -this.pulse;
    if (this.y < -50 || this.x < -20 || this.x > bgWidth + 20) {
      this.reset();
      this.y = bgHeight + 20;
    }
  }
  draw() {
    const isDark = document.body.classList.contains("dark-theme");
    bgCtx.save();
    bgCtx.beginPath();
    bgCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    const grad = bgCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);

    if (isDark) {
      grad.addColorStop(0, `rgba(56, 189, 248, ${this.alpha * 1.2})`);
      grad.addColorStop(0.6, `rgba(14, 165, 233, ${this.alpha * 0.4})`);
      grad.addColorStop(1, `rgba(2, 132, 199, 0)`);
    } else {
      grad.addColorStop(0, `rgba(2, 132, 199, ${this.alpha * 0.8})`);
      grad.addColorStop(0.6, `rgba(56, 189, 248, ${this.alpha * 0.3})`);
      grad.addColorStop(1, `rgba(186, 230, 253, 0)`);
    }
    bgCtx.fillStyle = grad;
    bgCtx.fill();
    bgCtx.restore();
  }
}

for (let i = 0; i < 45; i++) {
  const p = new AmbientBubble();
  p.y = Math.random() * bgHeight;
  bgParticles.push(p);
}

function renderBg() {
  bgCtx.clearRect(0, 0, bgWidth, bgHeight);
  bgParticles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(renderBg);
}
renderBg();

// --- Click Burst Particle System Canvas ---
const pCanvas = document.getElementById("particle-canvas");
const pCtx = pCanvas.getContext("2d");
let pWidth, pHeight;
let activeParticles = [];

function resizePCanvas() {
  pWidth = pCanvas.width = window.innerWidth;
  pHeight = pCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizePCanvas);
resizePCanvas();

class ClickParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 6 + 3;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 7 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = Math.random() * 0.03 + 0.015;
    
    const isDark = document.body.classList.contains("dark-theme");
    const colors = isDark 
      ? ["#38bdf8", "#818cf8", "#f43f5e", "#fde047", "#34d399"]
      : ["#0284c7", "#4f46e5", "#e11d48", "#d97706", "#059669"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.isRing = Math.random() > 0.6;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.15;
    this.alpha -= this.decay;
  }

  draw() {
    pCtx.save();
    pCtx.globalAlpha = Math.max(0, this.alpha);
    pCtx.beginPath();
    pCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    if (this.isRing) {
      pCtx.strokeStyle = this.color;
      pCtx.lineWidth = 2;
      pCtx.stroke();
    } else {
      pCtx.fillStyle = this.color;
      pCtx.fill();
    }
    pCtx.restore();
  }
}

function triggerParticleBurst(x, y, count = 25) {
  for (let i = 0; i < count; i++) {
    activeParticles.push(new ClickParticle(x, y));
  }
}

function renderClickParticles() {
  pCtx.clearRect(0, 0, pWidth, pHeight);
  for (let i = activeParticles.length - 1; i >= 0; i--) {
    const p = activeParticles[i];
    p.update();
    p.draw();
    if (p.alpha <= 0) {
      activeParticles.splice(i, 1);
    }
  }
  requestAnimationFrame(renderClickParticles);
}
renderClickParticles();

document.querySelectorAll(".particle-trigger").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX || (rect.left + rect.width / 2);
    const y = e.clientY || (rect.top + rect.height / 2);
    triggerParticleBurst(x, y, 30);
  });
});

// --- Like / Dislike Logic with Re-triggerable Animation ---
const likeBtn = document.getElementById("like-btn");
const dislikeBtn = document.getElementById("dislike-btn");
const likeCountSpan = document.getElementById("like-count");

let isLiked = false;
let isDisliked = false;
let currentLikes = 128;

if (likeBtn && dislikeBtn) {
  likeBtn.addEventListener("click", () => {
    if (!isLiked) {
      isLiked = true;
      currentLikes++;
      likeBtn.classList.add("liked");
      if (isDisliked) {
        isDisliked = false;
        dislikeBtn.classList.remove("disliked");
      }
    } else {
      isLiked = false;
      currentLikes--;
      likeBtn.classList.remove("liked");
    }
    likeCountSpan.innerText = currentLikes;
  });

  dislikeBtn.addEventListener("click", () => {
    dislikeBtn.classList.remove("disliked");
    void dislikeBtn.offsetWidth; // Trigger reflow for re-animation
    
    if (!isDisliked) {
      isDisliked = true;
      dislikeBtn.classList.add("disliked");
      if (isLiked) {
        isLiked = false;
        currentLikes--;
        likeBtn.classList.remove("liked");
        likeCountSpan.innerText = currentLikes;
      }
    } else {
      isDisliked = false;
    }
  });
}

// --- Mouse Movement Radial Glow Listener ---
window.addEventListener("mousemove", (e) => {
  document.documentElement.style.setProperty("--mouse-x", `${e.pageX}px`);
  document.documentElement.style.setProperty("--mouse-y", `${e.pageY}px`);
});

// --- Theme Switcher ---
const themeToggleBtn = document.getElementById("theme-toggle");
if(themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    document.body.classList.toggle("light-theme");
  });
}

// --- Scroll Reveal ---
const revealElements = document.querySelectorAll(".reveal-on-scroll");
const revealOnScroll = () => {
  revealElements.forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
};
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// --- Counters Animation ---
const counters = document.querySelectorAll('.counter');
let counted = false;

const startCounters = () => {
  const statsSection = document.getElementById('about');
  if (!statsSection) return;
  if (statsSection.getBoundingClientRect().top < window.innerHeight && !counted) {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      let count = 0;
      const speed = target / 30;

      const updateCount = () => {
        count += speed;
        if (count < target) {
          counter.innerText = Math.ceil(count);
          setTimeout(updateCount, 40);
        } else {
          counter.innerText = target + (target === 100 ? '%' : '+');
        }
      };
      updateCount();
    });
    counted = true;
  }
};
window.addEventListener('scroll', startCounters);

// --- Contact Form Handling ---
const contactForm = document.getElementById("contact-form");
if(contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Message sent successfully!");
    e.target.reset();
  });
}