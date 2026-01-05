# Firestore Admin Dashboard

Production-ready Next.js 14 admin dashboard for exploring Firestore data with zero schema assumptions.

## Features

- **3-Column Layout**: Collections sidebar, document list, and document details
- **Dynamic Schema**: Automatically renders all data types without hardcoded schemas
- **Recursive Rendering**: Handles deeply nested objects and arrays
- **Server-Side Rendering**: Uses Next.js 14 App Router with Server Components
- **Type Safety**: Fully typed with TypeScript
- **Error Handling**: Graceful error states for permissions, missing data, etc.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with your Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=royal-exclusive-lemo
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# For server-side operations (listCollections), you need Admin SDK credentials
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) - it will redirect to `/dashboard`

## Project Structure

```
my-app/
├── app/
│   ├── dashboard/
│   │   ├── layout.tsx              # Dashboard layout with 3-column structure
│   │   ├── page.tsx                # Root dashboard page
│   │   └── [collection]/
│   │       ├── page.tsx            # Collection view
│   │       └── [documentId]/
│   │           └── page.tsx        # Document details view
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Home page (redirects to /dashboard)
├── components/
│   └── dashboard/
│       ├── CollectionsSidebar.tsx  # Column 1: Collections list
│       ├── DocumentList.tsx         # Column 2: Documents list
│       ├── DocumentDetails.tsx      # Column 3: Document viewer
│       └── FieldRenderer.tsx        # Recursive field renderer
└── lib/
    ├── firebase/
    │   └── config.ts                # Firebase client SDK config
    └── firestore/
        └── server.ts                # Firestore Admin SDK utilities
```

## Routes

- `/dashboard` - Main dashboard (shows collections sidebar)
- `/dashboard/[collection]` - Collection view (shows documents)
- `/dashboard/[collection]/[documentId]` - Document details view

## Data Type Support

The dashboard automatically renders:
- **Strings**: Plain text
- **Numbers**: Numeric values with blue styling
- **Booleans**: Badge with true/false
- **Arrays**: Expandable list with item count
- **Objects**: Nested key/value pairs with indentation
- **Timestamps**: ISO date strings
- **GeoPoints**: Coordinate pairs
- **Null/Undefined**: Gracefully handled

## Requirements

- Node.js 18+
- Firebase project with Firestore enabled
- Firebase Admin SDK credentials for server-side `listCollections()` (optional - can use client SDK if permissions allow)

## Deployment

The dashboard is ready for production deployment. Ensure all environment variables are set in your deployment platform.
