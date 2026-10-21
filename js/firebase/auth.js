import { auth, db } from "./firebase-config.js";
import {
  onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, signOut, updateProfile, sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const watchAuth = (cb) => onAuthStateChanged(auth, cb);

// Create / refresh the users/{uid} profile document.
async function saveProfile(user, extraName = "") {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  const data = {
    uid: user.uid,
    name: user.displayName || extraName || "",
    email: (user.email || "").toLowerCase(),
    photoURL: user.photoURL || "",
    provider: user.providerData[0]?.providerId || "password",
    lastLoginAt: serverTimestamp(),
  };
  if (!snap.exists()) data.createdAt = serverTimestamp();
  await setDoc(ref, data, { merge: true });
}

export async function signUpEmail(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: name });
  await saveProfile(cred.user, name);
  return cred.user;
}

export async function loginEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  await saveProfile(cred.user);
  return cred.user;
}

export async function loginGoogle() {
  const cred = await signInWithPopup(auth, new GoogleAuthProvider());
  await saveProfile(cred.user);
  return cred.user;
}

export const resetPassword = (email) => sendPasswordResetEmail(auth, email);
export const logout = () => signOut(auth);

// Admins are listed in Firestore: admins/{uid}. Only you can create those
// documents (from the Firebase console) - see README.
export async function isAdmin(uid) {
  try { return (await getDoc(doc(db, "admins", uid))).exists(); } catch { return false; }
}

export function friendlyError(err) {
  const map = {
    "auth/invalid-credential": "Wrong email or password.",
    "auth/wrong-password": "Wrong email or password.",
    "auth/user-not-found": "No account found with this email.",
    "auth/email-already-in-use": "This email is already registered. Please sign in.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/popup-blocked": "Popup blocked - please allow popups and try again.",
    "auth/unauthorized-domain": "This domain is not authorised in Firebase (Authentication > Settings > Authorized domains). Use http://localhost:8000.",
    "auth/operation-not-allowed": "This sign-in method is not enabled in the Firebase console.",
    "auth/network-request-failed": "Network error. Check your internet connection.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "permission-denied": "Permission denied by Firestore rules.",
  };
  return map[err?.code] || err?.message || "Something went wrong.";
}
