import admin from "firebase-admin";
import { initializeApp as initializeAdminApp } from "firebase-admin/app";
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signOut,
} from "firebase/auth";

require("dotenv").config();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "cure8-96958.firebaseapp.com",
  databaseURL: "https://cure8-96958.firebaseio.com",
  projectId: process.env["FIREBASE_PROJECT_ID"],
  storageBucket: "cure8-96958.appspot.com",
  messagingSenderId: "1084625517255",
  appId: "1:1084625517255:web:2819d17c53f72eaaa69ce2",
  measurementId: "G-Q6JR7DCTW0",
};

if (!admin.apps.length) {
  initializeAdminApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    databaseURL: "https://cure8-96958.firebaseio.com",
  });
}

const db = admin.firestore();
const adminAuth = admin.auth();

let Firebase: any;

if (!Firebase?.apps?.length) {
  Firebase = initializeApp(firebaseConfig);
}

async function signIn(email: string, password: string) {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, password);
}

async function signUp(email: string, password: string) {
  const auth = getAuth();
  return createUserWithEmailAndPassword(auth, email, password);
}

async function getSessionToken(idToken: string) {
  const decodedToken = await adminAuth.verifyIdToken(idToken);
  if (new Date().getTime() / 1000 - decodedToken.auth_time > 5 * 60) {
    throw new Error("Recent sign in required");
  }
  const twoWeeks = 60 * 60 * 24 * 14 * 1000;
  return adminAuth.createSessionCookie(idToken, { expiresIn: twoWeeks });
}

async function signOutFirebase() {
  await signOut(getAuth());
}

export { db, signUp, getSessionToken, signOutFirebase, signIn, adminAuth };
