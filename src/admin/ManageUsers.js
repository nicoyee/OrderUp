import React, { useState, useEffect } from 'react';
import SignUp from '../auth/SignUp';
import '../css/Admin/ManageUsers.css';
import { UserType } from '../constants';
import AdminController from '../class/admin/AdminController';

const ManageUsers = ({ modalIsOpen, setModalIsOpen }) => {
    const [users, setUsers] = useState([]);
    const [staffModalIsOpen, setStaffModalIsOpen] = useState(false);
    const [orderHistoryModalIsOpen, setOrderHistoryModalIsOpen] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await AdminController.fetchUsers();
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        if (modalIsOpen) {
            fetchUsers();
        }
    }, [modalIsOpen]);

    const openStaffModal = () => {
        setStaffModalIsOpen(true);
    };

    const closeStaffModal = () => {
        setStaffModalIsOpen(false);
    };

    const handleBanUser = async (userId) => {
        try {
            await AdminController.banUser(userId);
            setUsers(users.filter(user => user.id !== userId));
            console.log('User banned successfully');
        } catch (error) {
            console.error('Error banning user:', error);
        }
    };

    const handleViewOrderHistory = async (userId) => {
        try {
            const orders = await AdminController.fetchOrderHistory(userId);
            setOrderHistory(orders);
            setSelectedUser(userId);
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


    const handleSignUp = async (name, email, password) => {
        try {
            await AdminController.signUpStaff(name, email, password, UserType.STAFF);

            console.log("User successfully signed up as staff!");
            setStaffModalIsOpen(false);
        } catch (error) {
            console.error("Error signing up user:", error);
        }
    };

    return (
        <>
            {modalIsOpen && (
                <div className="manage-users-modal">
                    <div className='modal-content'>
                        <span className='close' onClick={() => setModalIsOpen(false)}>&times;</span>
                        <div className="modal-header">
                            <h1>Manage Users</h1>
                        </div>
                        <div className="user-list">
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
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.userType}</td>
                                            <td>
                                                <button className="ban-button" onClick={() => handleBanUser(user.id)}>Ban</button>
                                                <button className="view-order-history-button" onClick={() => handleViewOrderHistory(user.id)}>View Order History</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="button-container">
                            <button className="add-employee-button" onClick={openStaffModal}>Add Employee</button>
                        </div>
                    </div>
                </div>
            )}

            {staffModalIsOpen && (
                <div className="staff-modal">
                    <SignUp handleSignUp={handleSignUp} closeModal={closeStaffModal} isStaffSignUp={true} userType="staff" />
                </div>
            )}

            {orderHistoryModalIsOpen && (
                <div className="order-history-modal">
                    <div className="modal-content">
                        <span className='close' onClick={closeOrderHistoryModal}>&times;</span>
                        <div className="modal-header">
                            <h1>Order History</h1>
                        </div>
                        <div className="order-list">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Date</th>
                                        <th>Total</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderHistory.map((order) => (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>{new Date(order.date).toLocaleString()}</td>
                                            <td>{order.total}</td>
                                            <td>{JSON.stringify(order.details)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ManageUsers;
