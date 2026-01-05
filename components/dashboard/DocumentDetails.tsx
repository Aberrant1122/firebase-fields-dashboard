'use client';

import React from 'react';
import { FieldRenderer } from './FieldRenderer';

interface DocumentDetailsProps {
  documentData: any;
  collectionName: string;
  documentId: string;
  isLoading?: boolean;
  error?: string | null;
}

export function DocumentDetails({
  documentData,
  collectionName,
  documentId,
  isLoading,
  error,
}: DocumentDetailsProps) {
  if (error) {
    return (
      <div className="h-full bg-red-50 dark:bg-red-900/20 p-6">
        <h2 className="text-lg font-semibold mb-2 text-red-800 dark:text-red-200">Error</h2>
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full bg-white dark:bg-gray-900 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!documentData) {
    return (
      <div className="h-full bg-white dark:bg-gray-900 p-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Document Not Found
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          The document <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">{documentId}</code> does not exist in collection <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">{collectionName}</code>.
        </p>
      </div>
    );
  }

  const fields = Object.keys(documentData);

  return (
    <div className="h-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="p-4 sm:p-6 border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-10 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
              Document Details
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{fields.length} fields</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Collection</p>
            <code className="font-mono text-xs sm:text-sm text-gray-900 dark:text-gray-100 font-semibold break-all">{collectionName}</code>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Document ID</p>
            <code className="font-mono text-xs text-gray-900 dark:text-gray-100 break-all">{documentId}</code>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800 sm:col-span-2 lg:col-span-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Fields</p>
            <p className="text-base sm:text-lg font-bold text-purple-600 dark:text-purple-400">{fields.length}</p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {fields.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-3">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">This document has no fields.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
            <div className="space-y-3">
              {fields.map((fieldName) => (
                <div key={fieldName} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-3 last:pb-0">
                  <FieldRenderer
                    value={documentData[fieldName]}
                    fieldName={fieldName}
                    depth={0}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

