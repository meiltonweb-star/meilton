"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      try {
        const q = query(collection(db, 'products'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setProduct({ id: doc.id, ...doc.data() });
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
    return <div className="min-h-[70vh] bg-[#f8f5f2] flex flex-col items-center justify-center text-gray-500">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-[#f8f5f2] flex flex-col items-center justify-center text-[#4a2c2a] px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md">The product you are looking for does not exist, has been removed, or is no longer available.</p>
        <Link href="/category/all" className="bg-[#c96b3c] hover:bg-[#b45d33] text-white px-8 py-4 rounded-md uppercase tracking-widest text-sm font-semibold transition-colors shadow-md">
          Browse All Products
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.isClosed || product.stock <= 0;

  return (
    <div className="bg-white min-h-screen pt-24 pb-24 text-[#4a2c2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex space-x-2 text-sm text-gray-500 mb-8 fade-in-up">
          <Link href="/" className="hover:text-[#c96b3c]">Home</Link>
          <span>/</span>
          <Link href="/category/all" className="hover:text-[#c96b3c]">Products</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Images */}
          <div className="space-y-4 animate-float">
            <div className="relative h-[600px] w-full bg-gray-100 rounded-xl overflow-hidden premium-shadow">
              {product.image ? (
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">No Image Available</div>
              )}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-10">
                  <div className="bg-white/90 text-red-600 px-8 py-4 rounded-lg text-2xl font-black uppercase tracking-widest shadow-2xl transform -rotate-12 border-4 border-red-600">
                    Out of Stock
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col fade-in-up">
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="inline-block bg-[#4a2c2a] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                Cash on Delivery
              </div>
              {product.isSevenDayPolicy && (
                <div className="inline-block bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  7-Day Return
                </div>
              )}
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center space-x-4 mb-8">
              <span className="text-[#c96b3c] font-bold text-4xl">₹{product.offerPrice}</span>
              {product.originalPrice > 0 && (
                <span className="text-gray-400 line-through text-xl">₹{product.originalPrice}</span>
              )}
            </div>

            <div className="prose prose-sm sm:prose lg:prose-lg text-gray-600 mb-10">
              <p>{product.description}</p>
              
              <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="font-bold text-[#4a2c2a] mb-2 uppercase text-xs tracking-widest">Delivery Info</h4>
                <ul className="space-y-2 text-sm text-gray-600 m-0 p-0 list-none">
                  <li className="flex items-center">
                    <span className="mr-2">🚚</span> 
                    {product.isFreeShipping ? 'Free Standard Shipping' : `Shipping Cost: ₹${product.shippingCost}`}
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">📦</span>
                    {product.stock > 0 ? <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span> : <span className="text-red-600 font-medium">Currently Unavailable</span>}
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-auto">
              {isOutOfStock ? (
                <button 
                  disabled
                  className="w-full text-center bg-gray-300 text-gray-500 font-bold py-5 rounded-md uppercase tracking-widest cursor-not-allowed border border-gray-400"
                >
                  Currently Unavailable
                </button>
              ) : (
                <Link 
                  href={`/checkout?product=${product.id}`}
                  className="block w-full text-center bg-[#c96b3c] hover:bg-[#b45d33] text-white font-bold py-5 rounded-md transition-all duration-300 uppercase tracking-widest shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  Order Now - Pay on Delivery
                </Link>
              )}
              
              <div className="mt-8 flex items-center justify-center space-x-6 text-gray-500 text-sm">
                <div className="flex items-center"><span className="mr-2">🛡️</span> 100% Authentic</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
