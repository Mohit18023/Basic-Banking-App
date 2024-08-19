import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../api';
import { User } from '../types';

const Customers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const DEFAULT_IMAGE = '/src/assets/images/default.jpg';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        setUsers(users);
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (error) return <div className="text-center text-red-500">{error}</div>;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <h2 className="text-white text-3xl font-bold mb-8">Select a User</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg text-center animate-pulse">
                <div className="w-32 h-32 rounded-full bg-gray-700 mx-auto mb-6"></div>
                <div className="h-6 bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
              </div>
            ))
          : users.map(user => (
              <Link
                to={`/customers/${user.id}`}
                key={user.id}
                className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition duration-200 transform hover:scale-105"
              >
                <img
                  src={`/src/assets/images/${user.name}.jpg`}
                  alt={user.name}
                  onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE)}
                  className="w-32 h-32 rounded-full mx-auto mb-6"
                />
                <h3 className="text-white text-xl font-semibold">{user.name}</h3>
                <p className="text-blue-400">${user.balance.toFixed(2)}</p>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default Customers;
