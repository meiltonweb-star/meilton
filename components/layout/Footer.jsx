import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#2A1817] text-white border-t border-white/5 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-3xl font-bold tracking-wider mb-6 inline-block">
              MEILTON<span className="text-[#C96B3C]">.</span>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-sm mb-6">
              Premium dropshipping products curated for exceptional quality and style. Cash on delivery available.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/meilton.co" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#C96B3C] hover:text-white transition-all"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 uppercase tracking-wider text-[#C96B3C]">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="/category/all" className="text-gray-400 hover:text-white transition">Shop All</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 uppercase tracking-wider text-[#C96B3C]">Policies</h4>
            <ul className="space-y-4">
              <li><Link href="/shipping" className="text-gray-400 hover:text-white transition">Shipping Policy</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; 2026 Meilton. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
