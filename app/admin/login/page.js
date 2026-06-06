"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    const isValidOne = (normalizedEmail === 'flyggoagecy@gmail.com' || normalizedEmail === 'flyggoagency@gmail.com') && normalizedPassword === 'Flyggo8@';
    const isValidTwo = normalizedEmail === 'hello@meilton.com' && normalizedPassword === 'Jino2026@';

    if (isValidOne || isValidTwo) {
      document.cookie = "admin_auth=true; path=/; max-age=86400"; // Expires in 24 hours
      router.push('/admin/products');
      router.refresh();
    } else {
      setError(`Access Denied. (Debug - Email: "${normalizedEmail}", Password: "${normalizedPassword}")`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center p-4 absolute inset-0 z-50">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-wider text-[#4A2C2A]">
            MEILTON<span className="text-[#C96B3C]">.</span>
          </h1>
          <p className="text-gray-500 mt-2 uppercase tracking-widest text-xs font-semibold">Admin Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
            <input 
              required type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#C96B3C] focus:border-[#C96B3C] outline-none text-gray-900" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              required type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 focus:ring-[#C96B3C] focus:border-[#C96B3C] outline-none text-gray-900" 
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}
          
          <button 
            type="submit" 
            className="w-full bg-[#4A2C2A] hover:bg-[#C96B3C] text-white font-bold py-4 rounded-md transition-colors duration-300 uppercase tracking-widest mt-4"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
