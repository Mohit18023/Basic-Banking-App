import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { getUsers, createTransfer } from '../api';
import { User } from '../types';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import default styles
import './transfer.css';

const Transfer: React.FC = () => {
  const { id: fromUserId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [toUserId, setToUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [usersLoading, setUsersLoading] = useState<boolean>(true);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        setUsers(users);
      } catch (err) {
        console.error('Failed to fetch users.', err);
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTransfer = async () => {
    if (toUserId && amount > 0 && fromUserId) {
      setLoading(true);

      // Find the sender user
      const sender = users.find(user => user.id === parseInt(fromUserId));
      if (sender && sender.balance < amount) {
        toast.error('Not enough money for this transfer.'); // Show error toast
        setLoading(false);
        return;
      }

      try {
        const response = await createTransfer({
          fromUserId: parseInt(fromUserId),
          toUserId,
          amount,
        });
        navigate('/success', {
          state: {
            fromUserId: parseInt(fromUserId),
            toUserId,
            amount,
            transactionId: response.id, // Assuming the API response includes the transfer ID
          },
        });
      } catch (err) {
        console.error('Failed to complete transfer.', err);
        navigate('/failed'); // Redirect to TransactionFailed page
      } finally {
        setLoading(false);
      }
    } else {
      // Handle invalid transfer details case if needed
    }
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleUserSelect = (userId: number) => {
    setToUserId(userId);
    setDropdownOpen(false); // Ensure the dropdown closes immediately
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 space-y-6">
      <ToastContainer /> {/* Add ToastContainer to render toasts */}
      <h2 className="text-white text-4xl font-bold mb-4 text-center">Transfer Money</h2>
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <div className="mb-4">
          <label className="block text-white text-lg mb-2">
            Amount:
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(parseFloat(e.target.value))}
              className="mt-1 block w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
              placeholder="Enter amount"
              style={{ 
                appearance: 'none', 
                MozAppearance: 'textfield', /* Firefox */ 
                WebkitAppearance: 'none', /* Chrome, Safari, Edge, Opera */
              }}
            />
          </label>
        </div>
        <div className="relative mb-4" ref={dropdownRef}>
          <label className="block text-white text-lg mb-2">
            Transfer to:
            <div className="relative">
              <button
                type="button"
                onClick={handleDropdownToggle}
                className="mt-1 block w-full p-2 rounded bg-gray-700 text-white border border-gray-600 text-left focus:outline-none focus:border-blue-500"
              >
                {toUserId
                  ? users.find(user => user.id === toUserId)?.name || 'Select a Customer'
                  : 'Select Receiver'}
              </button>
              {dropdownOpen && (
                <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-lg border border-gray-600 max-h-60 overflow-y-auto">
                  {usersLoading ? (
                    <div className="p-2">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="flex items-center p-2">
                          <Skeleton circle={true} width={30} height={30} />
                          <Skeleton width="60%" height={20} className="ml-3" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    users
                      .filter(user => user.id !== parseInt(fromUserId || ''))
                      .map(user => (
                        <button
                          key={user.id}
                          onMouseDown={() => handleUserSelect(user.id)} // Use onMouseDown to ensure immediate dropdown close
                          className="flex items-center p-2 w-full text-left hover:bg-gray-700"
                        >
                          <img
                            src={`/assets/images/${user.name}.jpg`}
                            alt={user.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="ml-3 truncate">{user.name}</span>
                        </button>
                      ))
                  )}
                </div>
              )}
            </div>
          </label>
        </div>
        <button
          onClick={handleTransfer}
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-700 transition duration-200"
        >
          {loading ? 'Transferring...' : 'Transfer'}
        </button>
      </div>
    </div>
  );
};

export default Transfer;
