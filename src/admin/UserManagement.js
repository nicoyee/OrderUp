import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import '../css/Admin/UserManagement.css';

const UserManagement = ({ modalIsOpen, setModalIsOpen}) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = [];
      querySnapshot.forEach((doc) => {
        const userData = { id: doc.id, ...doc.data() };
        if (userData.userType !== 'admin') {
          usersData.push(userData);
        }
      });
      // Sort users by userType (admins first, staff second, customers last)
      
      usersData.sort((a, b) => {
        if (a.userType === 'staff' && b.userType !== 'staff') return -1;
        if (a.userType !== 'staff' && b.userType === 'staff') return 1;
        return 0;
      });
      setUsers(usersData);
    };
    if(modalIsOpen){
      fetchUsers();
    }
  }, [modalIsOpen]);

  const handleBanUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(user => user.id !== userId));
      console.log('User banned successfully');
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  const handleViewOrderHistory = (userId) => {
    // Implement view order history functionality here
    console.log('Viewing order history for user:', userId);
  };

  return (
    modalIsOpen && (
      <div className="modal">
        <div className='modal-content'>
          <span className='close' onClick={() => setModalIsOpen(false)}> &times;</span>
          <h1>User Management</h1>
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
                          <button onClick={() => handleBanUser(user.id)}>Ban</button>
                          <button onClick={() => handleViewOrderHistory(user.id)}>View Order History</button>
                      </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        </div>
      </div>    
    )
  );
};

export default UserManagement;
