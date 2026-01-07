'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface CollectionsSidebarProps {
  collections: string[];
  isLoading?: boolean;
  error?: string | null;
}

export function CollectionsSidebar({ collections, isLoading, error }: CollectionsSidebarProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentCollection = pathSegments[1] || null;

  if (error) {
    return (
      <div className="h-full bg-red-50 dark:bg-red-900/20 border-r border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-lg font-semibold mb-2 text-red-800 dark:text-red-200">Collections</h2>
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-800/50 flex flex-col shadow-lg">
      <div className="p-4 sm:p-5 border-b border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800">
        <div className="flex items-center gap-2 mb-1">
          <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Collections</h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{collections.length} total</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4">
            <div className="animate-pulse space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : collections.length === 0 ? (
          <div className="p-4 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">No collections found</p>
          </div>
        ) : (
          <nav className="p-2 sm:p-3 space-y-1">
            {collections.map((collection) => {
              const isActive = decodeURIComponent(currentCollection || '') === collection;
              const encodedCollection = encodeURIComponent(collection);
              return (
                <Link
                  key={collection}
                  href={`/dashboard/${encodedCollection}`}
                  className={`group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 touch-manipulation ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 active:bg-gray-200 dark:active:bg-gray-700'
                  }`}
                >
                  <svg className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-purple-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="flex-1 truncate">{collection}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}

