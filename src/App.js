import React, { useEffect, useState, createContext, useContext } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import Landing from './pages/landing/Landing';
import CustomerDashboard from './objects/customer/CustomerDashboard';
import AdminDashboard from './objects/admin/AdminDashboard';
import StaffDashboard from './objects/staff/StaffDashboard';

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
