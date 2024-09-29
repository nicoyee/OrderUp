import "../css/Admin/AdminProfile.css";

import React, { useContext, useState, useEffect } from "react";
import HeaderAdmin from "./HeaderAdmin";
import { UserContext } from "../App";
import { storage, db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const user = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [uid, setUid] = useState(null);
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState("cash");

  useEffect(() => {
    const auth = getAuth();
    console.log(user);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        console.log(user);
      } else {
        // If user is null, you can perform any cleanup or redirect logic here
        // For now, just log that the user is null
        console.log("User is null");
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return <div>Loading...</div>; // or any other placeholder or redirect logic
  }

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

      // Update username if it is changed
      if (newName !== user.name) {
        await updateProfile(uid, newName);
      }

      if (image) {
        await updateProfilePicture(uid, image, newName);
      }

      if (newName !== user.name || image) {
        window.location.reload();
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
      });
      console.log("Username updated successfully in Firestore");
    } catch (error) {
      console.error("Error updating username and email: ", error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handlePaymentChange = (event) => {
    setPaymentType(event.target.value);
  };

  const handleGcashImage = (e) => {
    if (e.target.files[0]) {
      setGcashImage(uid, e.target.files[0], user.name);
    }
  };

  const setGcashImage = async (userId, newImageFile, name) => {
    try {
      // Step 1: Upload the new GCash image to Firebase Storage in the "gcash" folder

      const newImageRef = ref(storage, `/gcash/${newImageFile.name}`);
      await uploadBytes(newImageRef, newImageFile);
      const newImageUrl = await getDownloadURL(newImageRef);
      await uploadBytes(newImageRef, newImageFile);
      console.log("New GCash image uploaded successfully");

      // Create or update the Firestore document in the "gcash" collection
      const gcashDocRef = doc(db, "qr_code", "gcash");
      const gcashDocSnapshot = await getDoc(gcashDocRef);
      if (gcashDocSnapshot.exists()) {
        // Update the existing document with the new image details
        await updateDoc(gcashDocRef, {
          filename: newImageFile.name,
          imageUrl: newImageUrl,
        });
        console.log("GCash image details updated successfully in Firestore");
      } else {
        // Create a new document with the new image details
        await setDoc(gcashDocRef, {
          filename: newImageFile.name,
          imageUrl: newImageUrl,
        });
        console.log("GCash document created successfully in Firestore");
      }
      console.log("GCash image URL updated successfully in Firestore");
    } catch (error) {
      console.error("Error setting GCash image: ", error);
    }
  };

  const updateProfilePicture = async (userId, newImageFile, name) => {
    try {
      // Step 1: Fetch the old profile picture image URL from Firestore
      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();
      const oldImageUrl = userData.profilePicture;

      // Step 2: Delete the old profile picture image from Firebase Storage
      if (
        oldImageUrl !==
        `https://ui-avatars.com/api/?name=${name}&background=random`
      ) {
        const oldImageRef = ref(storage, oldImageUrl);
        await deleteObject(oldImageRef);
        console.log("Old profile picture image deleted successfully");
      }

      // Step 3: Upload the new profile picture image to Firebase Storage
      const newImageRef = ref(
        storage,
        `/profile/${userId}/${newImageFile.name}`
      );
      await uploadBytes(newImageRef, newImageFile);
      console.log("New profile picture image uploaded successfully");

      // Step 4: Update the profilePicture field in the Firestore document with the new URL
      const newImageUrl = await getDownloadURL(newImageRef);
      await updateDoc(userDocRef, {
        profilePicture: newImageUrl,
      });
      console.log("Profile picture URL updated successfully in Firestore");
    } catch (error) {
      console.error("Error replacing profile picture: ", error);
    }
  };

  return (
    <div className="admin-profile">
      <HeaderAdmin user={user} />

      <div className="modal-content">
        <div
          className="back-button-profile"
          onClick={() => navigate("/dashboard")}
        >
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="back-button-profile"
              onClick={() => navigate("/dashboard")}
              style={{ cursor: 'pointer'}}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </a>
        </div>
        <img
          src={user.profilePicture}
          className="profile-picture"
          alt="avatar"
        />
        <h3>{user.name}</h3>
        <h4>{user.email}</h4>
        <button onClick={editClick} className="button">
          Edit
        </button>
      </div>
      {isModalOpen && (
        <div className="admin-edit-profile">
          <div className="modal-content">
          <span className="close" onClick={closeModal}>
            &times;
          </span>
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
            />
            <label>
              Username:
              <input type="text" name="username" defaultValue={user.name} />
            </label>
            <div>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      </div>
      )}
    </div>
  );
};

export default AdminProfile;
