// src/components/NotFound.tsx
import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'; // Importing the icon

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6 space-y-6">
      <div className="bg-red-500 p-4 rounded-full">
        <ExclamationCircleIcon className="w-16 h-16 text-white" />
      </div>
      <h2 className="text-white text-3xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="text-white text-lg mb-4">Sorry, the page you are looking for does not exist.</p>
      <button 
        onClick={() => window.location.href = '/'} 
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;
