import React, { useEffect, useState } from "react";
import Admin from "../class/admin/Admin";

const OrderHistoryAdmin = () => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [orderIds, setOrderIds] = useState([]);

  useEffect(() => {
    const fetchOrderIds = async () => {
      try {
        const allOrders = await Admin.getCustomerOrders(); // Using OrderController function
        console.log("Fetched Orders:", allOrders); 
        setOrderIds(allOrders);
      } catch (error) {
        console.error("Error fetching order IDs:", error);
      }
    };

    fetchOrderIds();
  }, []);

  const openModal = async (orderId, documentId) => {
    if (documentId) {
      console.log("Opening modal for Order ID:", orderId, "Document ID:", documentId);
      setSelectedOrderId(orderId);
      setSelectedDocumentId(documentId);
    } else {
      console.error("Document ID not yet available");
    }
  };

  const closeModal = () => {
    setSelectedOrderId(null);
    setSelectedDocumentId(null);
  };

  const handleStatusChange = async (orderId, documentId, newStatus) => {
    try {
      await Admin.updateCustomerOrderStatus(orderId, documentId, newStatus); // Using OrderController function
      console.log("Order status updated successfully.");
      setOrderIds((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId && order.documentId === documentId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };


  return (
    <div className="menuTable">
      <h1>User Orders</h1>
      <table className="dataTableHistory">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>View</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orderIds.map((order) => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.createdBy || 'Unknown Customer'}</td>
              <td>
                <button
                  onClick={() => openModal(order.orderId, order.documentId)}
                >
                  View
                </button>
              </td>
              <td>
                <select
                  value={order.status} // Set the default value to the status
                  onChange={(e) =>
                    handleStatusChange(
                      order.orderId,
                      order.documentId,
                      e.target.value
                    )
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="downpayment-paid">Downpayment Paid</option>
                  <option value="order-processed">Order Processed</option>
                  <option value="full-payment-paid">Full Payment Paid</option>
                  <option value="delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedOrderId && selectedDocumentId && (
        <Modal
          orderId={selectedOrderId}
          closeModal={closeModal}
          documentId={selectedDocumentId}
        />
      )}
    </div>
  );
};

const Modal = ({ orderId, closeModal, documentId }) => {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        console.log("Fetching details for Order ID:", orderId, "Document ID:", documentId);
        const orderData = await Admin.getOrderDetails(documentId, orderId); // Using OrderController function
        console.log("Fetched Order Details:", orderData);
        setOrderDetails(orderData);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId, documentId]);
  if (!orderDetails) {
    return (
      <div className="order-details-modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-details-modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <div>
          <h1>Order Details</h1>
          <p>Date: {orderDetails.date ? new Date(orderDetails.date.seconds * 1000).toLocaleString('en-US') : 'N/A'}</p>
          <p>Reference Number: {orderDetails.referenceNumber}</p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(orderDetails.items || {}).map((item, index) => (
                <tr key={`${item.id}-${index}`}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>${item.price}</td>
                  <td>{item.quantity}</td>
                  <td>{orderDetails.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="total">Total: ${calculateTotal(orderDetails.items)}</p>
        </div>
      </div>
    </div>
  );
};

const calculateTotal = (items) => {
  let total = 0;
  Object.values(items || {}).forEach((item) => {
    total += item.price * item.quantity;
  });
  return total.toFixed(2);
};

export default OrderHistoryAdmin;
