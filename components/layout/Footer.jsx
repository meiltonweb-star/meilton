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
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Premium dropshipping products curated for exceptional quality and style. Cash on delivery available.
            </p>
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
