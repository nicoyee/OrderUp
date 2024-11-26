import "./css/AdminUsers.css";
import '../css/Admin/ManageUsers.css';

import React, { useState, useEffect } from 'react';

import SignUp from '../../auth/SignUp';
import OrderDetailsModal from './OrderDetailsModal';

import Admin from '../../class/admin/Admin';
import AuthController from '../../class/controllers/AuthController';
import { UserType } from '../../constants';

const AdminUsers = () => {

    const [users, setUsers] = useState([]);
    const [staffModalIsOpen, setStaffModalIsOpen] = useState(false);
    const [orderHistoryModalIsOpen, setOrderHistoryModalIsOpen] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
 
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await Admin.fetchUsers();
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const sortedUsers = users.sort((a, b) => {
        if (a.userType === UserType.STAFF && b.userType !== UserType.STAFF) return -1;
        if (a.userType !== UserType.STAFF && b.userType === UserType.STAFF) return 1;
        return 0;
    });

    const handleBanUser = async (userId) => {
        const isConfirmed = window.confirm("Are you sure you want to ban this user?");
    
        if (!isConfirmed) {
            return; 
        }
        try {
            await Admin.banUser(userId);
            setUsers(users.filter(user => user.id !== userId));
            console.log('User banned successfully');
        } catch (error) {
            console.error('Error banning user:', error);
        }
    };

    const handleViewOrderHistory = async (user) => {
        try {
            const orders = await Admin.fetchOrderHistory(user);
            setOrderHistory(orders);
            setSelectedUser(user);
            setOrderHistoryModalIsOpen(true);
        } catch (error) {
            console.error('Error fetching order history:', error);
        }
    };

    const closeOrderHistoryModal = () => {
        setOrderHistoryModalIsOpen(false);
        setOrderHistory([]);
        setSelectedUser(null);
    };

    const openOrderDetailsModal = (order) => {
        setSelectedOrder(order);
    };

    const closeOrderDetailsModal = () => {
        setSelectedOrder(null);
    };

    return (
        <div id="adminUsers">

            <div className="sectionContainer">

                <div className="userInfo admin">
                    <div className="userInfo-top">
                        <div className="userInfo-left">
                            <h1>Dashboard</h1>
                            <h3>Users</h3>
                        </div>
                        <div className="userInfo-right">

                        </div>
                    </div>
                </div> 

            </div>

            <div className="sectionContainer">
                <div className="dataCard table">
                    <div className="dataCard-header">
                        <div className="dataCard-header-left">
                            <h1>User Details</h1>
                        </div>
                    </div>

                    <div className="dataCard-section">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>User Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {sortedUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.userType}</td>
                                        <td>
                                            {user.banned ? (
                                                <span className="banned-label">Banned</span>
                                            ) : (
                                                <>
                                                    <button className="ban-button" onClick={() => handleBanUser(user.id)}>Ban</button>
                                                    {user.userType === UserType.CUSTOMER && (
                                                        <button className="view-order-history-button" onClick={() => handleViewOrderHistory(user.email)}>View Order History</button>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            
                        </table>
                    </div>
                
                </div>
            </div>

            {orderHistoryModalIsOpen && (
                <div className="order-history-modal">
                    <div className="modal-content">
                        <span className='close' onClick={closeOrderHistoryModal}>&times;</span>
                        <div className="modal-header">
                            <h1>Order History:</h1>
                        </div>
                        <div className="order-list">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderHistory.length > 0 ? (
                                        orderHistory.map((order) => (
                                            <tr key={order.referenceNumber}>
                                                <td>{order.referenceNumber}</td>
                                                <td>
                                                    <button onClick={() => openOrderDetailsModal(order)}>View</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr key="no-orders">
                                            <td colSpan="2">No orders found for this user.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    closeModal={closeOrderDetailsModal}
                />
            )}


        </div>
    );

};

export default AdminUsers;