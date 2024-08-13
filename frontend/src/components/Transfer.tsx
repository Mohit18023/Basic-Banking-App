// src/components/Transfer.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUsers, createTransfer } from '../api';
import { User } from '../types';

const Transfer: React.FC = () => {
  const { id: fromUserId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [toUserId, setToUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsers();
      setUsers(users);
    };
    fetchUsers();
  }, []);

  const handleTransfer = async () => {
    if (toUserId && amount > 0 && fromUserId) {
      await createTransfer({
        fromUserId: parseInt(fromUserId),
        toUserId,
        amount,
      });
      navigate('/customers');
    }
  };

  return (
    <div>
      <h2>Transfer Money</h2>
      <div>
        <label>
          Amount: $
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Transfer to:
          <select onChange={e => setToUserId(parseInt(e.target.value))}>
            <option value="">Select a Customer</option>
            {users.map(user => (
              user.id !== parseInt(fromUserId || '') && (
                <option key={user.id} value={user.id}>
                  {user.name} - ${user.balance.toFixed(2)}
                </option>
              )
            ))}
          </select>
        </label>
      </div>
      <button onClick={handleTransfer}>Transfer</button>
    </div>
  );
};

export default Transfer;
