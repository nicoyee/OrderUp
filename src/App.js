
import React, { useEffect, useState, createContext } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

import Landing from "./pages/Landing";
import DashboardAdmin from "./admin/DashboardAdmin";
import DashboardCustomer from "./customer/DashboardCustomer";
import CartPage from "./customer/CartPage";
import Checkout from "./customer/Checkout.jsx";
import CustomerProfile from "./customer/CustomerProfile";
import AdminProfile from "./admin/AdminProfile";
import { UserType } from "./constants";
import { Toaster } from "react-hot-toast"
import { FService } from "./class/controllers/FirebaseService.ts";

import { onAuthStateChanged } from "firebase/auth";
import { userInstance } from "./class/User.js";

export const UserContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onAuthtest = () => {
    onAuthStateChanged(FService.auth, (authenticatedUser) => {
      if (authenticatedUser) {
        FService.getDocument("users", authenticatedUser.uid).then((res) => {
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
        });

        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });
  };

  useEffect(() => {
    onAuthtest();

    return () => {
      onAuthtest();
    };
  }, []);

  useEffect(() => {
    console.log("user test:", user?.name);
  }, [user]);
  return (
    <UserContext.Provider value={user}>
      <BrowserRouter>
        <Toaster />
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
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          {user && user.userType === "admin" && (
            <Route path={`/profile/${user?.name}`} element={<AdminProfile />} />
          )}
          {user && user.userType === "customer" && (
            <Route
              path={`/profile/${user?.name}`}
              element={<CustomerProfile />}
            />
          )}
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
