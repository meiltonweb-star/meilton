import admin from 'firebase-admin';

// Initialize Firebase Admin (make sure we don't double-initialize)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();

async function checkProducts() {
  try {
    const productsRef = db.collection('products');
    const snapshot = await productsRef.where('isClosed', '==', false).get();
    
    if (snapshot.empty) {
      console.log('No active products found.');
      return;
    }  

    console.log(`Found ${snapshot.size} active products.`);
    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data().name);
    });
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

checkProducts();
