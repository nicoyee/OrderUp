import "../css/Header.css";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AuthController from "../class/controllers/AuthController";

const HeaderCustomer = ({ user }) => {
  const [profileContext, showProfileContext] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // State for logout confirmation modal
  const profileContextBounds = useRef();
  const navigate = useNavigate();

  // Toggle profile context visibility
  const toggleProfileContext = () => {
    showProfileContext(!profileContext);
  };

  // Open logout confirmation modal
  const handleSignOut = () => {
    setIsLogoutModalOpen(true);
  };

  // Confirm and process the logout
  const confirmSignOut = () => {
    AuthController.signOut();
    setIsLogoutModalOpen(false);
  };

  // Cancel logout process
  const cancelSignOut = () => {
    setIsLogoutModalOpen(false);
  };

  // Navigate to the cart page
  const handleCartClick = () => {
    navigate("/cart");
  };

  // Navigate to the user profile page
  const handleProfile = (user) => {
    if (user) {
      navigate(`/profile/${user?.name}`);
    }
  };

  return (
    <div className="headerDashboard">
      <div className="headerDashboardLeft">
        <h1>RiceBoy</h1>
      </div>

      <div className="headerDashboardCenter"></div>

      <div className="headerDashboardRight">
        {/* Cart Icon */}
        <div className="cart-icon" onClick={handleCartClick}>
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
          >
            <path d="M3 3h2.554l3.954 12h9.492l3.954-9H6.775" />
            <circle cx="9" cy="19" r="2" />
            <circle cx="17" cy="19" r="2" />
          </svg>
        </div>

        {/* User Profile Header */}
        <div className="profileHeader" onClick={toggleProfileContext}>
          <h2>{user.email}</h2>

          {/* Profile dropdown context */}
          {profileContext && (
            <div className="profileContext">
              <div
                className="profileContextSelection"
                onClick={() => handleProfile(user)}
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

export default HeaderCustomer;