'use client';

import React from 'react';

interface FieldRendererProps {
  value: any;
  fieldName: string;
  depth?: number;
}

export function FieldRenderer({ value, fieldName, depth = 0 }: FieldRendererProps) {
  const maxDepth = 10;
  const indentPixels = Math.min(depth * 16, 160);

  if (depth > maxDepth) {
    return (
      <div style={{ paddingLeft: `${indentPixels}px` }} className="text-red-500 text-sm">
        Max depth exceeded
      </div>
    );
  }

  if (value === null || value === undefined) {
    return (
      <div style={{ paddingLeft: `${indentPixels}px` }} className="flex items-center gap-3 py-2">
        <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm min-w-[140px]">{fieldName}:</span>
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 italic text-sm rounded font-mono">null</span>
      </div>
    );
  }

  const valueType = typeof value;

  if (valueType === 'string') {
    return (
      <div style={{ paddingLeft: `${indentPixels}px` }} className="flex items-start gap-3 py-2">
        <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm min-w-[140px]">{fieldName}:</span>
        <span className="text-gray-900 dark:text-gray-100 text-sm break-words bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 flex-1">{value}</span>
      </div>
    );
  }

  if (valueType === 'number') {
    return (
      <div style={{ paddingLeft: `${indentPixels}px` }} className="flex items-center gap-3 py-2">
        <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm min-w-[140px]">{fieldName}:</span>
        <span className="text-blue-600 dark:text-blue-400 font-mono text-sm font-semibold bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800">{value}</span>
      </div>
    );
  }

  if (valueType === 'boolean') {
    return (
      <div style={{ paddingLeft: `${indentPixels}px` }} className="flex items-center gap-3 py-2">
        <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm min-w-[140px]">{fieldName}:</span>
        <span
          className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
            value
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-300 dark:border-green-700'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-300 dark:border-red-700'
          }`}
        >
          {String(value).toUpperCase()}
        </span>
      </div>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <div style={{ paddingLeft: `${indentPixels}px` }} className="flex items-center gap-3 py-2">
          <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm min-w-[140px]">{fieldName}:</span>
          <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 italic text-sm rounded-lg font-mono border border-gray-200 dark:border-gray-700">[] (empty array)</span>
        </div>
      );
    }

    return (
      <div style={{ paddingLeft: `${indentPixels}px` }} className="py-2">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm min-w-[140px]">{fieldName}:</span>
          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-lg border border-indigo-200 dark:border-indigo-800">
            [{value.length} items]
          </span>
        </div>
        <div className="ml-4 pl-4 border-l-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-r-lg py-2">
          {value.map((item, index) => (
            <FieldRenderer
              key={index}
              value={item}
              fieldName={`[${index}]`}
              depth={depth + 1}
            />
          ))}
        </div>
      </div>
    );
  }

  if (valueType === 'object') {
    const keys = Object.keys(value);
    
    if (keys.length === 0) {
      return (
        <div style={{ paddingLeft: `${indentPixels}px` }} className="flex items-center gap-3 py-2">
          <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm min-w-[140px]">{fieldName}:</span>
          <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 italic text-sm rounded-lg font-mono border border-gray-200 dark:border-gray-700">{'{} (empty object)'}</span>
        </div>
      );
    }

    // Check if it's a Firestore Timestamp (Admin SDK format with _seconds and _nanoseconds)
    if (value._seconds !== undefined && value._nanoseconds !== undefined) {
      const date = new Date(value._seconds * 1000 + value._nanoseconds / 1000000);
      return (
        <div style={{ paddingLeft: `${indentPixels}px` }} className="flex items-center gap-3 py-2">
          <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm min-w-[140px]">{fieldName}:</span>
          <span className="text-purple-600 dark:text-purple-400 text-sm font-mono bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800">
            {date.toISOString()}
          </span>
        </div>
      );
    }

    // Check if it's a Firestore Timestamp (alternative format with seconds and nanoseconds)
    if (value.seconds !== undefined && value.nanoseconds !== undefined && typeof value.seconds === 'number') {
      const date = new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
      return (
        <div style={{ paddingLeft: `${indentPixels}px` }} className="flex items-center gap-3 py-2">
          <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm min-w-[140px]">{fieldName}:</span>
          <span className="text-purple-600 dark:text-purple-400 text-sm font-mono bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800">
            {date.toISOString()}
          </span>
        </div>
      );
    }

    // Check if it's a Firestore GeoPoint (Admin SDK format)
    if (value._latitude !== undefined && value._longitude !== undefined) {
      return (
        <div style={{ paddingLeft: `${indentPixels}px` }} className="flex items-center gap-3 py-2">
          <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm min-w-[140px]">{fieldName}:</span>
          <span className="text-purple-600 dark:text-purple-400 text-sm font-mono bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800">
            ({value._latitude}, {value._longitude})
          </span>
        </div>
      );
    }

    // Check if it's a Firestore GeoPoint (alternative format)
    if (value.latitude !== undefined && value.longitude !== undefined && typeof value.latitude === 'number') {
      return (
        <div style={{ paddingLeft: `${indentPixels}px` }} className="flex items-center gap-3 py-2">
          <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm min-w-[140px]">{fieldName}:</span>
          <span className="text-purple-600 dark:text-purple-400 text-sm font-mono bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800">
            ({value.latitude}, {value.longitude})
          </span>
        </div>
      );
    }

    // Regular object
    return (
      <div style={{ paddingLeft: `${indentPixels}px` }} className="py-2">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm min-w-[140px]">{fieldName}:</span>
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-lg border border-purple-200 dark:border-purple-800">
            {'{' + keys.length + ' keys}'}
          </span>
        </div>
        <div className="ml-4 pl-4 border-l-2 border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10 rounded-r-lg py-2">
          {keys.map((key) => (
            <FieldRenderer
              key={key}
              value={value[key]}
              fieldName={key}
              depth={depth + 1}
            />
          ))}
        </div>
      </div>
    );
  }

  // Fallback for unknown types
  return (
    <div style={{ paddingLeft: `${indentPixels}px` }} className="flex items-center gap-3 py-2">
      <span className="text-gray-600 dark:text-gray-400 font-semibold text-sm min-w-[140px]">{fieldName}:</span>
      <span className="text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
        {String(value)} <span className="text-xs text-gray-400">({valueType})</span>
      </span>
    </div>
  );
}

