"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    originalPrice: '',
    offerPrice: '',
    description: '',
    stock: '',
    isSevenDayPolicy: true,
    isFreeShipping: true,
    shippingCost: '',
    isClosed: false,
    imageUrl: '', // Changed from file to string
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl.trim()) {
      alert("Please provide a product image URL");
      return;
    }
    
    setLoading(true);
    
    try {
      // 1. Generate a URL-friendly slug
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      // 2. Save to Firestore
      const productData = {
        name: formData.name,
        slug,
        category: formData.category,
        originalPrice: Number(formData.originalPrice) || 0,
        offerPrice: Number(formData.offerPrice),
        description: formData.description,
        stock: Number(formData.stock),
        isSevenDayPolicy: formData.isSevenDayPolicy,
        isFreeShipping: formData.isFreeShipping,
        shippingCost: formData.isFreeShipping ? 0 : Number(formData.shippingCost),
        isClosed: formData.isClosed,
        image: formData.imageUrl, // Save the direct URL provided by the user
        createdAt: serverTimestamp()
      };

      console.log("Attempting to save product to Firestore...", productData);
      const docRef = await addDoc(collection(db, 'products'), productData);
      console.log("addDoc succeeded! Document written with ID: ", docRef.id);
      
      alert("Product added successfully! Document ID: " + docRef.id);
      router.push('/admin/products');
    } catch (error) {
      console.error("FIREBASE ERROR - Failed to add product:", error);
      console.error("Error Code:", error.code);
      console.error("Error Message:", error.message);
      alert("Failed to add product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-3xl font-bold mb-8 text-[#4A2C2A]">Add New Product</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
        
        {/* Basic Info */}
        <div>
          <h2 className="text-xl font-bold text-[#4A2C2A] border-b pb-2 mb-4">Basic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#C96B3C] focus:border-[#C96B3C] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <input required type="text" name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Watches, Accessories" className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#C96B3C] focus:border-[#C96B3C] outline-none" />
            </div>
          </div>
        </div>

        {/* Image */}
        <div>
          <h2 className="text-xl font-bold text-[#4A2C2A] border-b pb-2 mb-4">Product Image</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Public URL *</label>
            <input required type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#C96B3C] focus:border-[#C96B3C] outline-none" />
            <p className="text-xs text-gray-500 mt-2">Enter the direct public URL to the image. Ensure the URL ends in .jpg, .png, etc.</p>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div>
          <h2 className="text-xl font-bold text-[#4A2C2A] border-b pb-2 mb-4">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Offer Price (₹) *</label>
              <input required type="number" name="offerPrice" value={formData.offerPrice} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#C96B3C] focus:border-[#C96B3C] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
              <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#C96B3C] focus:border-[#C96B3C] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Available *</label>
              <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#C96B3C] focus:border-[#C96B3C] outline-none" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-xl font-bold text-[#4A2C2A] border-b pb-2 mb-4">Description</h2>
          <div>
            <textarea required name="description" rows="5" value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#C96B3C] focus:border-[#C96B3C] outline-none"></textarea>
          </div>
        </div>

        {/* Policies & Visibility */}
        <div>
          <h2 className="text-xl font-bold text-[#4A2C2A] border-b pb-2 mb-4">Policies & Visibility</h2>
          <div className="space-y-4">
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" name="isSevenDayPolicy" checked={formData.isSevenDayPolicy} onChange={handleChange} className="w-5 h-5 text-[#C96B3C] rounded focus:ring-[#C96B3C]" />
              <span className="text-gray-700 font-medium">Eligible for 7 Days Return Policy</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" name="isFreeShipping" checked={formData.isFreeShipping} onChange={handleChange} className="w-5 h-5 text-[#C96B3C] rounded focus:ring-[#C96B3C]" />
              <span className="text-gray-700 font-medium">Free Shipping</span>
            </label>

            {!formData.isFreeShipping && (
              <div className="pl-8 pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Cost (₹) *</label>
                <input type="number" name="shippingCost" required={!formData.isFreeShipping} value={formData.shippingCost} onChange={handleChange} className="w-full max-w-xs border border-gray-300 rounded-md p-3 focus:ring-[#C96B3C] focus:border-[#C96B3C] outline-none" />
              </div>
            )}

            <div className="pt-4 mt-4 border-t border-gray-100">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" name="isClosed" checked={formData.isClosed} onChange={handleChange} className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                <span className="text-red-600 font-bold">Close Product (Force "Out of Stock" on website)</span>
              </label>
              <p className="text-xs text-gray-500 ml-8 mt-1">If checked, customers cannot buy this product, regardless of the stock number.</p>
            </div>

          </div>
        </div>

        <div className="pt-6">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#4A2C2A] hover:bg-[#C96B3C] text-white font-bold py-4 rounded-md transition-colors duration-300 uppercase tracking-widest shadow-md disabled:opacity-50"
          >
            {loading ? 'Uploading & Saving...' : 'Save Product'}
          </button>
        </div>

      </form>
    </div>
  );
}
