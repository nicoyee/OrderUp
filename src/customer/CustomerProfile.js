import "../css/Dashboard.css";
import "../css/Profile.css";
import Customer from "../class/Customer.ts";

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
        console.log("Fetched orders:", orders);

        orders.sort((a, b) => b.createdDate.seconds - a.createdDate.seconds);
        setUserOrders(orders);
      } catch (error) {
        console.error("Error fetching user orders:", error);
      }
    };

    fetchUserOrders();
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
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
      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);
      const userData = userDocSnapshot.data();
      const oldImageUrl = userData.profilePicture;

      if (
        oldImageUrl !==
        `https://ui-avatars.com/api/?name=${name}&background=random`
      ) {
        const oldImageRef = ref(storage, oldImageUrl);
        await deleteObject(oldImageRef);
        console.log("Old profile picture image deleted successfully");
      }

      const newImageRef = ref(
        storage,
        `/profile/${userId}/${newImageFile.name}`
      );
      await uploadBytes(newImageRef, newImageFile);
      console.log("New profile picture image uploaded successfully");

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
    if (timestamp && timestamp.seconds) {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
        return date.toLocaleString('en-US', {
            weekday: 'long', 
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true, 
        });
    }
    return 'N/A';
};


  return (
    <div className="dashboardContainer">
      <HeaderCustomer user={user} />

      <div className="big-rectangle">
        <div className="square left-square">
          <div
            className="back-button-profile"
            onClick={() => navigate("/dashboard")}
          >
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M14.71 5.71a.996.996 0 0 0-1.41 0L8.91 11.5H20c.55 0 1 .45 1 1s-.45 1-1-1H8.91l4.39 4.39a.996.996 0 1 0 1.41-1.41L6.71 12l6.71-6.71c.38-.38.38-1.02 0-1.41z" />
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
        <div className="square right-square">
          <h3>Order History</h3>
          <div className="inner-square">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>View</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{formatDate(order.createdDate)}</td>
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
        <div className="user-order-details-modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsViewModalOpen(false)}>&times;</span>
            <h1>Order Details</h1>
            <p>Date: {formatDate(selectedOrder.createdDate)}</p>
            <p>Reference Number: {selectedOrder.referenceNumber}</p>
            <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Price</th>
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(selectedOrder.items || {}).map(([itemId, item]) => (
                      <tr key={itemId}>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>₱{item.price}</td>
                        <td>{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className='status'>Status: {selectedOrder.status}</p>
                <p className="total">Total: ₱{calculateTotal(selectedOrder.items)}</p>
          </div>
        </div>
      )}
    </div>
  );
};
const calculateTotal = (items) => {
  let total = 0;
  Object.values(items || {}).forEach(item => {
    total += item.price * item.quantity;
  });
  return total.toFixed(2);
};
export default CustomerProfile;
