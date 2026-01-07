import React from 'react';
import { getCollectionsList } from '@/lib/firestore/server';
import { getDocumentsList } from '@/lib/firestore/server';
import { CollectionsSidebar } from '@/components/dashboard/CollectionsSidebar';
import { DocumentList } from '@/components/dashboard/DocumentList';
import { MobileMenuWrapper } from '../MobileMenuWrapper';

export const dynamic = 'force-dynamic';

interface CollectionPageProps {
  params: Promise<{
    collection: string;
  }>;
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collection: rawCollection } = await params;
  const collection = decodeURIComponent(rawCollection);
  
  let collections: string[] = [];
  let documents: string[] = [];
  let collectionsError: string | null = null;
  let documentsError: string | null = null;

  try {
    collections = await getCollectionsList();
  } catch (err: any) {
    collectionsError = err.message || 'Failed to load collections';
    console.error('Error loading collections:', err);
  }

  try {
    documents = await getDocumentsList(collection);
  } catch (err: any) {
    documentsError = err.message || 'Failed to load documents';
    console.error(`Error loading documents from ${collection}:`, err);
  }

  return (
    <>
      <MobileMenuWrapper collections={collections} />
      <div className="hidden lg:block w-64 flex-shrink-0">
        <CollectionsSidebar collections={collections} error={collectionsError} />
      </div>
      <div className="w-64 lg:w-80 flex-shrink-0 hidden sm:block">
        <DocumentList
          documents={documents}
          collectionName={collection}
          error={documentsError}
        />
      </div>
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 min-w-0">
        <div className="text-center max-w-md px-4 sm:px-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {collection}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
            {documents.length === 0
              ? 'This collection is empty or you may not have permission to view it.'
              : `${documents.length} document${documents.length !== 1 ? 's' : ''} available. Select one to view details.`}
          </p>
          {documents.length > 0 && (
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-xs sm:text-sm text-blue-700 dark:text-blue-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Collection loaded successfully</span>
            </div>
          )}
          {/* Mobile document list */}
          <div className="sm:hidden mt-6 w-full max-w-sm mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 max-h-96 overflow-y-auto">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Documents</h3>
              {documents.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No documents</p>
              ) : (
                <div className="space-y-1">
                  {documents.map((docId) => (
                    <a
                      key={docId}
                      href={`/dashboard/${encodeURIComponent(collection)}/${encodeURIComponent(docId)}`}
                      className="block px-3 py-2 text-xs font-mono bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors break-all"
                    >
                      {docId}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

