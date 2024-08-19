// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Customers from './components/Customers';
import CustomerDetail from './components/CustomerDetail';
import Transfer from './components/Transfer';
import Success from './components/Success';
import TransactionFailed from './components/TransactionFailed';
import NotFound from './components/NotFound';
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomerDetail />} />
        <Route path="/transfer/:id" element={<Transfer />} />
        <Route path="/success" element={<Success />} />
        <Route path="/failed" element={<TransactionFailed />} />
        <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
      </Routes>
    </Router>
  );
};

export default App;
