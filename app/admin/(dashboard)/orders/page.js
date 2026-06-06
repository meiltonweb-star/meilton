"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const querySnapshot = await getDocs(collection(db, 'orders'));
        const ordersList = [];
        querySnapshot.forEach((doc) => {
          ordersList.push(doc.data());
        });
        
        // Sort orders descending by orderId (since it includes timestamp) or date
        ordersList.sort((a, b) => b.orderId.localeCompare(a.orderId));
        
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrders();
  }, []);

  return (
    <div className="pb-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#4A2C2A]">Order Management</h1>
        <a 
          href="https://docs.google.com/spreadsheets" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition"
        >
          <span>📊</span> Open Google Sheets Backup
        </a>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-xl mb-2">No orders found.</p>
            <p className="text-sm">When a customer checks out, it will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-500 uppercase text-xs tracking-wider">
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">Qty</th>
                  <th className="p-4 font-semibold">Total</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderId} className="border-b hover:bg-gray-50/50 transition">
                    <td className="p-4 font-mono text-sm font-bold text-gray-900">{order.orderId}</td>
                    <td className="p-4 text-sm text-gray-600">{order.orderDate}</td>
                    <td className="p-4 text-sm font-medium text-gray-800 line-clamp-1 max-w-[200px]">{order.productName}</td>
                    <td className="p-4 text-sm text-gray-600">{order.quantity}</td>
                    <td className="p-4 text-sm font-bold text-[#C96B3C]">₹{order.totalAmount}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.orderStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.orderStatus || 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link 
                        href={`/admin/orders/${order.orderId}`}
                        className="text-sm font-bold text-[#4A2C2A] hover:text-[#C96B3C] px-3 py-1.5 border border-[#4A2C2A]/20 rounded hover:bg-[#4A2C2A]/5 transition"
                      >
                        Detail View
                      </Link>
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
