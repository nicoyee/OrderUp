import React, { useState, useEffect } from 'react';
import Admin from '../class/admin/Admin';
import SignUp from '../auth/SignUp';
import '../css/Admin/ManageUsers.css'; // Import the CSS file
import '../css/Admin/StaffModal.css';

const ManageUsers = ({ modalIsOpen, setModalIsOpen }) => {
    const [users, setUsers] = useState([]);
    const [staffModalIsOpen, setStaffModalIsOpen] = useState(false);

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

    const handleViewOrderHistory = (userId) => {
        console.log('Viewing order history for user:', userId);
    };

    const handleSignUp = async (name, email, password, userType) => {
        try {
            await Admin.signUp(name, email, password, userType);
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
        </>
    );
};

export default ManageUsers;
