import React, { useEffect, useState, createContext, useContext } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import Landing from './pages/Landing';
import DashboardAdmin from './admin/DashboardAdmin';
import DashboardCustomer from './customer/DashboardCustomer';
import CartPage from './customer/CartPage';

import { UserType } from './constants';
import { Firebase } from "./class/firebase.ts"

export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const firebase = new Firebase()

  const onAuthStateChanged = ()=>{
    auth.onAuthStateChanged(async(user) => {
      const path = 'users'
      const identifier = user.uid
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        // getDoc(doc(db, 'users', user.uid)).then((docSnap) => {
        await firebase.getDocument(path, identifier).then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUser(userData);
            console.log('User logged in');
          } else {
            const newUserDoc = {
              name: user?.displayName?.split(' ')?.[0] ?? "",
              email: user.email,
              userType: UserType.CUSTOMER,
              profilePicture: user.photoURL
            }
            firebase.setDocument(path, identifier, newUserDoc).then(() => {
              console.log('User document created');
              setUser(newUserDoc);
            }).catch((error) => {
              console.log('Error creating document:', error);
            });
          }
        })
      } else {
        setUser(null);
      }
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (

    <UserContext.Provider value={user}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing onAuthStateChanged={onAuthStateChanged}/>} />
          <Route
            path="/dashboard"
            element={
              user ? (
                user.userType === 'admin' ? (
                  <DashboardAdmin />
                ) : user.userType === 'customer' ? (
                  <DashboardCustomer />
                ) : user.userType === 'staff' ? (
                  <Landing />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/" />
              )
            }
          />
          {/* Route for CartPage */}
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  
  );
}

export default App;
