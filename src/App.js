import React, { useEffect, useState, createContext, useContext } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import Landing from './pages/Landing';
import DashboardAdmin from './admin/DashboardAdmin';
import DashboardCustomer from './customer/DashboardCustomer';

export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        getDoc(doc(db, 'users', user.uid)).then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUser(userData);
            console.log('User logged in');
          } else {
            const provider = user.providerData[0].providerId;
          if (provider === 'google.com') {
            let firstName = '';
            if (user.displayName) {
              const nameParts = user.displayName.split(' ');
              firstName = nameParts[0];
            }
            setDoc(docRef, {
              name: firstName,
              email: user.email,
              userType: "customer",
              profilePicture: user.photoURL
            }).then(() => {
              console.log('User document created');
              setUser({
                name: firstName,
                email: user.email,
                userType: "customer",
                profilePicture: user.photoURL
              });
            }).catch((error) => {
              console.log('Error creating document:', error);
            });
          }
        }
        setLoading(false);
      }).catch((error) => {
        console.log('Error getting document:', error);
        setLoading(false);
      });
    } else {
      setUser(null);
      setLoading(false);
    }
  });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <UserContext.Provider value={ user }>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={ user ? <Navigate to="/dashboard" /> : <Landing />} />
            <Route
              path="/dashboard"
              element={ user ? (
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
              )}
            />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
  );
}

export default App;
