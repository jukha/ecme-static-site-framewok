// app/monitors/stats/page.tsx
// Placeholder page for "Monitors: Statistics"
// This component will display various operational statistics and performance indicators.

import React from 'react';

export const metadata = {
  title: 'Operational Statistics',
};

export default function OperationalStatisticsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Operational Statistics
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        Detailed statistical insights into system performance, resource utilization, and historical trends.
      </p>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
          System Metrics
        </h2>
        <div className="grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
          <div>
            <p>CPU Usage: <span className="font-semibold text-purple-600 dark:text-purple-400">45% (Simulated)</span></p>
            <p>Memory Usage: <span className="font-semibold text-purple-600 dark:text-purple-400">60% (Simulated)</span></p>
          </div>
          <div>
            <p>Storage Free: <span className="font-semibold text-purple-600 dark:text-purple-400">80% (Simulated)</span></p>
            <p>Uptime: <span className="font-semibold text-purple-600 dark:text-purple-400">7 days (Simulated)</span></p>
          </div>
        </div>
        <p className="mt-4 text-gray-500 dark:text-gray-500 text-sm">
          (This section will feature dynamic charts and data grids for in-depth analysis.)
        </p>
      </div>
    </div>
  );
}