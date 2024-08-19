// src/components/Success.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getUserById } from '../api';
import { User } from '../types';
import { CheckIcon } from '@heroicons/react/24/solid'; // Updated import

interface SuccessProps {
  fromUserId: number;
  toUserId: number;
  amount: number;
  transactionId: number; // Added transactionId
}

const Success: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fromUserId, toUserId, amount, transactionId } = location.state as SuccessProps;

  const [fromUser, setFromUser] = useState<User | null>(null);
  const [toUser, setToUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const [fromUserDetails, toUserDetails] = await Promise.all([
          getUserById(fromUserId),
          getUserById(toUserId),
        ]);
        setFromUser(fromUserDetails);
        setToUser(toUserDetails);
      } catch (err) {
        setError('Failed to fetch user details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [fromUserId, toUserId]);

  const handleGoHome = () => {
    navigate('/customers');
  };

  const handleTransferAgain = () => {
    navigate(`/transfer/${fromUserId}`);
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
          <ul className="text-white space-y-2">
            {[...Array(4)].map((_, index) => (
              <li key={index} className="flex items-center">
                <Skeleton circle={true} height={48} width={48} className="mr-4" />
                <Skeleton width={100} />
              </li>
            ))}
          </ul>
        </div>
        <div className="flex space-x-4 mt-6">
          <Skeleton width={100} height={40} />
          <Skeleton width={120} height={40} />
        </div>
      </div>
    );
  }

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  if (!fromUser || !toUser) return <div className="text-white text-center">No transfer details found.</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6 space-y-6">
      <div className="bg-green-500 p-4 rounded-full">
        <CheckIcon className="w-16 h-16 text-white" />
      </div>
      <h2 className="text-white text-3xl font-bold mb-4">Transfer Successful!</h2>
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <p className="text-white text-xl font-semibold mb-4">Transfer Details:</p>
        <ul className="text-white space-y-2">
          <li className="flex items-center">
            <img 
              src={`/src/assets/images/${fromUser.name}.jpg`} 
              alt={fromUser.name} 
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />
            <span>From: {fromUser.name}</span>
          </li>
          <li className="flex items-center">
            <img 
              src={`/src/assets/images/${toUser.name}.jpg`} 
              alt={toUser.name} 
              className="w-12 h-12 rounded-full mr-4 object-cover"
            />
            <span>To: {toUser.name}</span>
          </li>
          <li>Amount: ${amount.toFixed(2)}</li>
          <li>Transaction ID: {transactionId}</li> {/* Added transaction ID */}
        </ul>
      </div>
      <div className="flex space-x-4 mt-6">
        <button 
          onClick={handleGoHome} 
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
        >
          Go to Home
        </button>
        <button 
          onClick={handleTransferAgain} 
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200"
        >
          Transfer Again
        </button>
      </div>
    </div>
  );
};

export default Success;
