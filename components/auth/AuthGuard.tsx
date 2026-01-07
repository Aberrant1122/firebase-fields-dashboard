'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authAPI } from '@/lib/api/auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const isLoginPage = pathname === '/login';
      
      if (isLoginPage) {
        // If on login page and already authenticated, redirect to dashboard
        if (authAPI.isAuthenticated()) {
          // Verify token is still valid
          const user = await authAPI.getCurrentUser();
          if (user) {
            router.push('/dashboard');
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } else {
        // If not on login page, check authentication
        if (authAPI.isAuthenticated()) {
          // Verify token is still valid
          const user = await authAPI.getCurrentUser();
          if (user) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            router.push('/login');
          }
        } else {
          setIsAuthenticated(false);
          router.push('/login');
        }
      }
    };

    checkAuth();

    // Add event listeners for tab/browser close
    const handleBeforeUnload = () => {
      // This will automatically clear sessionStorage when tab/browser closes
      // No need to explicitly call logout here as sessionStorage is cleared automatically
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Optional: You can add additional cleanup here if needed
        // For now, sessionStorage will handle the automatic logout
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
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

