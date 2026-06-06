"use client";

import Link from 'next/link';
import Image from 'next/image';
import LogoutButton from './LogoutButton';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleToggleStock = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, 'products', id), { isClosed: !currentStatus });
      setProducts(products.map(p => p.id === id ? { ...p, isClosed: !currentStatus } : p));
    } catch (err) {
      alert("Failed to update product: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert("Failed to delete product: " + err.message);
    }
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedProducts = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() });
        });
        setProducts(fetchedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-[#4A2C2A]">Products</h1>
        <div className="flex flex-wrap items-center gap-4">
          <Link 
            href="/admin/products/new" 
            className="bg-[#C96B3C] hover:bg-[#B45D33] text-white px-4 md:px-6 py-3 rounded shadow-md transition-colors uppercase tracking-widest text-xs md:text-sm font-semibold flex items-center"
          >
            + Add New Product
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading products from database...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">
            <p className="font-bold">Error loading products</p>
            <p className="text-sm mt-2">{error}</p>
            <p className="text-xs mt-4 text-gray-400">Make sure your Firestore Security Rules allow read access!</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No products found in the database. Click "Add New Product" to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm tracking-wider uppercase text-gray-500">
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 flex items-center space-x-4">
                      {product.image ? (
                        <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0"></div>
                      )}
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </td>
                    <td className="p-4 text-gray-600">{product.category}</td>
                    <td className="p-4 text-gray-600">₹{product.offerPrice}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      {product.isClosed ? (
                        <span className="text-red-600 font-bold text-xs uppercase tracking-widest border border-red-200 bg-red-50 px-2 py-1 rounded">Closed</span>
                      ) : (
                        <span className="text-green-600 font-bold text-xs uppercase tracking-widest border border-green-200 bg-green-50 px-2 py-1 rounded">Active</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link 
                        href={`/admin/products/${product.id}/edit`}
                        className="text-xs font-bold uppercase px-3 py-1.5 rounded border border-blue-300 text-blue-600 hover:bg-blue-50 transition inline-block"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleToggleStock(product.id, product.isClosed)}
                        className="text-xs font-bold uppercase px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 transition"
                      >
                        {product.isClosed ? 'Mark In Stock' : 'Make Out of Stock'}
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="text-xs font-bold uppercase px-3 py-1.5 rounded border border-red-300 text-red-600 hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
