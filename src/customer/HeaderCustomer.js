import '../css/Header.css';
import siteLogo from '../assets/icon.png';

import React, { useState, useRef } from 'react';
import { getAuth, signOut } from "firebase/auth";

const HeaderCustomer = ({ user }) => {

    const [profileContext, showProfileContext] = useState(true);
    const profileContextBounds = useRef();

    const handleSignOut = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            console.log('User signed out');
        }).catch((error) => {
            console.error('Error signing out', error);
        });
    };

    return (
        <div className='headerDashboard'>

            <div className='headerDashboardLeft'>
                <h1>RiceBoy</h1>
            </div>

            <div className='headerDashboardCenter'>

            </div>
  
            <div className='headerProfile'>

                <h2>{ user.email }</h2>
                <img src={ user.profilePicture }></img>

                { profileContext && (
                    <div className="profileContext">
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
export default HeaderCustomer;