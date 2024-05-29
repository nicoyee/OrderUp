import "../css/Dashboard.css";
import "../css/Profile.css";

import React, { useContext, useState, useEffect } from "react";
import HeaderCustomer from "./HeaderCustomer";
import { UserContext } from "../App";
import { storage, db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  doc,
  updateDoc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CustomerProfile = () => {
  const user = useContext(UserContext);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [uid, setUid] = useState(null);
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState("cash");
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        // If user is null, you can perform any cleanup or redirect logic here
        // For now, just log that the user is null
        console.log("User is null");
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        if (!user) return;
        const ordersRef = collection(db, "Orders", user.email, "orders");
        const snapshot = await getDocs(ordersRef);
        const orders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserOrders(orders);
      } catch (error) {
        console.error("Error fetching user orders:", error);
      }
    };

    fetchUserOrders();
  }, [user]);

  if (!user) {
    return <div>Loading...</div>; // or any other placeholder or redirect logic
  }
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
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

      // Update username if it is changed
      if (newName !== user.name) {
        await updateProfile(uid, newName);
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
        email: newEmail,
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

  const handlePaymentChange = (event) => {
    setPaymentType(event.target.value);
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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="dashboardContainer">
      <HeaderCustomer user={user} />

      <div class="big-rectangle">
        <div class="square left-square">
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
        <div class="square right-square">
          <h3>Order History</h3>
          <div class="inner-square">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>View</th>
                  <th>status</th>
                </tr>
              </thead>
              <tbody>
                {userOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{formatDate(order.date)}</td>
                    <td>
                      <button onClick={() => handleViewOrder(order)}>
                        View
                      </button>
                    </td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="square modal-content">
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
            <label>
              Select Option:
              <select value={paymentType} onChange={handlePaymentChange}>
                <option value="option1">Cash</option>
                <option value="option2">Debit</option>
                <option value="option3">GCash</option>
              </select>
            </label>
            <div>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      )}
      {isViewModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Order Details</h2>
            <p>Date: {formatDate(selectedOrder.date)}</p>
            <p>Reference Order: {selectedOrder.referenceNumber}</p>
            <ul className="item-list">
              {Object.values(selectedOrder.items).map((item, index) => (
                <li key={index}>
                  {item.name} - Quantity: {item.quantity} - Price: {item.price}
                </li>
              ))}
            </ul>
            <button onClick={() => setIsViewModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;
