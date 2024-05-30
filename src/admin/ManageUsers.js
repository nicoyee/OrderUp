import '../css/common/dashboardComponents.css';
import '../css/common/dataTable.css';

import React, { useState, useEffect } from 'react';
import SignUp from '../auth/SignUp';
import { UserType } from '../constants';
import Admin from '../class/admin/Admin';

const ManageUsers = ({ setModalCreateEmployee }) => {
    const [users, setUsers] = useState([]);
    const [staffModalIsOpen, setStaffModalIsOpen] = useState(false);
    const [orderHistoryModalIsOpen, setOrderHistoryModalIsOpen] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

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

    const handleBanUser = async (userId) => {
        try {
            await Admin.banUser(userId);
            setUsers(users.filter(user => user.id !== userId));
            console.log('User banned successfully');
        } catch (error) {
            console.error('Error banning user:', error);
        }
    };

    const handleViewOrderHistory = async (userId) => {
        try {
            const orders = await Admin.fetchOrderHistory(userId);
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
            await Admin.signUpStaff(name, email, password, UserType.STAFF); // Passing UserType.STAFF here
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

    return (
        <div className='sectionContent'>

            <div className='sectionContent-header'>
                <h1>Users</h1>
                <div className='sectionContent-header-actions'>
                <button onClick={ setModalCreateEmployee }>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus-box</title><path d="M17,13H13V17H11V13H7V11H11V7H13V11H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" /></svg>
                    Add Employee
                </button>
                </div>
            </div>
            
            <div className='dataTable-container'>
                <table className='dataTable'>
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
                                    <div className='dataTable-actions'>
                                        <button className='dataTable-actions-ban' onClick={() => handleBanUser(user.id)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account-off</title><path d="M12,4A4,4 0 0,1 16,8C16,9.95 14.6,11.58 12.75,11.93L8.07,7.25C8.42,5.4 10.05,4 12,4M12.28,14L18.28,20L20,21.72L18.73,23L15.73,20H4V18C4,16.16 6.5,14.61 9.87,14.14L2.78,7.05L4.05,5.78L12.28,14M20,18V19.18L15.14,14.32C18,14.93 20,16.35 20,18Z" /></svg></button>
                                        <button onClick={() => handleViewOrderHistory(user.id)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>history</title><path d="M13.5,8H12V13L16.28,15.54L17,14.33L13.5,12.25V8M13,3A9,9 0 0,0 4,12H1L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3" /></svg></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            

        </div>
    );
};

export default ManageUsers;
