// src/components/CustomerDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById } from '../api';
import { User } from '../types';

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        const fetchedUser = await getUserById(parseInt(id));
        setUser(fetchedUser);
      }
    };
    fetchUser();
  }, [id]);

  const handleTransferClick = () => {
    if (id) {
      navigate(`/transfer/${id}`);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Balance: ${user.balance.toFixed(2)}</p>
      <button onClick={handleTransferClick}>Transfer Money</button>
    </div>
  );
};

export default CustomerDetail;
