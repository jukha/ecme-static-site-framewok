// app/monitors/network/page.tsx
// Placeholder page for "Monitors: Network"
// This component will eventually display network health, traffic, and connectivity metrics.

import React from 'react'

export const metadata = {
    title: 'Network Monitoring',
}

export default function NetworkMonitorPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                Network Monitoring Dashboard
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                Real-time insights into network performance, latency, and
                connectivity across various nodes.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
                    Network Health Summary
                </h2>
                <div className="grid grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
                    <div>
                        <p>
                            Active Connections:{' '}
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                125 (Simulated)
                            </span>
                        </p>
                        <p>
                            Avg. Latency:{' '}
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                50ms (Simulated)
                            </span>
                        </p>
                    </div>
                    <div>
                        <p>
                            Data In:{' '}
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                1.2 GB/s (Simulated)
                            </span>
                        </p>
                        <p>
                            Data Out:{' '}
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                0.8 GB/s (Simulated)
                            </span>
                        </p>
                    </div>
                </div>
                <p className="mt-4 text-gray-500 dark:text-gray-500 text-sm">
                    (Charts and real-time data visualizations will be added
                    here.)
                </p>
            </div>
        </div>
    )
}
