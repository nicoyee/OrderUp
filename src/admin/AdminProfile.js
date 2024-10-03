import "../css/Admin/AdminProfile.css";
import React, { useContext, useState, useEffect, useRef } from "react";
import HeaderAdmin from "./HeaderAdmin";
import { UserContext } from "../App";
import { storage, db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const AdminProfile = () => {
  const user = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({ unit: 'px', width: 200, height: 200, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [uid, setUid] = useState(null);
  const navigate = useNavigate();
  const imgRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const editClick = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setSrc(null);
    setCompletedCrop(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const newName = event.target.elements.username.value;
      if (newName !== user.name) {
        await updateProfile(uid, newName);
      }
      if (completedCrop && imgRef.current) {
        const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);
        await updateProfilePicture(uid, croppedImageBlob, newName);
      }
      window.location.reload();
    } catch (error) {
      console.error("Error handling submit: ", error);
    }
  };

  const updateProfile = async (userId, newName) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { name: newName });
      console.log("Username updated successfully in Firestore");
    } catch (error) {
      console.error("Error updating username: ", error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSrc(reader.result);
        setCrop({ unit: 'px', width: 200, height: 200, x: 0, y: 0 });
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext('2d');


    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 1);
    });
  };

  const updateProfilePicture = async (userId, imageBlob) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();
      const oldImageUrl = userData.profilePicture;

      if (oldImageUrl && !oldImageUrl.includes("ui-avatars.com")) {
        const oldImageRef = ref(storage, oldImageUrl);
        await deleteObject(oldImageRef).catch((error) => {
          if (error.code !== "storage/object-not-found") {
            throw error;
          }
        });
        console.log("Old profile picture deleted successfully");
      }

      const newImageRef = ref(storage, `profile/${userId}/${Date.now()}_profile.jpg`);
      await uploadBytes(newImageRef, imageBlob);
      console.log("New profile picture uploaded successfully");

      const newImageUrl = await getDownloadURL(newImageRef);
      await updateDoc(userDocRef, { profilePicture: newImageUrl });
      console.log("Profile picture URL updated successfully in Firestore");
    } catch (error) {
      console.error("Error updating profile picture: ", error);
      throw error;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-profile">
      <HeaderAdmin user={user} />
      <div className="modal-content">
        <div className="back-button-profile" onClick={() => navigate("/dashboard")}>
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
              style={{ cursor: 'pointer'}}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </a>
        </div>
        <img src={user.profilePicture} className="profile-picture" alt="avatar" />
        <h3>{user.name}</h3>
        <h4>{user.email}</h4>
        <button onClick={editClick} className="button">Edit</button>
      </div>
      {isModalOpen && (
        <div className="admin-edit-profile">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
              <input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} />
              {src && (
                <ReactCrop
                  src={src}
                  crop={crop}
                  onChange={(newCrop) => setCrop(newCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  circularCrop
                >
                  <div className="crop-image-container">
                    <img ref={imgRef} src={src} alt="Crop me" className="crop-image" style={{ maxWidth: '100%' }} />
                  </div>
                </ReactCrop>
              )}
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
