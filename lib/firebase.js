import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyByGnLFvzEZPjnmohyQEa76HOHMwEH2WGg",
  authDomain: "meilton-website.firebaseapp.com",
  projectId: "meilton-website",
  storageBucket: "meilton-website.firebasestorage.app",
  messagingSenderId: "491783902695",
  appId: "1:491783902695:web:ec7dda66623cb84f059942",
  measurementId: "G-HM2XG058HQ"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export default app;
