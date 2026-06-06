"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore/lite';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const uniqueCategories = new Set();
        
        querySnapshot.forEach((doc) => {
          const cat = doc.data().category;
          if (cat) {
            // Capitalize first letter for display
            const displayCat = cat.charAt(0).toUpperCase() + cat.slice(1);
            uniqueCategories.add(displayCat);
          }
        });
        
        setCategories(Array.from(uniqueCategories));
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCategories();
  }, []);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-3xl font-bold mb-8 text-[#4A2C2A]">Categories</h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8 p-4 bg-blue-50 border border-blue-100 text-blue-800 rounded-lg">
          <p className="font-medium text-sm flex items-start">
            <span className="mr-2 mt-0.5">ℹ️</span>
            <span>
              <strong>Dynamic Categories:</strong> Categories in this system are created automatically. When you add a new product and type a category name, it automatically becomes an active category if it has available stock.
            </span>
          </p>
        </div>

        <h2 className="text-xl font-bold mb-6 text-[#4A2C2A]">Current Active Categories</h2>
        
        {loading ? (
          <div className="text-gray-500 py-4">Scanning products...</div>
        ) : categories.length === 0 ? (
          <div className="text-gray-500 py-4 italic">No categories found. Add your first product!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                <span className="font-semibold text-gray-800">{cat}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
