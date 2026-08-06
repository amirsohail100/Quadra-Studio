// Team Member Data
const teamDetails = {
  "1": {
    name: "You (Lead Dev)",
    role: "Full-Stack Architect",
    bio: "Passionate about building scalable web solutions, orchestrating multi-service architectures, and leading tech strategies for startups and businesses.",
    skills: ["JavaScript", "Python", "Node.js", "System Design", "Git"]
  },
  "2": {
    name: "Alex Rivera",
    role: "UI/UX Designer",
    bio: "Transforms complex ideas into visually compelling interfaces with a strong focus on user research, micro-interactions, and visual harmony.",
    skills: ["Figma", "Design Systems", "Prototyping", "User Research"]
  },
  "3": {
    name: "Jordan Lee",
    role: "Frontend Developer",
    bio: "Obsessed with pixel-perfection, smooth CSS animations, and building ultra-fast responsive client-side implementations.",
    skills: ["React", "CSS3 / Sass", "Tailwind", "JavaScript (ES6+)"]
  },
  "4": {
    name: "Morgan Smith",
    role: "Backend & DevOps",
    bio: "Focuses on high-availability server setups, robust REST/GraphQL APIs, and continuous deployment workflows.",
    skills: ["Docker", "PostgreSQL", "REST APIs", "AWS", "CI/CD"]
  }
};

// --- Interactive Background Canvas Animation Engine ---
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let width, height;
let particles = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class BubbleParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height + height;
    this.radius = Math.random() * 18 + 6; // Bubble size
    this.speedY = Math.random() * 0.8 + 0.3; // Upward floating speed
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.4 + 0.1;
    this.pulse = Math.random() * 0.02;
    this.maxAlpha = Math.random() * 0.5 + 0.2;
  }

  update() {
    this.y -= this.speedY;
    this.x += this.speedX;

    // Pulse bubble opacity
    this.alpha += this.pulse;
    if (this.alpha > this.maxAlpha || this.alpha < 0.1) {
      this.pulse = -this.pulse;
    }

    // Reset particle when floating out of view
    if (this.y < -50 || this.x < -20 || this.x > width + 20) {
      this.reset();
      this.y = height + 20;
    }
  }

  draw() {
    const isDark = document.body.classList.contains("dark-theme");
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    // Glowing Gradient Bubble
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius
    );

    if (isDark) {
      gradient.addColorStop(0, `rgba(56, 189, 248, ${this.alpha * 1.2})`);
      gradient.addColorStop(0.6, `rgba(14, 165, 233, ${this.alpha * 0.4})`);
      gradient.addColorStop(1, `rgba(2, 132, 199, 0)`);
    } else {
      gradient.addColorStop(0, `rgba(2, 132, 199, ${this.alpha * 0.8})`);
      gradient.addColorStop(0.6, `rgba(56, 189, 248, ${this.alpha * 0.3})`);
      gradient.addColorStop(1, `rgba(186, 230, 253, 0)`);
    }

    ctx.fillStyle = gradient;
    ctx.fill();

    // Subtle Outer Rim Ring
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = isDark 
      ? `rgba(248, 250, 252, ${this.alpha * 0.3})`
      : `rgba(2, 132, 199, ${this.alpha * 0.25})`;
    ctx.stroke();
    
    ctx.restore();
  }
}

// Create 50 floating bubble particles
for (let i = 0; i < 50; i++) {
  const p = new BubbleParticle();
  p.y = Math.random() * height; // Spread across screen initially
  particles.push(p);
}

function animateCanvas() {
  ctx.clearRect(0, 0, width, height);
  
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animateCanvas);
}

animateCanvas();

// --- Mouse Glow Effect Listener ---
window.addEventListener("mousemove", (e) => {
  document.documentElement.style.setProperty("--mouse-x", `${e.pageX}px`);
  document.documentElement.style.setProperty("--mouse-y", `${e.pageY}px`);
});

// --- Celestial Theme Switcher Logic ---
const themeToggleBtn = document.getElementById("theme-toggle");
const body = document.body;

themeToggleBtn.addEventListener("click", () => {
  if (body.classList.contains("dark-theme")) {
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
  } else {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
  }
});

// --- Scroll Reveal Animations ---
const revealElements = document.querySelectorAll(".reveal-on-scroll");

const revealOnScroll = () => {
  revealElements.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (elementTop < windowHeight - 100) {
      el.classList.add("active");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// --- Animated Stats Counters ---
const counters = document.querySelectorAll('.counter');
let counted = false;

const startCounters = () => {
  const statsSection = document.getElementById('about');
  if (!statsSection) return;
  
  const sectionPos = statsSection.getBoundingClientRect().top;
  const screenPos = window.innerHeight;

  if (sectionPos < screenPos && !counted) {
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

// --- Modal Functionality ---
const modal = document.getElementById("team-modal");
const closeBtn = document.querySelector(".close-btn");
const teamCards = document.querySelectorAll(".team-card");

teamCards.forEach(card => {
  card.addEventListener("click", () => {
    const memberId = card.getAttribute("data-member");
    const data = teamDetails[memberId];

    if (data) {
      document.getElementById("modal-name").innerText = data.name;
      document.getElementById("modal-role").innerText = data.role;
      document.getElementById("modal-bio").innerText = data.bio;

      const skillsContainer = document.getElementById("modal-skills");
      skillsContainer.innerHTML = "";
      data.skills.forEach(skill => {
        const tag = document.createElement("span");
        tag.className = "skill-tag";
        tag.innerText = skill;
        skillsContainer.appendChild(tag);
      });

      modal.style.display = "flex";
    }
  });
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

// --- Form Submission ---
document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Thank you! Your message has been received.");
  e.target.reset();
});