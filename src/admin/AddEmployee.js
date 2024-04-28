import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import '../css/Admin/AddEmployee.css';

const AddEmployee = ({ modalIsOpen, setModalIsOpen}) => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = [];
        querySnapshot.forEach((doc) => {
          const userData = { id: doc.id, ...doc.data() };
          // Only add user to the list if they are not admin
          if (userData.userType !== 'admin') {
            usersData.push(userData);
          }
        });
        setUsers(usersData);
    };

    if (modalIsOpen) {
      fetchUsers();
    }
  }, [modalIsOpen]);

  const handleUserSelection = (userId) => {
    const isSelected = selectedUsers.includes(userId);
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleMakeEmployee = async () => {
    try {
        const updatePromises = selectedUsers.map(userId => {
          return db.collection('users').doc(userId).update({ userType: 'staff' });
        });
        await Promise.all(updatePromises);
        setModalIsOpen(false);
      } catch (error) {
        console.error('Error making users employees:', error);
      }
  };

  const handleRemoveEmployee = async () => {
    try {
      const updatePromises = selectedUsers.map(userId => {
        return db.collection('users').doc(userId).update({ userType: 'customer' });
      });
      await Promise.all(updatePromises);
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error removing employees:', error);
    }
  };

  return (
    modalIsOpen && (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => setModalIsOpen(false)}>&times;</span>
          <h1>Manage Employee</h1>
          <div className="user-list">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelection(user.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="button-container">
            <button onClick={handleMakeEmployee} className="add-button">
              Add Employee
            </button>
            <button onClick={handleRemoveEmployee} className="remove-button">
              Remove Employee
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddEmployee;
