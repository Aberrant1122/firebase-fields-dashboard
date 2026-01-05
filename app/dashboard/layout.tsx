'use client';

import React, { useState } from 'react';
import { Header } from '@/components/dashboard/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <Header onMenuClick={() => setMobileMenuOpen(true)} />
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>
    </div>
  );
}

