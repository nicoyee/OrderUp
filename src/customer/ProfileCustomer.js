import '../css/DashboardCustomer.css';
import '../css/Dashboard.css';
import '../css/Profile.css';

import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../App';
import HeaderCustomer from './HeaderCustomer';
import Customer from '../class/Customer.ts';
import User from '../class/User.js';
import { onAuthStateChanged } from "firebase/auth";
import { FController } from '../class/controllers/controller.ts';

const ProfileCustomer = () => {
    const user = useContext(UserContext);
    const [image, setImage] = useState(null);
    const [uid, setUid] = useState(null);

    useEffect(() => {
        const auth = FController.getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        try {
            if (uid && image) {
                await User.updateProfilePicture(uid, image);
            } else {
                console.error("User ID or image is missing");
            }
        } catch (error) {
            console.error("Error handling submit: ", error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className='dashboardContainer'>
            <HeaderCustomer user={user} />
            <div className='profileContent'>
                <div className="profileCard">
                    <div className="profileCardText">
                        <img src={user.profilePicture || 'https://via.placeholder.com/150'} alt='avatar' />
                        <input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} />
                        <button onClick={handleSubmit}>Submit</button>
                        <p className="profileCardDetails">
                            <span className="profileCardLabel">Username:</span>
                            <span className="profileCardValue">{user.name}</span>
                            <br />
                            <span className="profileCardLabel">Email Address:</span>
                            <span className="profileCardValue">{user.email}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCustomer;
