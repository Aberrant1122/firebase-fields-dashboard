'use client';

import { MobileMenu } from '@/components/dashboard/MobileMenu';
import { useState, useEffect } from 'react';

interface MobileMenuWrapperProps {
  collections: string[];
}

export function MobileMenuWrapper({ collections }: MobileMenuWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleMenuToggle = () => {
      setIsOpen((prev) => !prev);
    };

    // Listen for custom event from Header
    const handler = () => handleMenuToggle();
    window.addEventListener('mobileMenuToggle', handler);
    return () => window.removeEventListener('mobileMenuToggle', handler);
  }, []);

  return <MobileMenu collections={collections} isOpen={isOpen} onClose={() => setIsOpen(false)} />;
}

