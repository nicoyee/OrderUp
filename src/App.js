import React, { useEffect, useState, createContext } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';

import Landing from './components/common/landing/Landing';
import CustomerDashboard from './components/customer/CustomerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import StaffDashboard from './components/staff/StaffDashboard';

export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <UserContext.Provider value={user}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <AdminDashboard /> } />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;