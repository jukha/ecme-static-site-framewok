// app/validators/dashboard/page.tsx
// Placeholder page for "Validators: Dashboard"
// This dashboard will provide an overview of validator nodes' status and performance.

import React from 'react';

export const metadata = {
  title: 'Validators Dashboard',
};

export default function ValidatorsDashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Validators Dashboard
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        Comprehensive overview of validator nodes, their health, performance, and staking information.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            Active Validators
          </h2>
          <p className="text-blue-600 dark:text-blue-400 text-4xl font-bold">
            120 (Simulated)
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Total registered validators: 150
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
            Staking Rewards (24h)
          </h2>
          <p className="text-green-600 dark:text-green-400 text-4xl font-bold">
            + 1.25 XYZ (Simulated)
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Est. annual yield: 10.5%
          </p>
        </div>
      </div>
      <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        (This dashboard will eventually integrate with validator APIs for real-time data.)
      </p>
    </div>
  );
}