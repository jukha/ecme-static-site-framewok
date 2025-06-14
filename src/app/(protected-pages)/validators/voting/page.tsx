// app/validators/voting/page.tsx
// Placeholder page for "Validators: Voting"
// This component will allow validators to participate in governance and protocol votes.

import React from 'react';

export const metadata = {
  title: 'Validator Voting',
};

export default function ValidatorVotingPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        Validator Voting Portal
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        Participate in network governance by casting your votes on important proposals and protocol upgrades.
      </p>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
          Active Proposals
        </h2>
        <ul className="space-y-4 text-gray-600 dark:text-gray-400">
          <li>
            <span className="font-semibold">Proposal #001:</span> Increase Block Size Limit <span className="text-yellow-600 dark:text-yellow-400">(Voting Open)</span>
          </li>
          <li>
            <span className="font-semibold">Proposal #002:</span> New Fee Structure <span className="text-green-600 dark:text-green-400">(Passed)</span>
          </li>
          <li>
            <span className="font-semibold">Proposal #003:</span> Community Fund Allocation <span className="text-red-600 dark:text-red-400">(Rejected)</span>
          </li>
        </ul>
        <button
          className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-lg
                     hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75
                     transition ease-in-out duration-150"
        >
          View All Proposals
        </button>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          (Interactive voting mechanisms and proposal details will be implemented here.)
        </p>
      </div>
    </div>
  );
}