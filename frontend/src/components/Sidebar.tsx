import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Navigation</h2>
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center space-x-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span>Users</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clipRule="evenodd" />
              </svg>
              <span>Messages</span>
            </a>
          </li>
        </ul>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date Range</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input type="checkbox" id="active" className="mr-2" />
                <label htmlFor="active">Active</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="pending" className="mr-2" />
                <label htmlFor="pending">Pending</label>
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="completed" className="mr-2" />
                <label htmlFor="completed">Completed</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 