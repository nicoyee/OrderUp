import '../css/authForms.css';
import '../css/DashboardComponents.css';
import '../css/MenuTable.css';
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Dish } from '../class/Dish.js';
import Admin from '../class/admin/Admin.js';

const MenuAdmin = ({dishes, setDishes}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editRowIndex, setEditRowIndex] = useState(-1); // Track index of row being edited
  const [editedDishDetails, setEditedDishDetails] = useState({})
  const dishesPerPage = 10;

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'dishes'));
        const dishesData = [];
        querySnapshot.forEach((doc) => {
          dishesData.push({ id: doc.id, ...doc.data() });
        });
        setDishes(dishesData);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      }
    };

    fetchDishes();
  }, []);

  const indexOfLastDish = currentPage * dishesPerPage;
  const indexOfFirstDish = indexOfLastDish - dishesPerPage;
  const currentDishes = dishes.slice(indexOfFirstDish, indexOfLastDish);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (index) => {
    setEditRowIndex(index === editRowIndex ? -1 : index);
  };

  const handleConfirmEdit = async (index) => {
    try {
      const dishToUpdate = currentDishes[index];

      await Admin.updateDish(dishToUpdate.id, editedDishDetails);

      //TODO: Update dish details if successful.
      // currently, it only updates the data in firebase, 
      // but does the changes do not reflect in frontend
      setDishes((state)=>{
        const newState = JSON.parse(JSON.stringify(dishes))
        newState[index] = {
          ...newState[index],
          ...editedDishDetails
        }

        return newState
      })

    } catch (error) {
      console.error('Error updating dish:', error);
    }
    setEditedDishDetails({})
    // Exit edit mode
    setEditRowIndex(-1);
  };

  const handleCancelEdit = () => {
    // Exit edit mode
    setEditRowIndex(-1);
  };

  const handleDelete = async (id) => {
    console.log('Deleting dish with ID:', id);
    try {
      await Admin.deleteDish(id); // Use Admin.deleteDish instead of Dish.delete
      const newDishes = dishes.filter((dish) => dish.id !== id);
      setDishes(newDishes);
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  //TODO: Delete useless console.logs and useEffects
  useEffect(()=>{
    console.log("editedDishDetails", editedDishDetails)
  }, [editedDishDetails])

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
          {currentDishes.map((dish, index) => (
            <tr key={dish.id}>
              <td id='dataTableImage'><img src={dish.photoURL} alt={dish.name}/></td>
              <td>
                {editRowIndex === index 
                  ? <input 
                      type="text" 
                      id={`name_${index}`} 
                      defaultValue={dish.name} 
                      onChange={(event)=>{
                        setEditedDishDetails({
                          ...editedDishDetails,
                          name: event?.target?.value
                        })
                      }}  
                    /> 
                  : dish.name}
              </td>
              <td>
                {editRowIndex === index 
                  ? <input 
                      type="text" 
                      id={`menuType_${index}`} 
                      defaultValue={dish.menuType} 
                      onChange={(event)=>{
                        setEditedDishDetails({
                          ...editedDishDetails,
                          menuType: event?.target?.value
                        })
                      }}  
                    /> : dish.menuType}
              </td>
              <td>
                {editRowIndex === index ? <input type="text" id={`description_${index}`} defaultValue={dish.description} onChange={(event)=>{
                        setEditedDishDetails({
                          ...editedDishDetails,
                          description: event?.target?.value
                        })
                      }}  /> : dish.description}
              </td>
              <td>
                {editRowIndex === index ? <input type="text" id={`price_${index}`} defaultValue={dish.price} onChange={(event)=>{
                        setEditedDishDetails({
                          ...editedDishDetails,
                          price: event?.target?.value
                        })
                      }}  /> : dish.price}
              </td>
              <td className='actionBtns'>
                {editRowIndex === index ? (
                  <div>
                    <button className='editBtn' onClick={() => handleConfirmEdit(index)}>Confirm</button>
                    <button className='deleteBtn' onClick={() => handleCancelEdit()}>Cancel</button>
                  </div>
                ) : (
                  <div>
                    <button className='editBtn' onClick={() => handleEdit(index)}>Edit</button>
                    <button className='deleteBtn' onClick={() => handleDelete(dish.id)}>Delete</button>
                  </div>
                )}
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
