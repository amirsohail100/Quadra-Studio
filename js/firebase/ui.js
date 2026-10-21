// Small shared UI helpers (XSS-safe escaping, toast, labels).
export const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export const fmtDate = (ts) => (ts && ts.toDate ? ts.toDate().toLocaleString() : "—");

export const STATUS = {
  pending: { label: "Pending Review", cls: "pending" },
  in_progress: { label: "In Progress", cls: "progress" },
  completed: { label: "Completed", cls: "done" },
  cancelled: { label: "Cancelled", cls: "cancel" },
};

// Only allow same-site redirects after login.
export const safeRedirect = (r, fallback = "/pages/account.html") =>
  r && r.startsWith("/") && !r.startsWith("//") ? r : fallback;

export function toast(message, type = "info") {
  let box = document.getElementById("fb-toasts");
  if (!box) {
    box = document.createElement("div");
    box.id = "fb-toasts";
    document.body.appendChild(box);
  }
  const t = document.createElement("div");
  t.className = `fb-toast ${type}`;
  t.textContent = message;
  box.appendChild(t);
  setTimeout(() => t.remove(), 5000);
}
