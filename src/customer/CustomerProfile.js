import "../css/Profile.css";
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./CustomerHeader";
import { UserContext } from "../App";
import OrderController from "../class/controllers/OrderController"; 
import PaymentController from "../class/controllers/PaymentController";

const CustomerProfile = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [balanceTransactions, setBalanceTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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

  const checkRemainingBalance = async () => {
    const userEmail = user.email;

    try {
      const transactions = await OrderController.fetchTransactions(userEmail);

      if (transactions.length === 0) {
        setErrorMessage("No balance found for this user.");
      } else {
        setBalanceTransactions(transactions);
        setShowModal(true);
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      setErrorMessage("An error occurred while fetching the balance.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const calculateTotal = (items) => {
    let total = 0;
    Object.values(items || {}).forEach(item => {
      total += item.price * item.quantity;
    });
    return total.toFixed(2);
  };

  const handlePay = async (transactionId) => {
    try {
      const userEmail = user.email; 
      const transactions = await OrderController.fetchTransactions(userEmail);
      const transactionToPay = transactions.find(t => t.id === transactionId);
      
      if (!transactionToPay) {
        console.error("Transaction not found for ID:", transactionId); 
        throw new Error("Transaction not found.");
      }

      if (transactionToPay.status === "paid") {
        throw new Error("This transaction is already paid.");
      }

      const amountInCents = transactionToPay.remainingBalance;
      const description = `Payment for Remaining Balance ID: ${transactionId}`;
      const paymentLink = await PaymentController.createPaymentLink(amountInCents, description, null);

      window.location.href = paymentLink;
    } catch (error) {
      console.error("Error processing payment:", error.message || error);
      setErrorMessage("Error processing payment. Please try again.");
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

  const handleCancelOrder = async () => {
    if (selectedOrder && selectedOrder.status === "pending") {
      try {
        setIsCancelling(true);
        await OrderController.requestCancellation(user.email, selectedOrder.referenceNumber);
        await OrderController.updateStatus(user.email, selectedOrder.referenceNumber, "cancellation-requested");
        alert("Cancellation request has been sent!");
        setIsCancelling(false);
        setIsViewModalOpen(false);
        
        // Update the order status in the userOrders state
        setUserOrders(prevOrders =>
          prevOrders.map(order =>
            order.referenceNumber === selectedOrder.referenceNumber
              ? { ...order, status: "cancellation-requested" }
              : order
          )
        );
      } catch (error) {
        console.error("Error requesting cancellation:", error);
        setErrorMessage("Failed to send cancellation request.");
        setIsCancelling(false);
      }
    } else if (selectedOrder && selectedOrder.status === "cancellation-requested") {
      alert("Cancellation request has already been sent for this order.");
    }
  };

  const handleRefundRequest = async () => {
    if (selectedOrder && selectedOrder.status === "downpayment-paid" && !isRequestingRefund) {
      try {
        setIsRequestingRefund(true);
        await OrderController.requestRefund(user.email, selectedOrder.referenceNumber);
        await OrderController.updateStatus(user.email, selectedOrder.referenceNumber, "refund-requested");
        alert("Refund request has been sent!");
        
        // Update the order status in the userOrders state
        setUserOrders(prevOrders =>
          prevOrders.map(order =>
            order.referenceNumber === selectedOrder.referenceNumber
              ? { ...order, status: "refund-requested" }
              : order
          )
        );

        setIsRequestingRefund(false);
        setIsViewModalOpen(false);
      } catch (error) {
        console.error("Error requesting refund:", error);
        setErrorMessage("Failed to send refund request.");
        setIsRequestingRefund(false);
      }
    } else if (selectedOrder && selectedOrder.status === "refund-requested") {
      alert("Refund request has already been sent for this order.");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="customer-profile">
      <Header />
      <div className="modal-content">
        <div className="profile-grid">
          <div className="left-grid">
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
              style={{ cursor: 'pointer'}}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <h3>{user.name}</h3>
            <h4>{user.email}</h4>
          </div>
          <div className="right-grid">
            <h3>Order History</h3>
            <div className="customer-table-history">
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
                    <tr key={order.referenceNumber}>
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
            <div className="remaining-balance-container">
              <button className="remaining-balance-button" onClick={checkRemainingBalance}>
                Check Remaining Balance
              </button>
            </div>
          </div>
        </div>

        {/* Modal to display remaining balance in a table */}
        {showModal && (
          <div className="check-remaining-balance-modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <h2>Remaining Balance</h2>
              {balanceTransactions.length > 0 ? (
                <table className="check-remaining-balance-table">
                  <thead>
                    <tr>
                      <th>Remaining Balance</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
            {balanceTransactions.map((transaction) => (
             <tr key={transaction.id}>
                <td>₱{transaction.remainingBalance}</td>
                      <td>{formatDate(transaction.createdDate)}</td>
                            <td>{transaction.status}</td>
                             <td>
                          {transaction.status === "paid" ? (
                           <span>(Paid)</span>
                       ) : transaction.status === "cancelled" ? (
                           <span>(Cancelled)</span>
                          ) : transaction.status === "refunded" ? (
                              <span>(Refunded)</span>
                                     ) : (
                                      <button
                          onClick={() => handlePay(transaction.id)}
                      disabled={transaction.status === "paid" || transaction.status === "cancelled" || transaction.status === "refunded"}
                                >
                              Pay
                       </button>
                          )}
                       </td>
                    </tr>
                   ))}
               </tbody>
                </table>
              ) : (
                <p className="error-message">No balance found for this user.</p>
              )}
            </div>
          </div>
        )}

        {/* Display error message */}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

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
              <p className="total">Total: ₱{calculateTotal(selectedOrder.items)}</p>
              {selectedOrder.status === "pending" && (
                <button
                  className="cancel-order-button"
                  onClick={handleCancelOrder}
                  disabled={isCancelling || selectedOrder.status === "cancellation-requested"}
                  style={{
                    backgroundColor: selectedOrder.status === "cancellation-requested" ? 'gray' : '',
                    cursor: selectedOrder.status === "cancellation-requested" ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isCancelling ? "Cancelling..." : "Cancel Order"}
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
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;