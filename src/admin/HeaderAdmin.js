import '../css/Header.css';

import React, { useState, useRef } from 'react';
import AuthController from '../class/controllers/AuthController';
import { useNavigate } from 'react-router-dom'; 

const HeaderAdmin = ({ user }) => {

    const [profileContext, showProfileContext] = useState(true);
    const profileContextBounds = useRef();
    const navigate = useNavigate();

    const toggleProfileContext = () => {
        showProfileContext(!profileContext);
    };

    const handleSignOut = () => {
        AuthController.signOut();
    };

    const handleProfileClick = () => {
        navigate('/admin/profile'); // Function to navigate to the profile page
    };

    return (
        <div className='headerDashboard'>
            <div className='headerDashboardLeft'>
                <h1 id='adminHeader'>RiceBoy</h1>
            </div>

            <div className='headerDashboardCenter'>
                {/* You can add content here if needed */}
            </div>
  
            <div className='headerDashboardRight'>
                {user ? (
                    <div className='profileHeader' onClick={toggleProfileContext}>
                        <h2>{user.email}</h2>
                        <img src={user.profilePicture} alt="Profile" />
                        
                        {profileContext && (
                            <div className="profileContext">
                                <button className="value" onClick={handleProfileClick}>
                                    <span className="material-symbols-outlined">
                                        person
                                    </span>
                                    Profile
                                </button>
                                <button className="value">
                                    <span className="material-symbols-outlined">
                                        settings
                                    </span>
                                    Settings
                                </button>
                                <button className="value" onClick={handleSignOut}>
                                    <span className="material-symbols-outlined">
                                        logout
                                    </span>
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    );
};

export default HeaderAdmin;
