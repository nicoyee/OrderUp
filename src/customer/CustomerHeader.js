import "./css/CustomerHeader.css";

import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from '../App';
import AuthController from "../class/controllers/AuthController";

const CustomerHeader = () => {
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

    const handleCartClick = () => {
        navigate("/cart");
    };

    const handleProfileClick = (user) => {
        if (user) {
            navigate(`/profile/${user?.name}`);
        }
    };

    return (
        <div id='customerHeader'>

            <div className="customerHeader-container">
                <h1>RiceBoy</h1>

                <div className="customerHeader-actions">
                    <button onClick={handleCartClick}>
                        Cart
                    </button>

                    <button onClick={handleProfileClick}>
                        Profile
                    </button>

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
    )
    
};

export default CustomerHeader;
