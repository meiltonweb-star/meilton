import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore/lite';

export async function GET() {
  try {
    const q = query(collection(db, 'products'), where('isClosed', '==', false));
    const snap = await getDocs(q);
    const products = [];
    snap.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return NextResponse.json(products, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error("Error in products API route:", error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
