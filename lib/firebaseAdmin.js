import admin from 'firebase-admin';

let adminDb = null;
let adminStorage = null;
let adminAuth = null;

const hasAdminCreds = 
  process.env.FIREBASE_PROJECT_ID && 
  process.env.FIREBASE_CLIENT_EMAIL && 
  process.env.FIREBASE_PRIVATE_KEY;

if (hasAdminCreds) {
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } catch (error) {
      console.error('Firebase admin initialization error', error.stack);
    }
  }
  
  if (admin.apps.length) {
    adminDb = admin.firestore();
    adminStorage = admin.storage();
    adminAuth = admin.auth();
  }
} else {
  console.warn('Firebase admin credentials missing in environment. Server-side admin functions will fail gracefully.');
}

export { adminDb, adminStorage, adminAuth };
