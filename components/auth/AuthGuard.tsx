'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('isAuthenticated');
      const isLoginPage = pathname === '/login';
      
      if (isLoginPage) {
        // If on login page and already authenticated, redirect to dashboard
        if (auth === 'true') {
          router.push('/dashboard');
        } else {
          setIsAuthenticated(false);
        }
      } else {
        // If not on login page, check authentication
        if (auth === 'true') {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push('/login');
        }
      }
    }
  }, [router, pathname]);

  // Show loading only when checking auth for protected routes
  if (isAuthenticated === null && pathname !== '/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Allow login page to render
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // For protected routes, only render if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

