'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/authStore';
import './globals.css';

export default function RootLayout({ children }) {
  const init = useAuthStore((state) => state.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <html lang="en">
      <body className="bg-red-50">{children}</body>
    </html>
  );
}