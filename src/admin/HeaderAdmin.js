import "../css/Header.css";

import React, { useState, useRef } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const HeaderAdmin = ({ user }) => {
  const [profileContext, showProfileContext] = useState(true);
  const profileContextBounds = useRef();
  const navigate = useNavigate();

  const toggleProfileContext = () => {
    showProfileContext(!profileContext);
  };

  const handleSignOut = () => {
    // Add this function
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("User signed out");
      })
      .catch((error) => {
        // An error happened.
        console.error("Error signing out", error);
      });
  };

  const handleAdminProfile = (user) => {
    // Navigate to the profile page when the cart icon is clicked
    if (user) {
      navigate("/adminprofile");
    }
  };

  return (
    <div className="headerDashboard">
      <div className="headerDashboardLeft">
        <h1 id="adminHeader">RiceBoy</h1>
      </div>

      <div className="headerDashboardCenter"></div>

      <div className="headerDashboardRight">
        <div className="profileHeader" onClick={toggleProfileContext}>
          <h2>{user.email}</h2>
          <img src={user.profilePicture}></img>

          {profileContext && (
            <div className="profileContext">
              <div
                className="profileContextSelection"
                onClick={() => handleAdminProfile(user)}
              >
                <span className="material-symbols-outlined">person</span>
                Profile
              </div>
              <div className="profileContextSelection">
                <span className="material-symbols-outlined">settings</span>
                Settings
              </div>
              <div className="profileContextSelection" onClick={handleSignOut}>
                <span
                  className="material-symbols-outlined"
                  style={{ color: "#f05006" }}
                >
                  logout
                </span>
                Log Out
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default HeaderAdmin;
