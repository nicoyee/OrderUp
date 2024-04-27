import '../css/Header.css';
import siteLogo from '../assets/icon.png';

import React, { useState, useRef } from 'react';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom'; 

const HeaderCustomer = ({ user }) => {

    const [profileContext, showProfileContext] = useState(true);
    const profileContextBounds = useRef();
    const navigate = useNavigate();

    const toggleProfileContext = () => {
        showProfileContext(!profileContext);
    };

    const handleSignOut = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            console.log('User signed out');
        }).catch((error) => {
            console.error('Error signing out', error);
        });
    };

    const handleCartClick = () => {
        // Navigate to the cart page when the cart icon is clicked
        navigate('/cart');
    }; 

    const handleProfileClick = (user) => {
        navigate('/profile'); // Function to navigate to the profile page
    };

    return (
        <div className='headerDashboard'>

            <div className='headerDashboardLeft'>
                <h1>RiceBoy</h1>
            </div>

            <div className='headerDashboardCenter'>

            </div>
  
            <div className='headerDashboardRight'>

                <div className="cart-icon" onClick={handleCartClick}>
                    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="white">
                        <path d="M3 3h2.554l3.954 12h9.492l3.954-9H6.775" />
                        <circle cx="9" cy="19" r="2" />
                        <circle cx="17" cy="19" r="2" />
                    </svg>
                </div>

                <div className='profileHeader' onClick={ toggleProfileContext }>
                    <h2>{ user.email }</h2>
                    <img src={ user.profilePicture }></img>

                    { profileContext && (
                    <div className="profileContext" onClick={handleProfileClick}>
                        <div className="profileContextSelection">
                            <span className="material-symbols-outlined">
                                person
                            </span>
                            Profile
                        </div>
                        <div className="profileContextSelection">
                            <span className="material-symbols-outlined">
                                settings
                            </span>
                            Settings
                        </div>
                        <div className="profileContextSelection" onClick={handleSignOut}>
                            <span className="material-symbols-outlined" style={{ color: '#f05006' }}>
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
}
export default HeaderCustomer;