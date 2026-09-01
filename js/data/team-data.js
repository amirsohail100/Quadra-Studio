/* ==========================================================
   QUADRA TEAM & AI AGENTS DYNAMIC RENDER ENGINE
   ========================================================== */

// 1. Team Members Data
const teamMembers = [
  {
    name: "Amir Sohail",
    isCore: true,
    badge: "Lead AI & Full-Stack Dev | UI/UX & System Architect",
    avatar: "assets/avatars/profile-avatar_1.png",
    bio: "The sole technical and design architect behind Quadra. I handle complete end-to-end development — from UI/UX wireframing and design systems to building Agentic AI, Generative AI applications, fine-tuning LLMs, Vector DB architectures, MLOps, and scalable full-stack web platforms.",
    skills: [
      {
        title: "Languages & Core:",
        tags: ["Python", "C", "C++", "C#", "JavaScript", "HTML5", "CSS3", "PowerShell", "GDScript"]
      },
      {
        title: "AI, ML & Data Science:",
        tags: ["TensorFlow", "PyTorch", "Scikit-Learn", "Keras", "AI Agents", "LangChain / LangGraph", "MLflow", "NumPy", "Pandas", "Plotly", "Matplotlib"]
      },
      {
        title: "Backend, Cloud & MLOps:",
        tags: ["FastAPI", "Flask", "Node.js", ".NET", "Docker", "Kubernetes", "AWS", "Google Cloud", "GitLab CI", "Git / GitHub", "MySQL", "MongoDB"]
      },
      {
        title: "UI/UX, Analytics & Engines:",
        tags: ["UI/UX Design", "Streamlit", "Power BI", "Unity", "Godot"]
      }
    ],
    socials: [
      { label: "GitHub", icon: "fab fa-github", url: "https://github.com/amirsohail100", class: "github" },
      { label: "Hugging Face", icon: "fas fa-robot", url: "https://huggingface.co/amirsoahil101", class: "huggingface" },
      { label: "Kaggle", icon: "fab fa-kaggle", url: "https://www.kaggle.com/amirsohail122", class: "kaggle" },
      { label: "Discord", icon: "fab fa-discord", url: "https://discord.gg/fgDx4yb6E", class: "discord" },
      { label: "Instagram", icon: "fab fa-instagram", url: "https://www.instagram.com/_amir_sohail100_", class: "instagram" }
    ]
  }
];

// 2. AI Tools & Autonomous Agents Data
const aiAgentsData = [
  {
    name: "LangGraph Multi-Agent Workflows",
    badge: "Stateful Agent Orchestration",
    icon: "fas fa-network-wired",
    bio: "Cyclic and multi-agent workflow engines capable of autonomous task execution, tool calling, human-in-the-loop controls, and robust state machine management.",
    skills: [
      {
        title: "Capabilities & Specs:",
        tags: ["Multi-Agent Graph", "State Persistence", "Custom Tool Binding", "Human Approval Loop"]
      },
      {
        title: "Tech Tech Stack:",
        tags: ["LangChain", "LangGraph", "Python", "FastAPI", "Pydantic"]
      }
    ]
  },
  {
    name: "Enterprise RAG Systems",
    badge: "Retrieval Augmented Generation",
    icon: "fas fa-database",
    bio: "Advanced RAG pipelines connecting Large Language Models directly to proprietary documents, vector embeddings, and real-time knowledge bases.",
    skills: [
      {
        title: "Capabilities & Specs:",
        tags: ["Semantic Search", "Hybrid Search", "Vector Chunking", "Re-ranking Engine"]
      },
      {
        title: "Tech Stack:",
        tags: ["ChromaDB", "FAISS", "Pinecone", "LlamaIndex", "OpenAI / Mistral"]
      }
    ]
  },
  {
    name: "Autonomous Web & Task Agents",
    badge: "Scraping & Automation Agents",
    icon: "fas fa-robot",
    bio: "AI Agents designed to perform web automation, dynamic browser interaction, API consumption, and automated workflow triggers.",
    skills: [
      {
        title: "Capabilities & Specs:",
        tags: ["Dynamic Web Automation", "Self-Debugging", "Automated Extraction", "Scheduled Workflows"]
      },
      {
        title: "Tech Stack:",
        tags: ["Playwright", "Selenium", "AutoGPT", "Python Subprocess"]
      }
    ]
  }
];

// 3. Render Functions (Applies Left/Right Sequence Automatically)
function renderTeamTimeline() {
  const container = document.getElementById('team-timeline');
  if (!container) return;

  container.innerHTML = teamMembers.map((m, index) => {
    const alignClass = (index % 2 === 0) ? 'left' : 'right';
    return `
      <div class="team-member-row ${alignClass}" tabindex="0">
        <div class="member-image-box">
          <div class="avatar-wrapper">
            <img src="${m.avatar}" alt="${m.name}" class="member-avatar">
          </div>
          <div class="role-badge ${m.isCore ? 'core-badge' : ''}">${m.badge}</div>
        </div>
        <div class="member-content">
          <h3 class="member-name">${m.name} ${m.isCore ? '<span class="core-tag">(Core Specialist)</span>' : ''}</h3>
          <p class="member-bio">${m.bio}</p>

          ${m.skills.map(s => `
            <div class="skill-category">
              <strong>${s.title}</strong>
              <div class="tech-tags">
                ${s.tags.map(t => `<span class="tag">${t}</span>`).join('')}
              </div>
            </div>
          `).join('')}
          
          <div class="member-social-buttons">
            ${m.socials.map(soc => `
              <a href="${soc.url}" target="_blank" rel="noopener noreferrer" class="social-btn ${soc.class}">
                <i class="${soc.icon}"></i> ${soc.label}
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderAgentsTimeline() {
  const container = document.getElementById('agents-timeline');
  if (!container) return;

  container.innerHTML = aiAgentsData.map((a, index) => {
    const alignClass = (index % 2 === 0) ? 'left' : 'right';
    return `
      <div class="team-member-row ${alignClass}" tabindex="0">
        <div class="member-image-box">
          <div class="avatar-wrapper" style="display:flex; align-items:center; justify-content:center; background: var(--bg-card); font-size: 3.5rem; color: var(--accent);">
            <i class="${a.icon}"></i>
          </div>
          <div class="role-badge core-badge">${a.badge}</div>
        </div>
        <div class="member-content">
          <h3 class="member-name">${a.name}</h3>
          <p class="member-bio">${a.bio}</p>

          ${a.skills.map(s => `
            <div class="skill-category">
              <strong>${s.title}</strong>
              <div class="tech-tags">
                ${s.tags.map(t => `<span class="tag">${t}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

// Initial Execution on Load
document.addEventListener('DOMContentLoaded', () => {
  renderTeamTimeline();
  renderAgentsTimeline();
});