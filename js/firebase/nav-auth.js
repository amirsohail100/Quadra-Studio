// Loaded on every page: adds Login / Account / Admin links to the navbar
// and shows a setup banner until firebase-config.js is filled in.
import { isConfigured } from "./firebase-config.js";
import { watchAuth, isAdmin } from "./auth.js";

const links = document.getElementById("nav-links");
let item = null;
if (links) {
  item = document.createElement("li");
  item.id = "auth-nav-item";
  const joinLi = [...links.children].reverse().find((li) => li.querySelector(".btn-nav"));
  links.insertBefore(item, joinLi || null);
}

function render(html) { if (item) item.innerHTML = html; }

if (!isConfigured) {
  render('<a href="/pages/login.html" class="nav-item">Login</a>');
  const b = document.createElement("div");
  b.className = "fb-banner";
  b.textContent = "Firebase is not configured yet - open js/firebase/firebase-config.js and paste your web app config.";
  document.body.prepend(b);
} else {
  watchAuth(async (user) => {
    if (!user) return render('<a href="/pages/login.html" class="nav-item">Login</a>');
    const admin = await isAdmin(user.uid);
    render(
      '<a href="/pages/account.html" class="nav-item">My Account</a>' +
      (admin ? ' <a href="/pages/admin.html" class="nav-item">Admin</a>' : "")
    );
  });
}
