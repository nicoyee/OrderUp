import "../css/Dashboard.css";
import "../css/Profile.css";

import React, { useContext, useState, useEffect } from "react";
import HeaderCustomer from "./HeaderCustomer";
import { UserContext } from "../App";
import { db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CustomerProfile = () => {
  const user = useContext(UserContext);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // New state for payment modal
  const [remainingBalance, setRemainingBalance] = useState(null); // Balance state
  const [userOrders, setUserOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Set the user ID
      } else {
        console.log("User is null");
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch user orders
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

  // Fetch balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        if (!user) return;
        const balanceRef = doc(db, "Balance", user.email);
        const balanceSnapshot = await getDoc(balanceRef);
        if (balanceSnapshot.exists()) {
          setRemainingBalance(balanceSnapshot.data().remainingBalance.toFixed(2));
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Handle viewing orders
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handlePay = () => {
    // Placeholder for pay functionality
    console.log("Pay Now button clicked");
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.seconds) {
      return "Invalid date";
    }
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString(undefined, {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M14.71 5.71a.996.996 0 0 0-1.41 0L8.91 11.5H20c.55 0 1 .45 1 1s-.45 1-1-1H8.91l4.39 4.39a.996.996 0 1 0 1.41-1.41L6.71 12l6.71-6.71c.38-.38.38-1.02 0-1.41z" />
            </svg>
          </div>
          <img src={user.profilePicture} className="profile-picture" alt="avatar" />
          <h3>{user.name}</h3>
          <h4>{user.email}</h4>
          <button onClick={() => setIsModalOpen(true)} className="button">
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
                    <td>{formatDate(order.date)}</td>
                    <td>
                      <button onClick={() => handleViewOrder(order)}>View</button>
                    </td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Button to trigger payment modal if there is a remaining balance */}
      {remainingBalance && (
        <button onClick={() => setIsPaymentModalOpen(true)} className="button" style={{ marginTop: "20px" }}>
          Check Remaining Balance
        </button>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Remaining Balance</h3>
            <form>
              <label>
                Balance Due:
                <input type="text" value={`₱${remainingBalance}`} readOnly />
              </label>
              <button type="button" onClick={handlePay} className="button">
                Pay Now
              </button>
              <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="close-button">
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Order Modal */}
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

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="square modal-content">
          <span className="close" onClick={() => setIsModalOpen(false)}>
            &times;
          </span>
          <h2>Edit Profile</h2>
          <form>
            <input type="file" accept="image/png, image/jpeg" onChange={() => {}} />
            <label>
              Username:
              <input type="text" defaultValue={user.name} />
            </label>
            <button type="submit" className="button">
              Save
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;
