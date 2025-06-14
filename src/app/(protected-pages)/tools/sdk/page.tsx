// app/tools/sdk/page.tsx
// Placeholder page for "Tools: SDK"
// This page will provide information and downloads for the Software Development Kit.

import React from 'react';

export const metadata = {
  title: 'SDK Downloads',
};

export default function SdkDownloadsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Software Development Kit (SDK)
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        Download our SDKs to easily integrate and build custom solutions on top of our platform.
      </p>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
          Available SDKs
        </h2>
        <ul className="space-y-4 text-gray-600 dark:text-gray-400">
          <li>
            <span className="font-semibold">JavaScript SDK:</span> npm install @your-platform/js-sdk
            <button className="ml-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600">
              Download v1.0.0
            </button>
          </li>
          <li>
            <span className="font-semibold">Python SDK:</span> pip install your-platform-sdk
            <button className="ml-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600">
              Download v1.0.0
            </button>
          </li>
          <li>
            <span className="font-semibold">Go SDK:</span> go get github.com/your-platform/go-sdk
            <button className="ml-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600">
              Download v1.0.0
            </button>
          </li>
        </ul>
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          (SDK documentation and version history will be available here.)
        </p>
      </div>
    </div>
  );
}