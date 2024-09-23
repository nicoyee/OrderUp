import "../css/Dashboard.css";
import "../css/Profile.css";

import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderCustomer from "./HeaderCustomer";
import { UserContext } from "../App";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import PaymentController from "../class/controllers/PaymentController";

const CustomerProfile = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [remainingBalance, setRemainingBalance] = useState(null);
  const [paymentLink, setPaymentLink] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [balanceStatus, setBalanceStatus] = useState("Paid");
  
  useEffect(() => {
    // const auth = getAuth();
    // const unsubscribe = onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     setUid(user.uid);
    //   } else {
    //     // If user is null, you can perform any cleanup or redirect logic here
    //     // For now, just log that the user is null
    //     console.log("User is null");
    //     navigate("/");
    //   }
    // });
    // return () => unsubscribe();
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

  // Listen for balance updates
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "Balance", user.email), (doc) => {
      if (doc.exists()) {
        const balanceData = doc.data();
        const balanceAmount = balanceData.remainingBalance;
        setRemainingBalance(balanceAmount.toFixed(2));

        const status = balanceData.status || (balanceAmount > 0 ? "Pending" : "Paid");
        setBalanceStatus(status);

        if (balanceAmount > 0 && status === "unpaid") {
          PaymentController.createPaymentLink(balanceAmount, "Remaining balance for your order", "Balance Payment")
            .then((generatedLink) => {
              setPaymentLink(generatedLink);
            })
            .catch((error) => {
              console.error("Error creating payment link:", error);
              setPaymentLink(null);
            });
        } else {
          setPaymentLink(null);
        }
      } else {
        setRemainingBalance(null);
        setPaymentLink(null);
        setBalanceStatus("Paid");
      }
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Handle viewing orders
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  // Handle Pay Now button click
  const handlePay = () => {
    if (paymentLink) {
      window.location.href = paymentLink;
    } else {
      console.error("Payment link is not available.");
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

      {/* Back Icon */}
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
        className="back-icon"
        onClick={() => navigate("/dashboard")}
        style={{ cursor: 'pointer', position: 'absolute', top: '10px', left: '10px', zIndex: 1 }}
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>

      <div className="big-rectangle">
        <div className="square left-square">
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
                    <td>{formatDate(order.createdDate)}</td>
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

      {/* Check Remaining Balance Button */}
      <button onClick={() => setIsPaymentModalOpen(true)} className="button" style={{ marginTop: "20px" }}>
        Check Remaining Balance
      </button>

      {isPaymentModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="modal-close"
              viewBox="0 0 24 24"
              onClick={() => setIsPaymentModalOpen(false)}
              width="20"
              height="20"
              style={{ fill: 'white' }}
            >
              <line x1="18" y1="6" x2="6" y2="18" stroke="white" strokeWidth="2" />
              <line x1="6" y1="6" x2="18" y2="18" stroke="white" strokeWidth="2" />
            </svg>
            <div className="modal-content">
              <h3>Remaining Balance</h3>
              <form>
                <label>
                  Balance Due:
                  <input type="text" value={`₱${remainingBalance}`} readOnly className="small-input" />
                </label>
                <label>
                  Status:
                  <input type="text" value={balanceStatus} readOnly className="small-input" />
                </label>
                {remainingBalance > 0 && (
                  <button type="button" onClick={handlePay} className="button">
                    Pay Now
                  </button>
                )}
              </form>
            </div>
          </div>
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

      {isModalOpen && (
        <div className="square modal-content">
          <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
          <h2>Edit Profile</h2>
          <form>
            <input type="file" accept="image/png, image/jpeg" onChange={() => {}} />
            <label>
              Username:
              <input type="text" defaultValue={user.name} />
            </label>
            <button type="submit" className="button">Save</button>
          </form>
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
