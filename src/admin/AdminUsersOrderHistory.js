import "./css/AdminUsersOrderHistory.css";

import { CgEye } from "react-icons/cg";

import React, { useContext, useState, useEffect } from "react";
import Modal from 'react-modal';

import Admin from '../class/admin/Admin';

import OrderDetails from "./AdminUsersOrderDetails";

const AdminUsersOrderHistory = ({ closeOrderHistory, selectedUser }) => {

    const [ orderHistory, setOrderHistory ] = useState([]);
    const [ selectedOrder, setSelectedOrder ] = useState(null);
    const [ orderDetailsModal, showOrderDetailsModal ] = useState(false);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            if (!selectedUser) return;
            try {
                const orders = await Admin.fetchOrderHistory(selectedUser.email);
                setOrderHistory(orders);
            } catch (error) {
                console.error('Error fetching order history:', error);
            }
        };

        fetchOrderHistory();

    }, [selectedUser]);

    const openOrderDetailsModal = (order) => {
        setSelectedOrder(order);
        showOrderDetailsModal(true);
        document.body.classList.add('modal-open');
    };

    const closeOrderDetailsModal = () => {
        setSelectedOrder(null);
        showOrderDetailsModal(false);
        document.body.classList.remove('modal-open');
    };

    return (
        <div id='adminUsersOrderHistory' className="modal">

            <div className='modal-header'>
                <span>
                    <h1>Order History</h1>
                    <svg
                        onClick={ closeOrderHistory }
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
                <h2>UID: { selectedUser.id }</h2>

                <div className="modal-header-section">
                    <h1>Email</h1>
                    <h2>{ selectedUser.email }</h2>
                </div>
            </div>

            <div className="orderHistory-header">
                <div className="orderHistory-ref">
                    <h1>Ref#</h1>
                </div>
                <div className="orderHistory-action">
                    <h1>Action</h1>
                </div>
            </div>

            <div className='orderHistory'>      
            { orderHistory.length > 0 ? (

                orderHistory.map((order) => (

                    <div 
                        className="orderHistory-item" 
                        key={order.referenceNumber}
                        onClick={() => openOrderDetailsModal(order)}
                    >

                        <div className="orderHistory-ref">
                            <h1>{ order.referenceNumber }</h1>
                        </div>
                        <div className="orderHistory-action">
                            <button className="secondaryButton">
                                <CgEye  />
                            </button>
                        </div>

                    </div>

                ))

            ) : (
                <div className="dataCard-content info">
                    <p>No orders found for this user</p>
                </div>
            )}
            </div>

            <Modal
               isOpen={ orderDetailsModal }
               onRequestClose={ closeOrderDetailsModal }
               className={`${ orderDetailsModal ? 'modal-open' : '' }`}
               overlayClassName="modalOverlay" 
            >
            { selectedOrder && (
                <OrderDetails
                    order = { selectedOrder }
                    closeOrderDetailsModal = { closeOrderDetailsModal }
                />
            )}
            </Modal>
            
        </div>
    );
    
};

export default AdminUsersOrderHistory;