import "./css/AdminHeader.css";

import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from '../../App';
import AuthController from "../../class/controllers/AuthController";

const HeaderAdmin = () => {

  const user = useContext(UserContext); 
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const navigate = useNavigate();

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


  return (
    <div id='adminHeader'>

            <div className="adminHeader-container">
                <h1>RiceBoy</h1>

                <div className="adminHeader-actions">
                    <button onClick={handleSignOut}>
                        Log Out
                    </button>
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

export default HeaderAdmin;
