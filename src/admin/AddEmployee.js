import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import '../css/Admin/UserManagement.css';

const UserManagement = ({ modalIsOpen, setModalIsOpen }) => {
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
      // Sort users by userType (staff first, customers last)
      usersData.sort((a, b) => {
        if (a.userType === 'staff' && b.userType !== 'staff') return -1;
        if (a.userType !== 'staff' && b.userType === 'staff') return 1;
        return 0;
      });
      setUsers(usersData);
    };
    if (modalIsOpen) {
      fetchUsers();
    }
  }, [modalIsOpen]);

  const handleAddEmployee = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { userType: 'staff' });
      setUsers(users.map(user => user.id === userId ? { ...user, userType: 'staff' } : user));
      console.log('User type updated to staff');
    } catch (error) {
      console.error('Error updating user type:', error);
    }
  };

  const handleRemoveEmployee = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { userType: 'customer' });
      setUsers(users.map(user => user.id === userId ? { ...user, userType: 'customer' } : user));
      console.log('User type updated to customer');
    } catch (error) {
      console.error('Error updating user type:', error);
    }
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
                      {user.userType === 'customer' && (
                        <button onClick={() => handleAddEmployee(user.id)}>Add Employee</button>
                      )}
                      {user.userType === 'staff' && (
                        <button onClick={() => handleRemoveEmployee(user.id)}>Remove Employee</button>
                      )}
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
