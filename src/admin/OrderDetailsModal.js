import React from 'react';
import '../css/Admin/OrderDetailsModal.css';

const OrderDetailsModal = ({ order, closeModal }) => {
  if (!order) {
    return (
      <div className="order-details-modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <p>Loading...</p>
        </div>
      </div>
    );
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

  return (
    <div className="order-details-modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <div>
          <h1>Order Details</h1>
          <p>Date: {formatDate(order.createdDate)}</p>
          <p>Reference Number: {order.referenceNumber}</p>
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
              {Object.entries(order.items || {}).map(([itemId, item]) => (
                <tr key={itemId}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>₱{item.price}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="total">Total: ₱{order.totalAmount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
