import 'react-toastify/dist/ReactToastify.css';

import React, { useEffect, useState, createContext, useContext } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import Landing from "./landing/Landing";
import DashboardAdmin from "./admin/DashboardAdmin";
import DashboardCustomer from "./customer/CustomerDashboard";
import DashboardStaff from "./staff/DashboardStaff";
import CartPage from "./customer/CartPage";
import Checkout from "./customer/Checkout.jsx";
import CustomerProfile from "./customer/CustomerProfile";
import AdminProfile from "./admin/AdminProfile";
import FinanceDashboard from './admin/FinanceDashboard.jsx';
import { UserType } from "./constants";
import { FService } from "./class/controllers/FirebaseService.ts";
import { onAuthStateChanged } from "firebase/auth";
import { userInstance } from "./class/User.js";


export const UserContext = createContext(null);

const PrivateRoute = ({ element, requiredUserType }) => {
  const user = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loading state while checking authentication
    if (user !== null) {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div>Loading...</div>; // Show loading state

  return user && user.userType === requiredUserType ? (
    element
  ) : (
    <Navigate to="/" />
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FService.auth, (authenticatedUser) => {
      if (authenticatedUser) {
        FService.getDocument("users", authenticatedUser.uid)
          .then((res) => {
            const testUser = res.data();
            if (testUser) {
              userInstance.setUserDetails(
                testUser.uid,
                testUser.name,
                testUser.email,
                testUser.userType,
                testUser.profilePicture
              );
              setUser({
                name: testUser.name,
                email: testUser.email,
                profilePicture: testUser.profilePicture,
                userType: testUser.userType,
                docId: testUser.docId,
              });
            }
            setIsLoggedIn(true);
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
            setIsLoggedIn(false);
          });
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setLoading(false); // Set loading to false once done
    });

    // Cleanup function to unsubscribe from the auth state listener
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={user}>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Landing />}
          />
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                user?.userType === "admin" ? (
                  <DashboardAdmin />
                ) : user?.userType === "staff" ? (
                  <DashboardStaff/>
                ) : user?.userType === "customer" ? (
                  <DashboardCustomer />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/" />
              )
            }
          />
           <Route
            path="/financedashboard" // Add this line
            element={<PrivateRoute element={<FinanceDashboard />} requiredUserType="admin" />} // Make sure to wrap it in PrivateRoute if needed
          />
          <Route
            path="/cart"
            element={<PrivateRoute element={<CartPage />} requiredUserType="customer" />}
          />
          <Route
            path="/checkout"
            element={<PrivateRoute element={<Checkout />} requiredUserType="customer" />}
          />
          {user && user.userType === "admin" && (
            <Route path={`/profile/:username`} element={<Navigate to="/dashboard" />}
            />
          )}
          {user && user.userType === "staff" && (
            <Route path={`/profile/:username`} element={<Navigate to="/dashboard" />}            />
          )}
          {user && user.userType === "customer" && (
            <Route
              path={`/profile/:username`}
              element={<CustomerProfile />}
            />
          )}
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
