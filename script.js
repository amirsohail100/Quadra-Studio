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

// --- Mouse Glow Effect ---
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