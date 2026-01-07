'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (authAPI.isAuthenticated()) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return null;
}
