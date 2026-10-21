import { db } from "./firebase-config.js";
import {
  collection, doc, getDoc, setDoc, updateDoc, getDocs, query, where, orderBy,
  onSnapshot, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const newOrderId = () => "QD" + Math.floor(100000 + Math.random() * 900000);

// ---------------- Orders (customer) ----------------
export async function createOrder(user, { service, price, description, name, contactEmail }) {
  for (let i = 0; i < 4; i++) {
    const orderId = newOrderId();
    try {
      // setDoc on an existing id is an *update*, which the rules deny for
      // customers - so an ID collision fails safely and we retry.
      await setDoc(doc(db, "orders", orderId), {
        orderId,
        userId: user.uid,
        userName: name,
        userEmail: (user.email || "").toLowerCase(),
        contactEmail: contactEmail.toLowerCase(),
        service,
        price,
        description,
        status: "pending",
        adminNote: "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return orderId;
    } catch (e) {
      if (e.code !== "permission-denied" || i === 3) throw e;
    }
  }
}

export async function getOrder(orderId) {
  const snap = await getDoc(doc(db, "orders", orderId));
  return snap.exists() ? snap.data() : null;
}

export async function getMyOrders(uid) {
  const snap = await getDocs(query(collection(db, "orders"), where("userId", "==", uid)));
  return snap.docs.map((d) => d.data()).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
}

// ---------------- Feedback ----------------
export const addFeedback = (user, { name, email, rating, category, message }) =>
  setDoc(doc(collection(db, "feedback")), {
    userId: user.uid, name, email: email.toLowerCase(), rating: Number(rating),
    category, message, createdAt: serverTimestamp(),
  });

// ---------------- Admin ----------------
export const watchAllOrders = (cb, onErr) =>
  onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc")),
    (s) => cb(s.docs.map((d) => d.data())), onErr);

export const setOrderStatus = (orderId, status, adminNote = "") =>
  updateDoc(doc(db, "orders", orderId), { status, adminNote, updatedAt: serverTimestamp() });

export const watchFeedback = (cb, onErr) =>
  onSnapshot(query(collection(db, "feedback"), orderBy("createdAt", "desc")),
    (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data() }))), onErr);

export const watchUsers = (cb, onErr) =>
  onSnapshot(collection(db, "users"), (s) => cb(s.docs.map((d) => d.data())), onErr);
