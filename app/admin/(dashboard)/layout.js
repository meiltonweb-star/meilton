import Link from 'next/link';

export default function AdminDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-900 absolute inset-0 z-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#2A1817] text-white flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin/dashboard" className="text-2xl font-bold tracking-wider">
            MEILTON<span className="text-[#C96B3C]">.</span>
          </Link>
          <div className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Admin</div>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin/dashboard" className="block px-4 py-3 rounded hover:bg-[#4A2C2A] transition">Dashboard</Link>
          <Link href="/admin/orders" className="block px-4 py-3 rounded hover:bg-[#4A2C2A] transition">Orders</Link>
          <Link href="/admin/products" className="block px-4 py-3 rounded hover:bg-[#4A2C2A] transition">Products</Link>
          <Link href="/admin/categories" className="block px-4 py-3 rounded hover:bg-[#4A2C2A] transition">Categories</Link>
          <Link href="/" className="block px-4 py-3 rounded hover:bg-red-900/50 text-red-400 mt-8 transition">
            Logout
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
