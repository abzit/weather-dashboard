'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black-300 to-blue-600">
      <div className="text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Weather Dashboard</h1>
        <p className="text-xl mb-8">Track weather for multiple cities</p>
        <div className="space-x-4">
          <Link href="/login" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Login
          </Link>
          <Link href="/register" className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}