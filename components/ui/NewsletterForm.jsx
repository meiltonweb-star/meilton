"use client";

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setSubscribing(true);
    
    try {
      const scriptUrl = process.env.NEXT_PUBLIC_NEWSLETTER_SCRIPT_URL;
      if (scriptUrl && scriptUrl.trim() !== '') {
        const payload = {
          email: email,
          dateJoined: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        };
        
        await fetch(scriptUrl, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "text/plain;charset=utf-8" },
        });
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.warn("NEXT_PUBLIC_NEWSLETTER_SCRIPT_URL is not set.");
      }
      
      setSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setSubscribing(false);
    }
  };

  if (subscribed) {
    return (
      <div className="bg-green-500/20 text-green-200 border border-green-500/30 py-6 px-8 rounded-lg inline-block">
        <p className="text-xl font-bold">✓ Welcome to the club!</p>
        <p className="text-sm mt-2">You will receive our next update soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center">
      <input 
        type="email" 
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email" 
        className="px-6 py-4 w-full sm:w-96 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-sm focus:outline-none focus:border-[#c96b3c] transition-all"
      />
      <button 
        type="submit" 
        disabled={subscribing}
        className="bg-[#c96b3c] hover:bg-[#b45d33] px-8 py-4 uppercase tracking-widest text-sm font-semibold rounded-sm transition-colors hover:shadow-lg hover:-translate-y-1 transform disabled:opacity-70 disabled:hover:-translate-y-0"
      >
        {subscribing ? 'Joining...' : 'Subscribe'}
      </button>
    </form>
  );
}
