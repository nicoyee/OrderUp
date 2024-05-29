import '../css/Header.css';

import React, { useState, useRef } from 'react';
import AuthController from '../class/controllers/AuthController';
import { getAuth, signOut } from "firebase/auth";
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
    

    const handleProfileClick = (user) => {
        navigate('/admin/profile'); // Function to navigate to the profile page
    };

    return (
        <div className='headerDashboard'>

            <div className='headerDashboardLeft'>
                <h1 id='adminHeader'>RiceBoy</h1>
            </div>

            <div className='headerDashboardCenter'>

            </div>
  
            <div className='headerDashboardRight'>

                <div className='profileHeader' onClick={ toggleProfileContext }>
                    <h2>{ user.email }</h2>
                    <img src={ user.profilePicture }></img>


                { profileContext && (
                <div className="profileContext" onClick={handleProfileClick}>
                    <button className="value">
                        <span class="material-symbols-outlined">
                            person
                        </span>
                        Profile
                    </button>
                    <button className="value">
                        <span class="material-symbols-outlined">
                            settings
                        </span>
                        Settings
                    </button>
                    <button className="value" onClick={handleSignOut}>
                        <span class="material-symbols-outlined">
                            logout
                        </span>
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}
export default HeaderAdmin;