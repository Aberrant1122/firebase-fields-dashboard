import React from 'react';
import { getCollectionsList } from '@/lib/firestore/server';
import { CollectionsSidebar } from '@/components/dashboard/CollectionsSidebar';
import { MobileMenuWrapper } from './MobileMenuWrapper';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let collections: string[] = [];
  let error: string | null = null;

  try {
    collections = await getCollectionsList();
  } catch (err: any) {
    error = err.message || 'Failed to load collections';
    console.error('Error loading collections:', err);
  }

  return (
    <>
      <MobileMenuWrapper collections={collections} />
      <div className="hidden lg:block w-64 flex-shrink-0">
        <CollectionsSidebar collections={collections} error={error} />
      </div>
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 min-w-0">
        <div className="text-center max-w-md px-4 sm:px-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
            Firestore Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
            Select a collection from the sidebar to begin exploring your data.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Ready to explore your Firestore data</span>
          </div>
        </div>
      </div>
    </>
  );
}

