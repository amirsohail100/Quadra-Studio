// Dynamic Team Data
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

// --- Interactive Mouse Cursor Glow Effect ---
const glow = document.getElementById("cursor-glow");

window.addEventListener("mousemove", (e) => {
  const x = e.clientX + "px";
  const y = e.clientY + "px";
  
  document.documentElement.style.setProperty("--mouse-x", x);
  document.documentElement.style.setProperty("--mouse-y", y);
});

// --- Dark / Light Theme Toggle ---
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = themeToggleBtn.querySelector(".theme-icon");
const body = document.body;

themeToggleBtn.addEventListener("click", () => {
  if (body.classList.contains("dark-theme")) {
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
    themeIcon.innerText = "☀️";
  } else {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
    themeIcon.innerText = "🌙";
  }
});

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

// --- Form Submission Mock ---
document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Thank you! Your message has been received. We will get back to you shortly.");
  e.target.reset();
});