"use client";

import { usePathname } from 'next/navigation';

export default function PublicOnly({ children }) {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return <>{children}</>;
}
