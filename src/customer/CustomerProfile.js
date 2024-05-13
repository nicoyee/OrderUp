import '../css/Dashboard.css';
import '../css/Profile.css';

import React, { useContext, useState,useEffect } from 'react';
import HeaderCustomer from './HeaderCustomer';
import { UserContext } from '../App';
import { storage, db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const CustomerProfile = () => {
    const user = useContext(UserContext);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [image, setImage] = useState(null);
    const [uid, setUid] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        console.log(user)
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
                console.log(user)
            } else {
                // If user is null, you can perform any cleanup or redirect logic here
                // For now, just log that the user is null
                console.log("User is null");
                navigate('/');
            }
        });
        return () => unsubscribe();
    }, []);

    if (!user) {
        return <div>Loading...</div>; // or any other placeholder or redirect logic
    }

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const editClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {

            const newName = event.target.elements.username.value;
            const newEmail = event.target.elements.email.value;

            // Update username and email if they are changed
            if (newName !== user.name || newEmail !== user.email) {
                await updateProfile(uid, newName, newEmail);
            }

            if (image) {
                await updateProfilePicture(uid, image, newName);
            }

        } catch (error) {
            console.error("Error handling submit: ", error);
        }
    };

    const updateProfile = async (userId, newName, newEmail) => {
        try {
            const userDocRef = doc(db, "users", userId);
            await updateDoc(userDocRef, {
                name: newName,
                email: newEmail
            });
            console.log("Username and email updated successfully in Firestore");
        } catch (error) {
            console.error("Error updating username and email: ", error);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
          }
    };

    const updateProfilePicture = async (userId, newImageFile,name) => {
        try {
            
            // Step 1: Fetch the old profile picture image URL from Firestore
            const userDocRef = doc(db, "users", userId);
            const userDocSnapshot = await getDoc(userDocRef);
            const userData = userDocSnapshot.data();
            const oldImageUrl = userData.profilePicture;

    
            // Step 2: Delete the old profile picture image from Firebase Storage
            if(oldImageUrl !== `https://ui-avatars.com/api/?name=${name}&background=random`){
                const oldImageRef = ref(storage, oldImageUrl);
                await deleteObject(oldImageRef);
                console.log("Old profile picture image deleted successfully");
            }
            
            // Step 3: Upload the new profile picture image to Firebase Storage
            const newImageRef = ref(storage, `/profile/${userId}/${newImageFile.name}`);
            await uploadBytes(newImageRef, newImageFile);
            console.log("New profile picture image uploaded successfully");
            
            // Step 4: Update the profilePicture field in the Firestore document with the new URL
            const newImageUrl = await getDownloadURL(newImageRef);
            await updateDoc(userDocRef, {
                profilePicture: newImageUrl
            });
            console.log("Profile picture URL updated successfully in Firestore");
        } catch (error) {
            console.error("Error replacing profile picture: ", error);
        }
    };

    return (<div className='dashboardContainer'>
        <HeaderCustomer user={ user } />
        <div className='profileContainer'>
            <img src={user.profilePicture} className='avatar' alt='avatar'/>
            <h3>Username:</h3>
            <h4>{user.name}</h4>
            <h3>Email:</h3>
            <h4>{user.email}</h4>
            <button onClick={editClick} className='editButton'>Edit</button>
            <br/>
            <h3>Payment Method</h3>
            <select value={paymentMethod} onChange={handlePaymentMethodChange}>
                    <option value="Cash">Cash</option>
                    <option value="Debit">Debit</option>
                    <option value="Credit">Credit</option>
                    <option value="GCash">GCash</option>
            </select>
        </div>
        {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                    <span className="close" onClick={closeModal}>&times;</span>
                    <h2>Edit Profile</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} />
                        <label>
                            Username:
                            <input type="text" name='username' defaultValue={user.name} />
                        </label>
                        <label>
                            Email:
                            <input type="email" name='email' defaultValue={user.email} />
                        </label>
                        {/* Add more form elements as needed */}
                        <button type="submit">Save</button>
                    </form>
                    </div>
                </div>
            )}
    </div>);
}

export default CustomerProfile;