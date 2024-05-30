import React, { useState, useEffect } from 'react';
import SignUp from '../auth/SignUp';
import '../css/Admin/ManageUsers.css';
import { UserType } from '../constants';
import Admin from '../class/admin/Admin';

const ManageUsers = ({ modalIsOpen, setModalIsOpen }) => {
    const [users, setUsers] = useState([]);
    const [staffModalIsOpen, setStaffModalIsOpen] = useState(false);
    const [orderHistoryModalIsOpen, setOrderHistoryModalIsOpen] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null); // Changed to store full order details

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await Admin.fetchUsers();
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
            console.log('Fetched orders:', orders); // Add logging
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


    const handleSignUp = async (name, email, password) => {
        try {
            await Admin.signUpStaff(name, email, password, UserType.STAFF);
            console.log("User successfully signed up as staff!");
            setStaffModalIsOpen(false);
        } catch (error) {
            console.error("Error signing up user:", error);
        }
    };

    const sortedUsers = users.sort((a, b) => {
        if (a.userType === UserType.STAFF && b.userType !== UserType.STAFF) return -1;
        if (a.userType !== UserType.STAFF && b.userType === UserType.STAFF) return 1;
        return 0;
    });
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
      
        return (
          <div className="order-details-modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <div>
                <h1>Order Details</h1>
                <p>Date: {order.date ? new Date(order.date.seconds * 1000).toLocaleString('en-US') : 'N/A'}</p>
                <p>Reference Number: {order.referenceNumber}</p>
                <h3>Items:</h3>
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
                    {Object.values(order.items || {}).map((item, index) => (
                      <tr key={`${item.id}-${index}`}>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>${item.price}</td>
                        <td>{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="total">Total: ${calculateTotal(order.items)}</p>
              </div>
            </div>
          </div>
        );
      };
      
      // Helper function to calculate the total price
      const calculateTotal = (items) => {
        let total = 0;
        Object.values(items || {}).forEach(item => {
          total += item.price * item.quantity;
        });
        return total.toFixed(2);
      };

    const openOrderDetailsModal = (order) => {
        setSelectedOrder(order);
    };

    const closeOrderDetailsModal = () => {
        setSelectedOrder(null);
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
                                    {sortedUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.userType}</td>
                                            <td>
                                                <button className="ban-button" onClick={() => handleBanUser(user.id)}>Ban</button>
                                                {user.userType === UserType.CUSTOMER && (
                                                    <button className="view-order-history-button" onClick={() => handleViewOrderHistory(user.email)}>View Order History</button>
                                                )}
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
                            <h1>Order History for {selectedUser ? selectedUser.name : ''}</h1>
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
                                            <tr key={order.id}>
                                                <td>{order.id}</td>
                                                <td>
                                                    <button onClick={() => openOrderDetailsModal(order)}>View</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
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
        </>
    );
};

export default ManageUsers;
