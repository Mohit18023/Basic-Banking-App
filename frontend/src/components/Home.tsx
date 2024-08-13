// src/components/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Money Transfer App</h1>
      <Link to="/customers">
        <button>View All Customers</button>
      </Link>
    </div>
  );
};

export default Home;
