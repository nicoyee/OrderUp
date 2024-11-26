import "./css/CustomerProfileOrderInfo.css";

import React, { useContext, useState, useEffect } from "react";

import { UserContext } from "../App";
import OrderController from "../class/controllers/OrderController";

import StatusIndicator from "../common/UserStatusIndicator";

const CustomerProfileOrderInfo = ({ handleCloseOrder, handleCancelOrder, handleRefundRequest, order }) => {

    const user = useContext(UserContext);

    const [ userOrders, setUserOrders ] = useState([]);

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

    return (
        <div id='customerProfileOrderInfo' className="modal">

            <div className='modal-header'>
                <span>
                    <h1>Order Details</h1>
                    <svg
                        onClick={ handleCloseOrder }
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
                </span>

                <div className="modal-header-section">
                    <div className="modal-header-section-left orderStatus">
                        <h1>Status</h1>
                        <StatusIndicator status={order.status} />
                    </div>

                    <div className="modal-header-section-right">
                        <h1>Reference Number</h1>
                        <h2>{ order.referenceNumber }</h2>
                    </div>
                </div>

                <div className="modal-header-section">
                    <div className="modal-header-section-left">
                        <h1>Date Created</h1>
                        <h2>{formatDate(order.createdDate)}</h2>
                    </div>
                    <div className="modal-header-section-right">
                        <h1>Total</h1>
                        <h2 className="currency">₱ {calculateTotal(order.items)}</h2>
                    </div>
                    
                </div>

            </div>

            <div className="orderInfo-header">
                <div className="orderInfo-header-quantity">
                    <h1>Qty</h1>
                </div>
                <div className="orderInfo-header-name">
                    <h1>Name</h1>
                </div>
                <div className="orderInfo-header-description">
                    <h1>Description</h1>
                </div>
                <div className="orderInfo-header-price">
                    <h1>Price</h1>
                </div>
            </div>

            <div className='orderInfo'>      
                {Object.entries(order.items || {}).map(([itemId, item]) => (
                    <div className="orderInfo-item" key={itemId}>
                    
                        <div className="orderInfo-item-quantity">
                            <h1>{item.quantity}</h1>
                        </div>
                        <div className="orderInfo-item-name">
                            <h1>{item.name}</h1>
                        </div>
                        <div className="orderInfo-item-description">
                            <h1>{item.description}</h1>
                        </div>
                        <div className="orderInfo-item-price">
                            <h1>₱{item.price}</h1>
                        </div>
                        
                    </div>
                ))}
            </div>

            <div className="modal-footer">
                {order.status === "pending" && (
                    <button
                        className='modalButton primary'
                        onClick={ () => handleCancelOrder(order) }
                    >
                        Cancel Order
                    </button>
                )}
                {order.status === "downpayment-paid" && (
                    <button
                        className='modalButton primary'
                        onClick={ () => handleRefundRequest(order) }
                    >
                        Request Refund
                    </button>
                )}
            </div>
            
        </div>
    );
    
};

export default CustomerProfileOrderInfo;