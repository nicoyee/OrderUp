import '../css/DashboardCustomer.css';
import '../css/Dashboard.css';
import '../css/Profile.css'

import React, { useState, useContext } from 'react';
import { UserContext } from '../App';
import HeaderAdmin from './HeaderAdmin';
import { getAuth, updateProfile } from "firebase/auth";



const ProfileCustomer = () => {

    const user = useContext(UserContext);
    
    const handleChangeAvatar = () => {
        const auth = getAuth();
        updateProfile(auth.currentUser, {
        photoURL: "https://example.com/jane-q-user/profile.jpg"
        }).then(() => {
        }).catch((error) => {
            console(error)
        });
    }

    return (
        <div className='dashboardContainer'>

            <HeaderAdmin user={ user } />

            <div className='profileContent'>
                     <div className="profileCard">
                        <div className="profileCardText">
                            <img src={user.profilePicture} alt="Profile Picture"></img>
                            
                            <br/>
                            <p className="profileCardDetails">
                                <span className="profileCardLabel">Username:</span>
                                <span className="profileCardValue">{user.name}</span>
                                <br/>
                                <span className="profileCardLabel">Email Address:</span>
                                <span className="profileCardValue">{user.email}</span>
                            </p>
                        </div>   
                    </div>
            </div>
        </div>
    );
}
export default ProfileCustomer;