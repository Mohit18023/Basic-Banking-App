// src/components/Customers.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../api';
import { User } from '../types';

const Customers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsers();
      setUsers(users);
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Customers</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <Link to={`/customers/${user.id}`}>
              {user.name} - ${user.balance.toFixed(2)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Customers;
