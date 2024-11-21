import "./css/CustomerProfile.css";

import { FaBox } from "react-icons/fa6";

import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';

import { UserContext } from "../../App";
import OrderController from "../../class/controllers/OrderController"; 
import PaymentController from "../../class/controllers/PaymentController";

import Header from "../CustomerHeader";

const CustomerProfile = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [ modal, showModal ] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRequestingRefund, setIsRequestingRefund] = useState(false);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        if (!user) return;
        const orders = await OrderController.viewHistory(user.email);
        orders.sort((a, b) => b.createdDate.seconds - a.createdDate.seconds);
        setUserOrders(orders);
      } catch (error) {
        console.error("Error fetching user orders:", error);
      }
    };
    fetchUserOrders();
  }, [user]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    showModal(true);
    document.body.classList.add('modal-open');
  };

  const closeModal = () => {
    setSelectedOrder(null);
    showModal(false);
    document.body.classList.remove('modal-open');
  }

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

  const calculateTotal = (items) => {
    let total = 0;
    Object.values(items || {}).forEach(item => {
      total += item.price * item.quantity;
    });
    return total.toFixed(2);
  };

  const handleRefundRequest = async () => {
    if (selectedOrder && selectedOrder.status === "downpayment-paid" && !isRequestingRefund) {
      
    } else if (selectedOrder && selectedOrder.status === "refund-requested") {
      
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div id="customerProfile">

      <Header />

      <Modal
        isOpen={ modal }
        onRequestClose={ closeModal }
        className={`orderInfoModal ${ modal ? 'modal-open' : '' }`}
        overlayClassName="modalOverlay"
      >
        {selectedOrder && (
          <div id='orderInfoProfile' className="modalTable">
            <div className='modalTable-header'>
              <div className='modalTable-header-label'>
                <h1>Order Details</h1>
                <svg
                  onClick={closeModal}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </div>

              <div className='modalTable-header-info'>
                <h2>Reference #: {selectedOrder.referenceNumber}</h2>
                <h3>{formatDate(selectedOrder.createdDate)}</h3>
              </div>
              
          </div>

          <div className='modalTable-body'>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Qty</th>
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
          </div>

          <div className="modalTable-footer">
            <div className="orderInfo-total">
              <h1>Total:</h1>
              <h2>₱{calculateTotal(selectedOrder.items)}</h2>
            </div>

            <div className="orderInfo-actions">
              {selectedOrder.status === "pending" && (
                <button
                  className="cancel-request-button"
                >
                  Cancel Order
                </button>
              )}
              {selectedOrder.status === "downpayment-paid" && (
                <button
                  className="refund-request-button"
                  onClick={handleRefundRequest}
                  disabled={isRequestingRefund || selectedOrder.status === "refund-requested"}
                  style={{
                    backgroundColor: selectedOrder.status === "refund-requested" ? 'gray' : '',
                    cursor: selectedOrder.status === "refund-requested" ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isRequestingRefund ? "Requesting..." : "Request Refund"}
                </button>
              )}
            </div>
            
          </div>

          </div>
        )}
      </Modal>
      
      <div className="customerProfile-container">
        <div className="userInfo">
          <a
            onClick={() => navigate("/dashboard")}
          >
            <h3>Back To Dashboard</h3>
          </a>
          <h1>{user.name}</h1>
          <h2>{user.email}</h2>
        </div>

        <div className="userOrders">

          <div className="dataCard">

            <div className="dataCard-header">
              <div className="dataCard-header-left">
                <FaBox />
                <h1>My Orders</h1>
              </div>
              
            </div>

            <div className="dataCard-section">

            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userOrders.map((order) => (
                  <tr key={order.referenceNumber} onClick={() => handleViewOrder(order)}>
                    <td>{formatDate(order.createdDate)}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            </div>

          </div>      

        </div>
      </div>

    </div>
  );
};

export default CustomerProfile;