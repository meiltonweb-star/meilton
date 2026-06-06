import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { appendOrderToSheet } from '@/lib/googleSheets';

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

    // 1. Save to Firestore
    const orderDoc = {
      orderId,
      createdAt: date,
      customer: { fullName, mobile, address, city, state, pincode },
      product: { id: productId, name: productName, quantity },
      status,
      paymentMethod: 'COD'
    };

    if (adminDb) {
      try {
        await adminDb.collection('orders').doc(orderId).set(orderDoc);
      } catch (dbError) {
        console.error("Firebase admin init might fail without credentials in demo:", dbError);
      }
    }

    // 2. Save to Google Sheets
    // OrderData: [OrderID, Date, ProductName, Quantity, CustomerName, Phone, Address, City, State, Pincode, Status]
    const sheetData = [
      orderId, 
      date, 
      productName, 
      quantity, 
      fullName, 
      mobile, 
      address, 
      city, 
      state, 
      pincode, 
      status
    ];

    try {
      await appendOrderToSheet(sheetData);
    } catch (sheetError) {
      console.error("Failed to append to Google Sheets, but order processed:", sheetError);
    }

    return NextResponse.json({ success: true, orderId }, { status: 200 });
  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 });
  }
}
