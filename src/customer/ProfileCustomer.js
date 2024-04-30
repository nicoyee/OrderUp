import '../css/DashboardCustomer.css';
import '../css/Dashboard.css';
import '../css/Profile.css'

import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../App';
import HeaderCustomer from './HeaderCustomer';
import { storage, db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";


const ProfileCustomer = () => {

    const user = useContext(UserContext);
    const [image, setImage] = useState(null);
    const [uid, setUid] = useState(null);

    useEffect(() => {
        const auth = getAuth();
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

      const updateProfilePicture = async (userId, newImageFile) => {
        try {
            
            // Step 1: Fetch the old profile picture image URL from Firestore
            const userDocRef = doc(db, "users", userId);
            const userDocSnapshot = await getDoc(userDocRef);
            const userData = userDocSnapshot.data();
            const oldImageUrl = userData.profilePicture;

    
            // Step 2: Delete the old profile picture image from Firebase Storage
            if(oldImageUrl !== 'https://ui-avatars.com/api/?name=ben&background=random'){
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
     

    const handleSubmit = async () => {
        try {
            await updateProfilePicture(uid, image);
            
            

        } catch (error) {
            console.error("Error handling submit: ", error);
        }
    };
    

    return (
        <div className='dashboardContainer'>
            <HeaderCustomer user={ user } />

            <div className='profileContent'>
                    <div className="profileCard">
                        <div className="profileCardText">
                        <img src={user.profilePicture} alt='avatar'/>
                        <input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} />
                        <button onClick={handleSubmit}>Submit</button>
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