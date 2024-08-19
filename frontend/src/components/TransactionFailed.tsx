// src/components/TransactionFailed.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'; // Ensure you have a valid import

const TransactionFailed: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate loading delay
  setTimeout(() => {
    setLoading(false);
  }, 2000); // Adjust time as needed

  const handleGoHome = () => {
    navigate('/customers');
  };

  const handleRetry = () => {
    // Logic to retry the transaction goes here
    // For now, it will just navigate back to the transfer page
    navigate('/transfer');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6 space-y-6">
        <div className="bg-gray-600 p-4 rounded-full">
          <Skeleton circle={true} height={64} width={64} />
        </div>
        <h2 className="text-white text-3xl font-bold mb-4">
          <Skeleton width={200} />
        </h2>
        <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
          <p className="text-white text-xl font-semibold mb-4">
            <Skeleton width={150} />
          </p>
          <p className="text-white mb-4">
            <Skeleton width={200} />
          </p>
          <div className="flex space-x-4 mt-6">
            <button 
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
            >
              <Skeleton width={120} height={40} />
            </button>
            <button 
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
            >
              <Skeleton width={120} height={40} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6 space-y-6">
      <div className="bg-red-500 p-4 rounded-full">
        <ExclamationCircleIcon className="w-16 h-16 text-white" />
      </div>
      <h2 className="text-white text-3xl font-bold mb-4">Transaction Failed!</h2>
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <p className="text-white text-xl font-semibold mb-4">Oops, something went wrong with your transaction.</p>
        <p className="text-white mb-4">Please try again or contact support if the problem persists.</p>
      </div>
      <div className="flex space-x-4 mt-6">
        <button 
          onClick={handleGoHome} 
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
        >
          Go to Home
        </button>
        <button 
          onClick={handleRetry} 
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200"
        >
          Retry Transaction
        </button>
      </div>
    </div>
  );
};

export default TransactionFailed;
