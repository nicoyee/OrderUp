import "../css/Header.css";

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthController from "../class/controllers/AuthController";

const HeaderAdmin = ({ user }) => {
  const [profileContext, showProfileContext] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // State to control logout modal
  const profileContextBounds = useRef();
  const navigate = useNavigate();

  const toggleProfileContext = () => {
    showProfileContext(!profileContext);
  };

  const handleSignOut = () => {
    setIsLogoutModalOpen(true); // Open the logout confirmation modal
  };

  const confirmSignOut = () => {
    AuthController.signOut();
    setIsLogoutModalOpen(false); // Close the modal after sign out
  };

  const cancelSignOut = () => {
    setIsLogoutModalOpen(false); // Close the modal without signing out
  };

  const handleAdminProfile = (user) => {
    // Navigate to the profile page when the cart icon is clicked
    if (user) {
      navigate(`/profile/${user?.name}`);
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
          {profileContext && (
            <div className="profileContext">
              <div className="profileContextSelection" onClick={handleSignOut}>
                <span
                  className="material-symbols-outlined"
                  style={{ color: "#c0963d" }}
                >
                  logout
                </span>
                Log Out
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal for confirming logout */}
      {isLogoutModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to log out?</p>
            <div className="modal-buttons">
              <button className="modal-confirm" onClick={confirmSignOut}>
                Yes
              </button>
              <button className="modal-cancel" onClick={cancelSignOut}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderAdmin;
