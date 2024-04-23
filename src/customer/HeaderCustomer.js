import '../css/Header.css';

import React, { useState, useRef } from 'react';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom'; 


const HeaderCustomer = ({ user }) => {

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

    const handleCartClick = () => {
        // Navigate to the cart page when the cart icon is clicked
        navigate('/cart');
    }; 

    return (
        <div className='headerDashboard'>

            <div className='headerDashboardLeft'>
                <label className="hamburger">
                    <input type="checkbox"/>
                    <svg viewBox="0 0 32 32">
                        <path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
                        <path className="line" d="M7 16 27 16"></path>
                    </svg>
                </label>

                <div className="container-input">
                    <input type="text" placeholder="Search" name="text" className="input"  />
                    <svg fill="#000000" width="20px" height="20px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                        <path d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z" fill-rule="evenodd"></path>
                    </svg>
                </div>
            </div>
            
            <div className='headerProfile'>
                
                <div className="cart-icon" onClick={handleCartClick}>
                    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="white">
                        <path d="M3 3h2.554l3.954 12h9.492l3.954-9H6.775" />
                        <circle cx="9" cy="19" r="2" />
                        <circle cx="17" cy="19" r="2" />
                    </svg>
                </div>
                
                
                <div className='headerProfileContent'>
                    <h1>{user.email}</h1>
                    <img src={user.profilePicture} alt="Profile" />
                    
                    {profileContext && (
                        <div className="profileContext">
                            <button className="value">
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
            </div>
        </div>
    );
}
export default HeaderCustomer;