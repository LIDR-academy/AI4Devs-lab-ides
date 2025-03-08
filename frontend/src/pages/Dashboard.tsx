import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Welcome to the LTI Talent Tracking System, {user?.name}!
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                User Profile
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {user?.name}
              </dd>
              <dd className="mt-1 text-sm text-gray-500">
                {user?.email}
              </dd>
              <dd className="mt-1 text-sm text-gray-500">
                Role: {user?.role}
              </dd>
            </dl>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                System Status
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">
                Active
              </dd>
              <dd className="mt-1 text-sm text-gray-500">
                All systems operational
              </dd>
            </dl>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Quick Actions
              </dt>
              <dd className="mt-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="View Profile"
                  tabIndex={0}
                >
                  View Profile
                </button>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Coming Soon</h2>
        <p className="text-gray-600">
          Additional features for the Talent Tracking System will be implemented soon. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
};

export default Dashboard; 