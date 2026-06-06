"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  // Refs for native event listener attachment
  const searchBtnRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Open search — wrapped in useCallback so ref effect can depend on it
  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  // Close search
  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  // Attach NATIVE click listener to search button (bypasses React synthetic events entirely)
  useEffect(() => {
    const btn = searchBtnRef.current;
    if (!btn) return;
    const handler = (e) => {
      e.stopPropagation();
      openSearch();
    };
    btn.addEventListener('click', handler, { passive: false });
    btn.addEventListener('touchend', handler, { passive: false });
    return () => {
      btn.removeEventListener('click', handler);
      btn.removeEventListener('touchend', handler);
    };
  }, [openSearch]);

  // Attach NATIVE click listener to close button
  useEffect(() => {
    const btn = closeBtnRef.current;
    if (!btn) return;
    const handler = (e) => {
      e.stopPropagation();
      closeSearch();
    };
    btn.addEventListener('click', handler, { passive: false });
    btn.addEventListener('touchend', handler, { passive: false });
    return () => {
      btn.removeEventListener('click', handler);
      btn.removeEventListener('touchend', handler);
    };
  }, [isSearchOpen, closeSearch]);

  // Fetch all active products when search opens for fast client-side filtering
  useEffect(() => {
    if (isSearchOpen && allProducts.length === 0) {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const res = await fetch('/api/products');
          if (res.ok) {
            const products = await res.json();
            setAllProducts(products);
          } else {
            console.error("Failed to load products for search");
          }
        } catch (error) {
          console.error("Error fetching products for search:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [isSearchOpen, allProducts.length]);

  // Handle dynamic search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredResults([]);
      return;
    }

    const queryLower = searchQuery.toLowerCase();
    const results = allProducts.filter(p => {
      const matchName = p.name?.toLowerCase().includes(queryLower);
      const matchCategory = p.category?.toLowerCase().includes(queryLower);
      return matchName || matchCategory;
    });

    setFilteredResults(results);
  }, [searchQuery, allProducts]);

  // Prevent background scrolling when search is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setSearchQuery(""); // clear when closed
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isSearchOpen]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* 
        IMPORTANT: Using solid bg instead of glass-effect.
        backdrop-filter creates broken stacking contexts on Android Chrome,
        causing touch events to never reach the button.
      */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          zIndex: 9999,
          background: 'rgba(74, 44, 42, 0.97)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          color: 'white',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-3xl font-bold tracking-wider">
                MEILTON<span className="text-[#C96B3C]">.</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              <Link href="/" className="hover:text-[#C96B3C] transition uppercase text-sm tracking-widest font-medium">Home</Link>
              <Link href="/category/all" className="hover:text-[#C96B3C] transition uppercase text-sm tracking-widest font-medium">Shop</Link>
              <Link href="/about" className="hover:text-[#C96B3C] transition uppercase text-sm tracking-widest font-medium">About</Link>
              <Link href="/contact" className="hover:text-[#C96B3C] transition uppercase text-sm tracking-widest font-medium">Contact</Link>
            </div>

            {/* Search Button — uses ref + native event listener */}
            <div className="flex items-center">
              <button 
                ref={searchBtnRef}
                type="button"
                style={{
                  position: 'relative',
                  zIndex: 10000,
                  padding: '12px',
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  touchAction: 'manipulation',
                  WebkitTapHighlightColor: 'rgba(201,107,60,0.3)',
                }}
                aria-label="Search"
              >
                <Search size={24} style={{ pointerEvents: 'none' }} />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Full-Screen Search Modal */}
      {isSearchOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10001,
            background: '#f8f5f2',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          
          {/* Search Header — large close button for mobile */}
          <div style={{
            height: '72px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            background: 'white',
            padding: '0 12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            gap: '8px',
          }}>
            {/* Big Close / Back button */}
            <button 
              ref={closeBtnRef}
              type="button"
              style={{
                width: '48px',
                height: '48px',
                minWidth: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '12px',
                color: '#4a2c2a',
                cursor: 'pointer',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'rgba(201,107,60,0.3)',
              }}
              aria-label="Close Search"
            >
              <X size={26} style={{ pointerEvents: 'none' }} />
            </button>

            {/* Search input */}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              background: '#f9fafb',
              borderRadius: '12px',
              padding: '0 12px',
              height: '48px',
              border: '1px solid #e5e7eb',
            }}>
              <Search style={{ color: '#9ca3af', marginRight: '8px', flexShrink: 0 }} size={20} />
              <input 
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '16px',
                  color: '#4a2c2a',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  style={{
                    background: '#e5e7eb',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                    color: '#6b7280',
                  }}
                >
                  <X size={14} style={{ pointerEvents: 'none' }} />
                </button>
              )}
            </div>
          </div>

          {/* Search Results Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            <div className="max-w-5xl mx-auto">
              
              {loading ? (
                <div className="text-center mt-20 text-gray-500">Initializing search...</div>
              ) : searchQuery.trim() === "" ? (
                <div className="text-center mt-32">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                    <Search size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-400 mb-2">What are you looking for?</h3>
                  <p className="text-gray-500">Start typing to search our entire catalog of premium products.</p>
                </div>
              ) : filteredResults.length === 0 ? (
                <div className="text-center mt-32">
                  <h3 className="text-2xl font-bold text-[#4a2c2a] mb-2">No products found</h3>
                  <p className="text-gray-500">We couldn&apos;t find anything matching &quot;{searchQuery}&quot;. Try different keywords or browse our categories.</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 pb-2 border-b">
                    {filteredResults.length} Results Found
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {filteredResults.map(product => (
                      <Link 
                        key={product.id} 
                        href={`/product/${product.id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="bg-white rounded-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col"
                      >
                        <div className="relative h-64 bg-gray-100 overflow-hidden">
                          {product.image ? (
                            <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">No Image</div>
                          )}
                          <div className="absolute top-2 left-2 bg-white/90 text-[#c96b3c] text-xs font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                            {product.category}
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h4 className="font-bold text-[#4a2c2a] text-lg mb-1 line-clamp-1">{product.name}</h4>
                          <p className="font-bold text-[#c96b3c] mt-auto">₹{product.offerPrice}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
