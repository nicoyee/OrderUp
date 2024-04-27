import '../css/Header.css';

import React, { useState, useRef } from 'react';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom'; 

const HeaderAdmin = ({ user }) => {

    const [profileContext, showProfileContext] = useState(true);
    const profileContextBounds = useRef();
    const navigate = useNavigate();

    const handleSignOut = () => {  // Add this function
        const auth = getAuth();
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log('User signed out');
        }).catch((error) => {
            // An error happened.
            console.error('Error signing out', error);
        });
    };

    const handleProfileClick = (user) => {
        navigate('/profileAdmin'); // Function to navigate to the profile page
    };

    return (
        <div className='headerDashboard'>

        <div className='headerDashboardLeft'>
            <h1 id='adminHeader'>RiceBoy</h1>
        </div>

        <div className='headerDashboardCenter'>

        </div>

        <div className='headerProfile'>

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
            )}

        </div>
    </div>
    );
}
export default HeaderAdmin;