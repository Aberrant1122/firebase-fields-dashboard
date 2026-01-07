'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface DocumentListProps {
  documents: string[];
  collectionName: string;
  isLoading?: boolean;
  error?: string | null;
}

export function DocumentList({ documents, collectionName, isLoading, error }: DocumentListProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentDocumentId = pathSegments[2] || null;

  if (error) {
    return (
      <div className="h-full bg-red-50 dark:bg-red-900/20 border-r border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-lg font-semibold mb-2 text-red-800 dark:text-red-200">Documents</h2>
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-800/50 flex flex-col shadow-lg">
      <div className="p-4 sm:p-5 border-b border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800">
        <div className="flex items-center gap-2 mb-1">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Documents</h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{collectionName}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{documents.length} documents</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4">
            <div className="animate-pulse space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-4 text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">No documents in this collection</p>
          </div>
        ) : (
          <nav className="p-2 sm:p-3 space-y-1">
            {documents.map((docId) => {
              const isActive = currentDocumentId === docId;
              return (
                <Link
                  key={docId}
                  href={`/dashboard/${encodeURIComponent(collectionName)}/${encodeURIComponent(docId)}`}
                  className={`group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs font-mono transition-all duration-200 touch-manipulation break-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 active:bg-gray-200 dark:active:bg-gray-700'
                  }`}
                >
                  <svg className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="flex-1 truncate min-w-0">{docId}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </div>
  );
}

