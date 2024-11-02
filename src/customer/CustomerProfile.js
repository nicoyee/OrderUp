import "./css/CustomerProfile.css";
import "../common/css/Data.css";
import '../common/css/Modal.css';
import { FaBox } from "react-icons/fa6";

import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';

import { UserContext } from "../App";
import OrderController from "../class/controllers/OrderController"; 
import PaymentController from "../class/controllers/PaymentController";

import Header from "./CustomerHeader";

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
      
      <div className="customerProfile-wrapper">
        <div className="customerProfile-container">

          <div className="userInfo">
            <div className="userInfo-left">
              <h1>Welcome Back, <span>{user.name}</span></h1>
              <h2>{user.email}</h2>
            </div>
            <div className="userInfo-right">
              <button>Reset Password</button>
            </div>
          </div>

          <div className="userOrders dataCard">
            <div className="dataCard-header">
              <div className="dataCard-header-left">
                <FaBox />
                <h1>My Orders</h1>
              </div>
            </div>

            <div className="dataCard-table-full">
              <table>
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                {userOrders.map((order) => (
                  <tr key={order.referenceNumber} onClick={() => handleViewOrder(order)}>
                    <td>{order.referenceNumber}</td>
                    <td>{formatDate(order.createdDate)}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
                </tbody>

              </table>
            </div>

            <div className="dataCard-footer">

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;