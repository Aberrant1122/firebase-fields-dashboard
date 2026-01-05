import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App | undefined;
let adminDb: Firestore | undefined;

function getAdminApp(): App {
  if (adminApp) {
    return adminApp;
  }

  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
    return adminApp;
  }

  // For Admin SDK, we need service account credentials
  // These should be in environment variables
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  
  if (!serviceAccount) {
    // Check if we are in production or have some indication that ADC might be available
    // Otherwise, throw a clear error to prevent the confusing "Could not load default credentials" crash
    if (process.env.NODE_ENV === 'development') {
      console.warn('FIREBASE_SERVICE_ACCOUNT_KEY is not set. Attempting to use Application Default Credentials...');
      
      // If we are in dev and don't have explicit credentials, we might want to stop here to avoid the crash
      // unless the user really intends to use ADC.
      // A common issue is that ADC fails with an uncaught exception in some versions of the library.
      // Let's check for GOOGLE_APPLICATION_CREDENTIALS env var as a hint.
      if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
         throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_KEY in .env.local and no GOOGLE_APPLICATION_CREDENTIALS found. Please set up your credentials.');
      }
    }
    
    // Fallback: try to use default credentials or application default credentials
    try {
      adminApp = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'royal-exclusive-lemo',
      });
      return adminApp;
    } catch (error: any) {
      throw new Error(`Firebase Admin SDK initialization failed: ${error.message}. Please provide FIREBASE_SERVICE_ACCOUNT_KEY or configure application default credentials.`);
    }
  }

  try {
    const serviceAccountKey = typeof serviceAccount === 'string' 
      ? JSON.parse(serviceAccount) 
      : serviceAccount;
    adminApp = initializeApp({
      credential: cert(serviceAccountKey),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'royal-exclusive-lemo',
    });
    return adminApp;
  } catch (error: any) {
    throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY: ${error.message}. It must be a valid JSON string or object.`);
  }
}

function getAdminFirestore(): Firestore {
  if (adminDb) {
    return adminDb;
  }

  const app = getAdminApp();
  adminDb = getFirestore(app);
  return adminDb;
}

export async function getCollectionsList(): Promise<string[]> {
  try {
    const db = getAdminFirestore();
    const collections = await db.listCollections();
    return collections.map((col: { id: string }) => col.id);
  } catch (error) {
    console.error('Error listing collections:', error);
    throw error;
  }
}

export async function getDocumentsList(collectionName: string): Promise<string[]> {
  try {
    console.log(`[getDocumentsList] Fetching documents for collection: ${collectionName}`);
    const db = getAdminFirestore();
    const collectionRef = db.collection(collectionName);
    const snapshot = await collectionRef.get();
    
    console.log(`[getDocumentsList] Found ${snapshot.size} documents in ${collectionName}`);
    
    return snapshot.docs.map((doc: { id: string }) => doc.id);
  } catch (error) {
    console.error(`Error fetching documents from collection ${collectionName}:`, error);
    throw error;
  }
}

export async function getDocument(collectionName: string, documentId: string): Promise<any | null> {
  try {
    const db = getAdminFirestore();
    const docRef = db.collection(collectionName).doc(documentId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return null;
    }
    
    return doc.data();
  } catch (error) {
    console.error(`Error fetching document ${documentId} from collection ${collectionName}:`, error);
    throw error;
  }
}

