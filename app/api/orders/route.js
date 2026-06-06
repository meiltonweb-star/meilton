import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
// import { appendOrderToSheet } from '@/lib/googleSheets'; // Disabled for Cloudflare Pages compatibility

export async function POST(request) {
  try {
    const data = await request.json();
    const { fullName, mobile, address, city, state, pincode, productId } = data;

    // Generate Order ID
    const orderId = 'ORD' + Math.floor(100000 + Math.random() * 900000);
    const date = new Date().toISOString();
    const status = 'New';
    
    // Hardcoded product details for demo purposes based on productId
    // In production, fetch this from Firestore
    const productName = 'Meilton Chronograph Watch';
    const quantity = 1;

    // 1. Save to Firestore (Using Client SDK which works on Cloudflare Edge)
    const orderDoc = {
      orderId,
      createdAt: date,
      customer: { fullName, mobile, address, city, state, pincode },
      product: { id: productId, name: productName, quantity },
      status,
      paymentMethod: 'COD'
    };

    if (db) {
      try {
        await setDoc(doc(db, 'orders', orderId), orderDoc);
      } catch (dbError) {
        console.error("Firebase db init might fail without credentials in demo:", dbError);
      }
    }

    // 2. Save to Google Sheets (Disabled for Edge runtime compatibility)
    /*
    const sheetData = [
      orderId, date, productName, quantity, fullName, mobile, address, city, state, pincode, status
    ];

    try {
      // await appendOrderToSheet(sheetData);
    } catch (sheetError) {
      console.error("Failed to append to Google Sheets:", sheetError);
    }
    */

    return NextResponse.json({ success: true, orderId }, { status: 200 });
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 });
  }
}
