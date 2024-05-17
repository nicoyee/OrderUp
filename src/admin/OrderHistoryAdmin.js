import '../css/authForms.css';
import '../css/DashboardComponents.css';
import '../css/Profile.css'

import React, { useEffect, useState } from 'react';
import { collection, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const OrderHistoryAdmin = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    
    useEffect(() => {
        const fetchOrders = async () => {
            const checkouts = collection(db, 'checkouts');
            const checkoutSnapshot = await getDocs(checkouts);
            const checkoutList = checkoutSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOrders(checkoutList);
        };

        fetchOrders();
    }, []);

    const openModal = (orderId) => {
        setSelectedOrderId(orderId);
    };

    const closeModal = () => {
        setSelectedOrderId(null);
    };

    return (
        <div className='menuTable'>
            <h1>User Orders</h1>
            <table className='dataTable'>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>View</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.displayName}</td>
                            <td>
                                <button onClick={() => openModal(order.id)}>View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedOrderId && (
                <Modal orderId={selectedOrderId} closeModal={closeModal} />
            )}
        </div>
    );
}

const Modal = ({ orderId, closeModal }) => {
    // Fetch the full order details based on orderId
    const [orderDetails, setOrderDetails] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const orderRef = doc(db, 'checkouts', orderId);
                const orderDoc = await getDoc(orderRef);
                if (orderDoc.exists()) {
                    setOrderDetails(orderDoc.data());
                } else {
                    console.error('Order not found');
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                {orderDetails && (
                    <div>
                        <p>Date: {orderDetails.date.toDate().toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}</p>
                        <p>Reference Number: {orderDetails.referenceNumber}</p>
                        <h3>Items:</h3>
                        <ul>
                            {Object.values(orderDetails.items).map(item => (
                                <li key={item.id}>
                                    <p>Name: {item.name}</p>
                                    <p>Description: {item.description}</p>
                                    <p>Price: ${item.price}</p>
                                    <p>Quantity: {item.quantity}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderHistoryAdmin;