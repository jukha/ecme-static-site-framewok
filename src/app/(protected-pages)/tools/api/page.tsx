// app/tools/api/page.tsx
// Placeholder page for "Tools: API"
// This page will provide documentation and interactive tools for the API.

import React from 'react';

export const metadata = {
  title: 'API Documentation',
};

export default function ApiDocumentationPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Developer API Documentation
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        Explore our comprehensive API documentation to integrate your applications with our platform.
      </p>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
          Getting Started with API
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Access data and perform operations programmatically. Detailed endpoints, request/response examples, and authentication guides will be provided here.
        </p>
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto text-sm text-gray-800 dark:text-gray-200">
          <code>
{`// Example API Endpoint (Placeholder)
GET /api/v1/vaults/list
Authorization: Bearer <YOUR_API_KEY>

Response:
{
  "vaults": [
    { "id": "vlt-001", "name": "Main Vault" },
    { "id": "vlt-002", "name": "Backup Storage" }
  ]
}`}
          </code>
        </pre>
        <button
          className="mt-6 px-6 py-3 bg-rose-600 text-white font-semibold rounded-md shadow-lg
                     hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-75
                     transition ease-in-out duration-150"
        >
          Explore Endpoints
        </button>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          (Interactive API explorers and code examples for various languages will be added.)
        </p>
      </div>
    </div>
  );
}