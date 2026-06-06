import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore/lite';

export async function POST(request) {
  try {
    const data = await request.json();
    const { fullName, mobile, address, city, state, pincode, productId } = data;

    // Generate Order ID
    const orderId = 'ORD' + Math.floor(100000 + Math.random() * 900000);
    const date = new Date().toISOString();
    const status = 'New';
    
    // Hardcoded product details for demo purposes based on productId
    const productName = 'Meilton Chronograph Watch';
    const quantity = 1;

    // Save to Firestore using the client/Edge compatible SDK
    const orderDoc = {
      orderId,
      createdAt: date,
      customer: { fullName, mobile, address, city, state, pincode },
      product: { id: productId, name: productName, quantity },
      status,
      paymentMethod: 'COD'
    };

    try {
      await setDoc(doc(db, 'orders', orderId), orderDoc);
    } catch (dbError) {
      console.error("Firebase db write failed:", dbError);
    }

    return NextResponse.json({ success: true, orderId }, { status: 200 });
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 });
  }
}
