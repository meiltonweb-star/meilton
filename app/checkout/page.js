"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('product');

  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!productId) {
        setProductLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'products', productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching product for checkout:", err);
      } finally {
        setProductLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value);
    if (val > 0) setQuantity(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) return;
    
    // Validations
    if (quantity < 1) {
      alert("Quantity must be at least 1");
      return;
    }
    if (!formData.mobile.trim() || formData.mobile.length < 10) {
      alert("Please enter a valid mobile number.");
      return;
    }
    if (!formData.pincode.trim() || formData.pincode.length < 4) {
      alert("Please enter a valid pincode.");
      return;
    }
    
    setLoading(true);
    
    try {
      const orderId = 'ORD-' + Date.now().toString().slice(-4) + Math.floor(100 + Math.random() * 900);
      const orderDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      const totalAmount = (product.offerPrice * quantity) + (product.isFreeShipping ? 0 : Number(product.shippingCost));
      
      const orderPayload = {
        orderId: orderId,
        orderDate: orderDate,
        productId: product.id,
        productName: product.name,
        quantity: quantity,
        fullName: formData.fullName,
        mobileNumber: formData.mobile,
        fullAddress: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        paymentMethod: "COD",
        totalAmount: totalAmount,
        orderStatus: "Pending"
      };

      console.log("Transmitting Order to Google Sheets & Firebase:", orderPayload);

      // 1. Save to Firebase Database
      await setDoc(doc(db, 'orders', orderId), orderPayload);

      // 2. Transmit Backup to Google Sheets Webhook
      const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
      
      if (scriptUrl && scriptUrl.trim() !== '') {
        try {
          await fetch(scriptUrl, {
            method: "POST",
            body: JSON.stringify(orderPayload),
            // Use text/plain to avoid preflight CORS errors from Google Apps Script
            headers: { "Content-Type": "text/plain;charset=utf-8" },
          });
        } catch (fetchError) {
          console.error("Google Sheets Webhook Error:", fetchError);
          // We intentionally don't block the user's success page if the background sync fails slightly
        }
      } else {
        // If no URL is configured, we just simulate the delay so the user still gets a success screen
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.warn("NEXT_PUBLIC_GOOGLE_SCRIPT_URL is not set. Order was not sent to Google Sheets.");
      }
      
      router.push(`/order-success/${orderId}`);
    } catch (error) {
      console.error("Order processing failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (productLoading) {
    return <div className="min-h-[70vh] flex justify-center items-center text-gray-500">Loading checkout...</div>;
  }

  if (!product) {
    return <div className="min-h-[70vh] flex justify-center items-center text-[#4a2c2a] text-2xl font-bold">Product not found for checkout.</div>;
  }

  const isOutOfStock = product.isClosed || product.stock <= 0;
  if (isOutOfStock) {
    return <div className="min-h-[70vh] flex justify-center items-center text-red-600 text-2xl font-bold">This product is currently out of stock.</div>;
  }

  return (
    <div className="bg-[#f8f5f2] min-h-screen pt-24 pb-24 text-[#4a2c2a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-wider mb-4">Secure Checkout</h1>
          <div className="w-24 h-1 bg-[#c96b3c] mx-auto"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Form */}
          <div className="flex-1 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 border-b pb-4">Shipping Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#c96b3c] focus:border-[#c96b3c] outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input required type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#c96b3c] focus:border-[#c96b3c] outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                <textarea required name="address" rows="3" value={formData.address} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#c96b3c] focus:border-[#c96b3c] outline-none transition"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#c96b3c] focus:border-[#c96b3c] outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#c96b3c] focus:border-[#c96b3c] outline-none transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input required type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#c96b3c] focus:border-[#c96b3c] outline-none transition" />
              </div>

              <div className="bg-[#4a2c2a]/5 p-4 rounded-md border border-[#4a2c2a]/10 mt-8">
                <div className="flex items-center space-x-3 text-[#4a2c2a] font-semibold">
                  <input type="radio" checked readOnly className="h-5 w-5 text-[#c96b3c] focus:ring-[#c96b3c]" />
                  <span>Cash on Delivery (COD)</span>
                </div>
                <p className="text-sm text-gray-500 mt-2 ml-8">Pay with cash upon delivery.</p>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#4a2c2a] hover:bg-[#c96b3c] text-white font-bold py-4 rounded-md transition-colors duration-300 uppercase tracking-widest mt-8 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Order'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-28">
              <h2 className="text-xl font-bold mb-6 border-b pb-4">Order Summary</h2>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                  {product.image && <Image src={product.image} alt={product.name} fill className="object-cover" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center mt-2 space-x-2">
                    <label className="text-sm text-gray-500">Qty:</label>
                    <input 
                      type="number" 
                      min="1" 
                      max={product.stock > 0 ? product.stock : 10}
                      value={quantity} 
                      onChange={handleQuantityChange}
                      className="border border-gray-300 rounded px-2 py-1 w-16 text-sm outline-none focus:border-[#c96b3c]"
                    />
                  </div>
                  <p className="font-bold text-[#c96b3c] mt-2">₹{product.offerPrice}</p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{product.offerPrice * quantity}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  {product.isFreeShipping ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    <span>₹{product.shippingCost}</span>
                  )}
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span className="text-[#c96b3c]">₹{(product.offerPrice * quantity) + (product.isFreeShipping ? 0 : Number(product.shippingCost))}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading checkout...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
