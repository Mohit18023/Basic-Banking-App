// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Customers from './components/Customers';
import CustomerDetail from './components/CustomerDetail';
import Transfer from './components/Transfer';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomerDetail />} />
        <Route path="/transfer/:id" element={<Transfer />} />
      </Routes>
    </Router>
  );
};

export default App;
