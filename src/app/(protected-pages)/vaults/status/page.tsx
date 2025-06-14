// app/vaults/status/page.tsx
// Placeholder page for "Vaults: Status"
// This component will eventually display the real-time status and health of various vaults,
// likely involving API calls to fetch live data.

import React from 'react';

export const metadata = {
  title: 'Vaults Status', // Specific title for this page
};

export default function VaultsStatusPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Vaults Status Overview
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        Monitor the operational status, security alerts, and performance metrics of all active vaults.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            Vault Alpha
          </h2>
          <p className="text-green-600 dark:text-green-400 font-medium">Status: Operational</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
            Last Updated: Just now (Simulated)
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            Health Index: 98%
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            Vault Beta
          </h2>
          <p className="text-yellow-600 dark:text-yellow-400 font-medium">Status: Warning</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
            Last Updated: 5 mins ago (Simulated)
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            Health Index: 75% (Low Disk Space)
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            Vault Gamma
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Status: Idle</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
            Last Updated: 30 mins ago (Simulated)
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            Health Index: 100%
          </p>
        </div>
      </div>
      <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        (This display is currently simulated. Real-time data will be fetched via APIs.)
      </p>
    </div>
  );
}