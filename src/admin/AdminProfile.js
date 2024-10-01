import "../css/Admin/AdminProfile.css";
import React, { useContext, useState, useEffect, useRef } from "react";
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
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const AdminProfile = () => {
  const user = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1, width: 100, unit: '%' });
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

      if (newName !== user.name || (completedCrop && imgRef.current)) {
        window.location.reload();
      }
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
      setCrop({ unit: '%', width: 100, aspect:1 });
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const size = Math.min(crop.width, crop.height);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      size * scaleX,
      size * scaleY,
      0,
      0,
      size,
      size
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const updateProfilePicture = async (userId, imageBlob, name) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();
      const oldImageUrl = userData.profilePicture;
  
      if (oldImageUrl && !oldImageUrl.includes("ui-avatars.com")) {
        const oldImageRef = ref(storage, oldImageUrl);
        await deleteObject(oldImageRef);
        console.log("Old profile picture deleted successfully");
      }
  
      const newImageRef = ref(storage, `/profile/${userId}/${Date.now()}_profile.jpg`);
      await uploadBytes(newImageRef, imageBlob);
      console.log("New profile picture uploaded successfully");
  
      const newImageUrl = await getDownloadURL(newImageRef);
      await updateDoc(userDocRef, { profilePicture: newImageUrl });
      console.log("Profile picture URL updated successfully in Firestore");
    } catch (error) {
      console.error("Error updating profile picture: ", error);
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
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={1}
                  circularCrop
                >
                  <div className="crop-image-container">
                  <img ref={imgRef} src={src} alt="Crop me" className="crop-image"/>
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