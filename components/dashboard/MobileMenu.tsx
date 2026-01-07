'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileMenuProps {
  collections: string[];
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ collections, isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentCollection = pathSegments[1] || null;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 z-50 lg:hidden transform transition-transform duration-300 shadow-2xl overflow-y-auto">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Collections</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{collections.length} total</p>
        </div>
        
        <nav className="p-3 space-y-1">
          {collections.map((collection) => {
            const isActive = decodeURIComponent(currentCollection || '') === collection;
            const encodedCollection = encodeURIComponent(collection);
            return (
              <Link
                key={collection}
                href={`/dashboard/${encodedCollection}`}
                onClick={onClose}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {collection}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

