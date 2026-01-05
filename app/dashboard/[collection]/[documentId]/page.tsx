import React from 'react';
import { getCollectionsList } from '@/lib/firestore/server';
import { getDocumentsList } from '@/lib/firestore/server';
import { getDocument } from '@/lib/firestore/server';
import { serializeFirestoreData } from '@/lib/firestore/converters';
import { CollectionsSidebar } from '@/components/dashboard/CollectionsSidebar';
import { DocumentList } from '@/components/dashboard/DocumentList';
import { DocumentDetails } from '@/components/dashboard/DocumentDetails';
import { MobileMenuWrapper } from '../../MobileMenuWrapper';

export const dynamic = 'force-dynamic';

interface DocumentPageProps {
  params: Promise<{
    collection: string;
    documentId: string;
  }>;
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { collection: rawCollection, documentId: rawDocumentId } = await params;
  const collection = decodeURIComponent(rawCollection);
  const documentId = decodeURIComponent(rawDocumentId);
  
  let collections: string[] = [];
  let documents: string[] = [];
  let documentData: any = null;
  let collectionsError: string | null = null;
  let documentsError: string | null = null;
  let documentError: string | null = null;

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

  try {
    const rawData = await getDocument(collection, documentId);
    documentData = serializeFirestoreData(rawData);
  } catch (err: any) {
    documentError = err.message || 'Failed to load document';
    console.error(`Error loading document ${documentId} from ${collection}:`, err);
  }

  return (
    <>
      <MobileMenuWrapper collections={collections} />
      <div className="hidden lg:block w-64 flex-shrink-0">
        <CollectionsSidebar collections={collections} error={collectionsError} />
      </div>
      <div className="hidden md:block w-64 lg:w-80 flex-shrink-0">
        <DocumentList
          documents={documents}
          collectionName={collection}
          error={documentsError}
        />
      </div>
      <div className="flex-1 overflow-hidden min-w-0">
        <DocumentDetails
          documentData={documentData}
          collectionName={collection}
          documentId={documentId}
          error={documentError}
        />
      </div>
    </>
  );
}

