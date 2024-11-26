import "./css/AdminUsers.css";

import { FaUserPlus } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { FaBan } from "react-icons/fa";
import { FaList } from "react-icons/fa6";

import React, { useEffect, useState, useContext } from 'react';
import Modal from 'react-modal';

import Admin from '../class/admin/Admin';
import { UserType } from '../constants';

import StatusIndicator from "../common/UserStatusIndicator";
import OrderHistory from "./AdminUsersOrderHistory";
import SignUp from '../auth/SignUp';

const AdminUsers = () => {

    const [ users, setUsers ] = useState([]);
    const [ selectedUserType, setSelectedUserType ] = useState('all');
    const [ orderHistoryModal, showOrderHistoryModal ] = useState(false);
    const [ createStaffModal, showCreateStaffModal ] = useState(false);
    const [ selectedUser, setSelectedUser ] = useState(null);

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

    const filteredUsers = users.filter(user => {
        if (selectedUserType === 'all') return true;
        return user.userType === selectedUserType;
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

    const handleTabClick = (content) => {
        setSelectedUserType(content);
    };

    const viewOrderHistory = (user) => {
        setSelectedUser(user);
        showOrderHistoryModal(true);
        document.body.classList.add('modal-open');
    };

    const closeOrderHistory = () => {
        setSelectedUser(null);
        showOrderHistoryModal(false);
        document.body.classList.remove('modal-open');
    };

    const viewCreateStaff = () => {
        showCreateStaffModal(true);
        document.body.classList.add('modal-open');
    };

    const closeCreateStaff = () => {
        showCreateStaffModal(false);
        document.body.classList.remove('modal-open');
    };

    return (
        <div id="adminUsers" className="dashboard-content">

            <div className="dashboard-section">

                <div className="userInfo admin">
                    <div className="userInfo-left">
                        <span className="vertical">
                            <h1>Dashboard</h1>
                            <h3>Users</h3>
                        </span>
                    </div>
                    <div className="userInfo-right">
                        <button 
                            className="primaryButton icon"
                            onClick={ viewCreateStaff }
                        >
                            <FaUserPlus /> 
                            Create Staff
                        </button>
                    </div>
                    
                </div>
                
            </div>

            <div className="dashboard-section">

                <div className="dataCard table">
                    <div className="dataCard-header">
                        <div className="dataCard-header-section">
                            <div className="dataCard-header-left">
                                <h1>User Details</h1>
                            </div>
                            <div className="dataCard-header-right">
                                <div className="dataCard-tab">
                                    <button className={ selectedUserType === 'all' ? 'active' : ''} onClick={() => handleTabClick('all')} >All</button>
                                    <button className={ selectedUserType === 'customer' ? 'active' : ''} onClick={() => handleTabClick('customer')} >Customer</button>
                                    <button className={ selectedUserType === 'staff' ? 'active' : ''} onClick={() => handleTabClick('staff')} >Staff</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="dataCard-content full">
                        <table>
                            <thead>
                                <tr>
                                    <th>UID</th>
                                    <th>Email</th>
                                    <th>User Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                            { filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td className="refNum">{ user.id }</td>
                                    <td>{ user.email }</td>
                                    <td><StatusIndicator status={ user.userType } /></td>
                                    <td>
                                        { user.banned ? (
                                            <StatusIndicator status={ "banned" } />
                                        ) : (
                                            <div className="tableCell">
                                            { user.userType === UserType.CUSTOMER && (
                                                <button 
                                                    className="secondaryButton tooltip" 
                                                    onClick={() => viewOrderHistory(user)}
                                                >
                                                    <span>View Order History</span>
                                                    <FaList />
                                                </button>
                                            )}
                                                <button 
                                                    className="secondaryButton tooltip red" 
                                                    onClick={() => handleBanUser(user.id)}
                                                >
                                                    <span>Ban User</span>
                                                    <FaBan />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <Modal
               isOpen={ createStaffModal }
               onRequestClose={ closeCreateStaff }
               className={`${ createStaffModal ? 'modal-open' : '' }`}
               overlayClassName="modalOverlay" 
            >
                <SignUp
                    isStaffSignUp={true}
                    closeModal = { closeCreateStaff }
                />
            </Modal>

            <Modal
               isOpen={ orderHistoryModal }
               onRequestClose={ closeOrderHistory }
               className={`${ orderHistoryModal ? 'modal-open' : '' }`}
               overlayClassName="modalOverlay" 
            >
                { selectedUser && (
                    <OrderHistory 
                        closeOrderHistory = { closeOrderHistory }
                        selectedUser = { selectedUser }
                    />
                )}
            </Modal>

        </div>
    );

};

export default AdminUsers;