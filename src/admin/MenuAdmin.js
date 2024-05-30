import '../css/common/modals.css';
import '../css/common/dashboardComponents.css';
import '../css/common/dataTable.css';

import React, { useState, useEffect } from 'react';

import Admin from '../class/admin/Admin.js';

const MenuAdmin = ({setModalCreateDish}) => {

  const [ dishes, setDishes ] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [editRowIndex, setEditRowIndex] = useState(-1); // Track index of row being edited
  const [editedDishDetails, setEditedDishDetails] = useState({})
  const dishesPerPage = 10;

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const dishesData = await Admin.getDishes().then((res)=>{
          return res?.docs?.map((doc)=> {
            return {
              id: doc.id,
            ...doc.data()
            }
          })
        })
        
        setDishes(dishesData);
      } catch (error) {
        console.error('Error fetching dishes:', error);
      }
    };
    fetchDishes();
  }, []);

  const indexOfLastDish = currentPage * dishesPerPage;
  const indexOfFirstDish = indexOfLastDish - dishesPerPage;
  const currentDishes = dishes?.slice(indexOfFirstDish, indexOfLastDish);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (index) => {
    setEditRowIndex(index === editRowIndex ? -1 : index);
  };

  const handleConfirmEdit = async (index) => {
    try {
      const dishToUpdate = currentDishes[index];

      await Admin.editDish(dishToUpdate.id, editedDishDetails);

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
      const newDishes = dishes?.filter((dish) => dish.id !== id);
      setDishes(newDishes);
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  return (
    <div className='sectionContent'>
      <div className='sectionContent-header'>
          <h1>Menu</h1>
          <div className='sectionContent-header-actions'>
            <button onClick={setModalCreateDish}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>plus-box</title><path d="M17,13H13V17H11V13H7V11H11V7H13V11H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" /></svg>
                Add Dish
            </button>
          </div>
      </div>

      <div className='dataTable-container'>
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
                <td className='dataTable-img-sm'><img src={dish.photoURL} alt={dish.name}/></td>
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
                <td>
                  {editRowIndex === index ? (
                    <div className='dataTable-actions'>
                      <button className='dataTable-actions-confirm' onClick={() => handleConfirmEdit(index)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check-bold</title><path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" /></svg></button>
                      <button onClick={() => handleCancelEdit()}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>close-thick</title><path d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z" /></svg></button>
                    </div>
                  ) : (
                    <div className='dataTable-actions'>
                      <button onClick={() => handleEdit(index)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg></button>
                      <button className='dataTable-actions-delete' onClick={() => handleDelete(dish.id)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>delete</title><path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" /></svg></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MenuAdmin;