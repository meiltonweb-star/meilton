"use client";

import ProductCard from '@/components/ui/ProductCard';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug || 'all';
  const categoryName = slug === 'all' ? 'All Products' : slug.replace('-', ' ');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        let q;
        if (slug === 'all') {
          q = query(collection(db, 'products'), where('isClosed', '==', false));
        } else {
          // Attempt exact match on category name
          q = query(
            collection(db, 'products'),
            where('category', '==', categoryName),
            where('isClosed', '==', false)
          );
        }
        
        const querySnapshot = await getDocs(q);
        const fetchedProducts = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() });
        });
        
        // If exact match failed, try case-insensitive filter in memory
        if (slug !== 'all' && fetchedProducts.length === 0) {
          const allQ = query(collection(db, 'products'), where('isClosed', '==', false));
          const allSnap = await getDocs(allQ);
          const allProducts = [];
          allSnap.forEach((doc) => {
            allProducts.push({ id: doc.id, ...doc.data() });
          });
          const filtered = allProducts.filter(p => p.category?.toLowerCase() === categoryName.toLowerCase());
          setProducts(filtered);
        } else {
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, [slug, categoryName]);

  return (
    <div className="bg-[#f8f5f2] min-h-screen pt-24 pb-24 text-[#4a2c2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-4 capitalize">{categoryName}</h1>
          <div className="w-24 h-1 bg-[#c96b3c] mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our exclusive collection of {categoryName}. Elevate your style with our premium selection.
          </p>
        </div>

        {/* Filters/Sort Bar */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-300">
          <span className="text-gray-500 font-medium">{products.length} Products</span>
          <select className="bg-transparent border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#c96b3c]">
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest Arrivals</option>
          </select>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500 text-lg">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No Products Found</h3>
            <p className="text-gray-500">We currently have no active products in the "{categoryName}" category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        
        {/* Pagination placeholder */}
        <div className="mt-16 flex justify-center space-x-2">
          <button className="px-4 py-2 bg-[#4a2c2a] text-white rounded">1</button>
          <button className="px-4 py-2 bg-white text-[#4a2c2a] border border-gray-300 rounded hover:border-[#c96b3c]">2</button>
          <button className="px-4 py-2 bg-white text-[#4a2c2a] border border-gray-300 rounded hover:border-[#c96b3c]">Next</button>
        </div>
      </div>
    </div>
  );
}
