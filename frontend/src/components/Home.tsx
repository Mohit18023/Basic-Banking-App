import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-white text-4xl font-bold mb-8">Welcome to Money Transfer App</h1>
      <Link to="/customers">
        <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
          View All Users
        </button>
      </Link>
    </div>
  );
};

export default Home;
