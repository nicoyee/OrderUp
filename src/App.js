import Loading from './components/common/Loader';
import Landing from './components/common/landing/Landing';
import CustomerDashboard from './components/customer/CustomerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import StaffDashboard from './components/staff/StaffDashboard';

import React, { useEffect, useState, createContext } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';

import { firebaseInstance } from "./class/firebase.ts";
import { userInstance } from './class/User.js';
import { onAuthStateChanged } from "firebase/auth";

export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  

  const onAuthtest = () => {
    onAuthStateChanged( firebaseInstance.auth, (authenticatedUser)=>{
      if(authenticatedUser){
        firebaseInstance.getDocument('users', authenticatedUser.uid).then((res)=>{
          const User = res.data();
          if(User){
            userInstance.setUserDetails(
              User.uid, 
              User.name, 
              User.email, 
              User.userType, 
              User.profilePicture
            )
            setUser({
              name: User.name, 
              email: User.email,
              profilePicture: User.profilePicture,
              userType: User.userType,
              docId: User.docId
            })
          }
        });
        setIsLoggedIn(true)
      }else{
        setIsLoggedIn(false)
        setUser(null)
      }
      setIsLoading(false);
    })
  }

  useEffect(()=>{
    onAuthtest()
    return () => {
      onAuthtest()
    }
  }, [])

  if (isLoading) {
    return <Loading />; 
  }

  return (
    <UserContext.Provider value={user}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={  
              user ? <Navigate to="/dashboard" /> : <Landing />
            }
          />
          <Route
            path="/dashboard"
            element={
              !isLoggedIn ? (
                <Navigate to="/" />
              ) : user?.userType === 'admin' ? (
                <AdminDashboard />
              ) : user?.userType === 'staff' ? (
                <StaffDashboard />
              ) : user?.userType === 'customer' ? (
                <CustomerDashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;