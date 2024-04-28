import '../css/authForms.css';
import '../css/DashboardComponents.css';

import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

import CreateDish from './CreateDish';

const MenuAdmin = () => {
  const [dishes, setDishes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dishesPerPage = 10;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState('createDish');
  const [dishToEdit, setDishToEdit] = useState(null);

  useEffect(() => {
    const fetchDishes = async () => {
      const querySnapshot = await getDocs(collection(db, 'dishes'));
      const dishesData = [];
      querySnapshot.forEach((doc) => {
        dishesData.push({ id: doc.id, ...doc.data() });
      });
      setDishes(dishesData);
    };

    fetchDishes();
  }, []);

  const indexOfLastDish = currentPage * dishesPerPage;
  const indexOfFirstDish = indexOfLastDish - dishesPerPage;
  const currentDishes = dishes.slice(indexOfFirstDish, indexOfLastDish);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (dish) => {
    setModalContent('editDish');
    setDishToEdit(dish);
    setModalIsOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'dishes', id));
      const newDishes = dishes.filter((dish) => dish.id !== id);
      setDishes(newDishes);
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const setCreateDishModal = () => {
    setModalContent('createDish');
    setModalIsOpen(true);
  };

  return (
    <div className='menuTable'>
      <h1>Menu</h1>
      <table className='dataTable'>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentDishes.map((dish) => (
            <tr key={dish.id}>
              <td id='dataTableImage'><img src={dish.photoURL} alt={dish.name}/></td>
              <td>{dish.name}</td>
              <td>{dish.menuType}</td>
              <td>{dish.description}</td>
              <td>{dish.price}</td>
              <td>
                <button onClick={() => handleEdit(dish)}>Edit</button>
                <button onClick={() => handleDelete(dish.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {dishes.length > dishesPerPage && (
          <div>
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
            {Array.from({ length: Math.ceil(dishes.length / dishesPerPage) }, (_, i) => (
              <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(dishes.length / dishesPerPage)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuAdmin;
