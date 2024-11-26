import "../css/Header.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthController from "../../class/controllers/AuthController";

const HeaderStaff = ({ user }) => {
  const [profileContext, showProfileContext] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleProfileContext = () => {
    showProfileContext(!profileContext);
  };

  const handleSignOut = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmSignOut = () => {
    AuthController.signOut();
    setIsLogoutModalOpen(false);
  };

  const cancelSignOut = () => {
    setIsLogoutModalOpen(false);
  };

  const handleStaffProfile = (user) => {
    if (user) {
      navigate(`/profile/${user?.name}`);
    }
  };

  return (
    <div className="headerDashboard">
      <div className="headerDashboardLeft">
        <h1 id="staffHeader">RiceBoy</h1>
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

export default HeaderStaff;