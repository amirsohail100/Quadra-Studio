/* ==========================================================
   QUADRA PRICING DATA SCHEMA & DYNAMIC RENDER ENGINE
   ========================================================== */

const pricingData = [
  {
    title: "Machine Learning",
    description: "Custom predictive models, regression, classification, and data analysis pipelines.",
    price: "$150",
    serviceTag: "Machine Learning Pipeline"
  },
  {
    title: "Deep Learning",
    description: "Neural networks, Computer Vision (YOLO, OpenCV), and NLP models.",
    price: "$200",
    serviceTag: "Deep Learning Architecture"
  },
  {
    title: "Gen AI Applications",
    description: "Autonomous LLM Agents (LangChain/LangGraph) tailored to your workflow.",
    price: "$300",
    serviceTag: "Generative AI Agent"
  },
  {
    title: "RAG Applications",
    description: "Retrieval-Augmented Generation systems connecting LLMs to your custom private data.",
    price: "$400",
    serviceTag: "RAG Application"
  },
  {
    title: "AI Agents",
    description: "Retrieval-Augmented Generation systems connecting LLMs to your custom private data.",
    price: "$500",
    serviceTag: "AI Agents"
  },
  {
    title: "Static Sites",
    description: "Retrieval-Augmented Generation systems connecting LLMs to your custom private data.",
    price: "$50",
    serviceTag: "Static Sites"
  },
  {
    title: "Wed Service",
    description: "Retrieval-Augmented Generation systems connecting LLMs to your custom private data.",
    price: "$100",
    serviceTag: "Wed Service"
  },
  {
    title: "Games",
    description: "Retrieval-Augmented Generation systems connecting LLMs to your custom private data.",
    price: "$600",
    serviceTag: "Games"
  }
];

// Render pricing cards into the container
function renderPricingCards() {
  const container = document.getElementById('pricing-grid');
  if (!container) return;

  const html = pricingData.map(item => `
    <div class="service-card hover-lift pricing-card">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <div class="price-tag">Starting at <span>${item.price}</span></div>
      <button class="btn btn-primary particle-trigger glow-btn open-modal-btn" data-service="${item.serviceTag}">Order Now</button>
    </div>
  `).join('');

  container.innerHTML = html;
}

// Render pricing cards on DOM Load
document.addEventListener("DOMContentLoaded", renderPricingCards);