"use client";

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Delete the cookie
    document.cookie = "admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded shadow-sm transition-colors uppercase tracking-widest text-sm font-semibold"
    >
      Logout
    </button>
  );
}
