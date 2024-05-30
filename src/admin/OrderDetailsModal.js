import React from 'react';
import '../css/Admin/OrderDetailsModal.css';

const OrderDetailsModal = ({ order, closeModal }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                {order ? (
                    <div>
                        <div className="modal-header">
                            <h1>Order Details</h1>
                        </div>
                        <div className="order-details">
                            <p><strong>Date:</strong> {order.date.toDate().toLocaleString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                            })}</p>
                            <p><strong>Reference Number:</strong> {order.referenceNumber}</p>
                            <h3>Items:</h3>
                            <ul>
                                {Object.values(order.items).map((item, index) => (
                                    <li key={`${item.id}-${index}`}>
                                        <p><strong>Name:</strong> {item.name}</p>
                                        <p><strong>Description:</strong> {item.description}</p>
                                        <p><strong>Price:</strong> ${item.price}</p>
                                        <p><strong>Quantity:</strong> {item.quantity}</p>
                                    </li>
                                ))}
                            </ul>
                            <p><strong>Status:</strong> {order.status}</p>
                        </div>
                    </div>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default OrderDetailsModal;
