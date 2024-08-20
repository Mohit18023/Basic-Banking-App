import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getUserById, userHistory } from '../api';
import { User, Transfer } from '../types';

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Transfer[]>([]);
  const [users, setUsers] = useState<{ [key: number]: User }>({}); // Cache for users

  useEffect(() => {
    const fetchUser = async () => {
      const userId = id ? parseInt(id, 10) : 1; // Default to user ID 1 if id is undefined

      if (isNaN(userId)) {
        navigate('/customers'); // Redirect to customers page if id is invalid
        return;
      }

      try {
        const fetchedUser = await getUserById(userId);
        setUser(fetchedUser);

        // Fetch user transaction history
        const userHistoryData: Transfer[] = await userHistory(userId);
        setHistory(userHistoryData);

        // Fetch user details for transactions
        const userIds = new Set<number>();
        userHistoryData.forEach(transfer => {
          if (transfer.fromUserId !== userId) userIds.add(transfer.fromUserId);
          if (transfer.toUserId !== userId) userIds.add(transfer.toUserId);
        });

        const userPromises = Array.from(userIds).map(userId => getUserById(userId));
        const userResults = await Promise.all(userPromises);
        const userMap = userResults.reduce((map, user) => {
          map[user.id] = user;
          return map;
        }, {} as { [key: number]: User });

        setUsers(userMap);
      } catch (err) {
        setError("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleTransferClick = () => {
    if (user) {
      navigate(`/transfer/${user.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 space-y-6">
        <Skeleton circle={true} height={150} width={150} className="mb-4 bg-gray-700" />
        <div className="w-full max-w-lg bg-gray-800 rounded-lg p-4">
          <Skeleton height={40} width="60%" className="mb-4 bg-gray-700" />
          <Skeleton height={25} width="40%" className="mb-6 bg-gray-700" />
          <Skeleton height={40} width="60%" className="mb-8 bg-gray-700" />
          <div className="bg-gray-700 p-4 rounded-lg">
            <Skeleton height={30} width="50%" className="mb-4 bg-gray-600" />
            <div className="space-y-3">
              <Skeleton height={20} width="100%" className="bg-gray-600" />
              <Skeleton height={20} width="100%" className="bg-gray-600" />
              <Skeleton height={20} width="100%" className="bg-gray-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!user) return <div className="text-white text-center">No user found</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 space-y-6">
      <img 
        src={`/src/assets/images/${user.name}.jpg`} 
        alt={user.name} 
        onError={(e) => (e.currentTarget.src = `/src/assets/images/default.jpg`)}
        className="w-36 h-36 rounded-full mb-4 object-cover"
      />
      <h2 className="text-white text-4xl font-bold mb-4">{user.name}</h2>
      <p className="text-blue-400 text-2xl mb-6">Balance: ${user.balance.toFixed(2)}</p>
      <button 
        onClick={handleTransferClick} 
        className="bg-blue-500 text-white py-2 px-4 rounded mb-8 hover:bg-blue-700 transition duration-200"
      >
        Transfer Money
      </button>
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl">
        <h3 className="text-white text-2xl font-semibold mb-4">Transaction History</h3>
        <ul className="space-y-4">
          {history.length > 0 ? (
            history.map((transfer) => {
              const fromUser = users[transfer.fromUserId];
              const toUser = users[transfer.toUserId];
              // const fromUserName = fromUser ? fromUser.name : `User ${transfer.fromUserId}`;
              // const toUserName = toUser ? toUser.name : `User ${transfer.toUserId}`;
              const isDebit = transfer.fromUserId === user.id;
              const otherUser = isDebit ? toUser : fromUser;

              return (
                <li key={transfer.id} className="flex items-center border-b border-gray-700 pb-4">
                  <div className="flex items-center space-x-4 w-full">
                    <img
                      src={`/assets/images/${otherUser?.name}.jpg`} 
                      alt={otherUser?.name} 
                      onError={(e) => (e.currentTarget.src = `/src/assets/images/default.jpg`)}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex flex-col w-full">
                      <p className="text-white">{otherUser?.name}</p>
                      <p className="text-gray-400 text-sm">Date: {new Date(transfer.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-end space-x-2">
                      <p 
                        className={`text-lg font-bold ${isDebit ? 'text-red-500' : 'text-green-500'}`}
                      >
                        {isDebit ? '-' : '+'}
                      </p>
                      <p 
                        className={`text-lg font-bold ${isDebit ? 'text-red-500' : 'text-green-500'}`}
                      >
                        ${transfer.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <li className="text-gray-400">No transaction history available.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CustomerDetail;
