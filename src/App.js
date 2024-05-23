import React, { useEffect, useState, createContext } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';

import Landing from './pages/Landing';
import DashboardAdmin from './admin/DashboardAdmin';
import DashboardCustomer from './customer/DashboardCustomer';
import CartPage from './customer/CartPage';
 
import { UserType } from './constants';
import {firebaseInstance} from "./class/firebase.ts";

export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Changed to false initially

  const onAuthStateChanged = () => {
    setLoading(true); // Set loading to true when fetching user data
    firebaseInstance.auth.onAuthStateChanged(user => {
      if (user) {
        const path = 'users';
        const identifier = user.uid;

        console.log("got here")
        firebaseInstance.getDocument(path, identifier)
          .then(docSnap => {
            if (docSnap.exists()) {
              const userData = docSnap.data();
              setUser(userData);
              console.log("User Successfully Logged In!");
            } else {
              const newUserDoc = {
                name: user.displayName?.split(' ')?.[0] ?? "",
                email: user.email,
                userType: UserType.CUSTOMER,
                profilePicture: user.photoURL,
              };
              firebaseInstance.setDocument(path, identifier, newUserDoc)
                .then(() => {
                  console.log('User document created');
                  setUser(newUserDoc);
                })
            }
          })
      } else {
        setUser(null);
        setLoading(false); 
      }
    });
  };

  useEffect(() => {
    return onAuthStateChanged;
  }, []);

  return (
    <UserContext.Provider value={user}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route
            path="/dashboard"
            element={
              user ? (
                user.userType === 'admin' ? (
                  <DashboardAdmin />
                ) : user.userType === 'customer' ? (
                  <DashboardCustomer />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
