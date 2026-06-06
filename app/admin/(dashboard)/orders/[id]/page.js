"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const docRef = doc(db, 'orders', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setOrder(docSnap.data());
        } else {
          console.error("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    if (!order) return;
    setUpdating(true);
    try {
      const docRef = doc(db, 'orders', id);
      await updateDoc(docRef, {
        orderStatus: newStatus
      });
      setOrder({ ...order, orderStatus: newStatus });
      alert(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-gray-500">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="p-12 text-center text-gray-500">
        <p className="text-xl mb-4">Order not found.</p>
        <button onClick={() => router.back()} className="text-[#C96B3C] font-bold">← Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex items-center mb-6">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-[#4A2C2A] mr-4 flex items-center transition">
          <span className="mr-1">←</span> Back to Orders
        </button>
      </div>
      
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-[#4A2C2A] mb-2">Order {order.orderId}</h1>
          <p className="text-gray-500">Placed on: {order.orderDate}</p>
        </div>
        <div className="text-right">
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
            order.orderStatus === 'Approved' ? 'bg-green-100 text-green-800' :
            order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {order.orderStatus || 'Pending'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Customer Details */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#4A2C2A] mb-4 border-b pb-2">Customer Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Full Name</p>
              <p className="font-semibold text-gray-900">{order.fullName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Mobile Number</p>
              <p className="font-semibold text-gray-900">{order.mobileNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Shipping Address</p>
              <p className="font-medium text-gray-800">{order.fullAddress}</p>
              <p className="text-gray-600">{order.city}, {order.state} - {order.pincode}</p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-[#4A2C2A] mb-4 border-b pb-2">Order Summary</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Product</p>
              <Link href={`/admin/products/${order.productId}/edit`} className="font-semibold text-[#c96b3c] hover:underline">
                {order.productName}
              </Link>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-gray-600">Quantity</span>
              <span className="font-bold">{order.quantity}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-bold text-gray-800">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between border-t border-b py-3 text-lg">
              <span className="font-bold text-gray-900">Total Amount</span>
              <span className="font-bold text-[#C96B3C]">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="bg-[#4A2C2A]/5 p-6 rounded-xl border border-[#4A2C2A]/10">
        <h2 className="text-lg font-bold text-[#4A2C2A] mb-4">Admin Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => handleUpdateStatus('Approved')}
            disabled={updating || order.orderStatus === 'Approved'}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition disabled:opacity-50"
          >
            Approve Order
          </button>
          
          <button 
            onClick={() => handleUpdateStatus('Pending')}
            disabled={updating || order.orderStatus === 'Pending'}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded transition disabled:opacity-50"
          >
            Mark as Pending
          </button>

          <button 
            onClick={() => handleUpdateStatus('Cancelled')}
            disabled={updating || order.orderStatus === 'Cancelled'}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition disabled:opacity-50"
          >
            Cancel Order
          </button>
        </div>
      </div>

    </div>
  );
}
