"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore/lite';
import Link from 'next/link';

export default function DashboardOverview() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [outOfStock, setOutOfStock] = useState(0);
  
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        // Fetch Products
        const productsSnap = await getDocs(collection(db, 'products'));
        let pTotal = 0;
        let pOut = 0;
        productsSnap.forEach((doc) => {
          pTotal++;
          const data = doc.data();
          if (data.isClosed || data.stock <= 0) pOut++;
        });
        
        // Fetch Orders
        const ordersSnap = await getDocs(collection(db, 'orders'));
        let oTotal = 0;
        let oRevenue = 0;
        const oList = [];
        ordersSnap.forEach((doc) => {
          oTotal++;
          const data = doc.data();
          // Only count revenue for approved orders (optional, but standard)
          if (data.orderStatus !== 'Cancelled') {
            oRevenue += Number(data.totalAmount) || 0;
          }
          oList.push(data);
        });

        // Sort for recent orders
        oList.sort((a, b) => b.orderId.localeCompare(a.orderId));
        
        setTotalProducts(pTotal);
        setOutOfStock(pOut);
        setTotalOrders(oTotal);
        setTotalRevenue(oRevenue);
        setRecentOrders(oList.slice(0, 5)); // Get top 5 recent
        
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-[#4A2C2A]">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm uppercase tracking-wider mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-[#4A2C2A]">{loading ? '-' : totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm uppercase tracking-wider mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-[#4A2C2A]">{loading ? '-' : `₹${totalRevenue}`}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm uppercase tracking-wider mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-[#4A2C2A]">{loading ? '-' : totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm uppercase tracking-wider mb-2">Out of Stock</h3>
          <p className="text-3xl font-bold text-red-600">{loading ? '-' : outOfStock}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#4A2C2A]">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-[#C96B3C] font-bold hover:underline">View All</Link>
        </div>
        
        {loading ? (
          <div className="py-8 text-center text-gray-500">Loading...</div>
        ) : recentOrders.length === 0 ? (
          <div className="py-8 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">No orders yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-500 uppercase text-xs tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.orderId} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 font-mono font-bold">
                      <Link href={`/admin/orders/${order.orderId}`} className="hover:text-[#C96B3C]">{order.orderId}</Link>
                    </td>
                    <td className="py-4">{order.fullName}</td>
                    <td className="py-4 text-gray-500 text-sm">{order.orderDate}</td>
                    <td className="py-4 font-semibold">₹{order.totalAmount}</td>
                    <td className="py-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.orderStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.orderStatus || 'Pending'}
                      </span>
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
