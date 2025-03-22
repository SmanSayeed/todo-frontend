import React from 'react';
import { useAuthRedux } from '../../../hooks/useAuthRedux';

const Home = () => {
  const { user } = useAuthRedux();

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>
      
      {/* Welcome Message */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Welcome to Task Manager
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Hello, {user?.name || 'User'}!
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <p className="text-gray-700">
            This is your personal task management dashboard. You can create, track, and manage your tasks efficiently.
          </p>
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Task functionality is being implemented. Stay tuned for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;