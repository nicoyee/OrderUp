import '../css/common/modals.css';
import './adminModal.css';

import React, { useState } from 'react';

import { MenuType } from '../constants';
import Admin from '../class/admin/Admin';

const CreateDish = ({ closeModal }) => {
  const [name, setName] = useState('');
  const [menuType, setMenuType] = useState('Meat');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [price, setPrice] = useState('');

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await Admin.createDish(name, menuType, description, price, photo); // Call the createDish function from Admin
        // Update dishes state after creating the dish
        // setDishes([...dishes, newDish]);
        setName('');
        setDescription('');
        setPrice('');
        setPhoto(null);
        closeModal();
    } catch (error) {
        console.error('Error creating dish:', error);
    }
};

  return (
    <form id='createDish' className="modalForm" onSubmit={ handleSubmit }>
        <div className='modalForm-header'>
          <span>
            <h1>Create A Dish</h1>
            <svg
                onClick={closeModal}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            </span>
        </div>
        <div className='adminForm-body'>
          <div className='adminForm-section'>
            <label>Dish Name</label>
            <div className='adminForm-input'>
              <input type="text" placeholder="Enter dish name" value = { name } onChange={(e)=>setName(e.target.value)}/>
            </div>
          </div>
          <div className='adminForm-section'>
            <label>Category</label>
            <select
                id="menuType"
                value={menuType}
                onChange={(e) => setMenuType(e.target.value)}
                required
              >
                <option value={MenuType.MEAT}>{MenuType.MEAT}</option>
                <option value={MenuType.VEGETARIAN}>{MenuType.VEGETARIAN}</option>
                <option value={MenuType.DESSERT}>{MenuType.DESSERT}</option>
                <option value={MenuType.SEAFOOD}>{MenuType.SEAFOOD}</option>
            </select>
          </div>
          <div className='adminForm-section'>
            <label>Description</label>
            <textarea placeholder="Enter description" value={ description } onChange={(e)=>setDescription(e.target.value)}></textarea>
          </div>
          <div className='adminForm-section'>
            <label>Price</label>
            <div className='adminForm-input'>
              <input type="text" placeholder="Enter dish price" value={ price } onChange={(e) => setPrice(e.target.value)}/>
            </div>
          </div>
          <div className='adminForm-section'>
            <label>Photo</label>
            <input id="file" type="file" accept="image/*" onChange={handlePhotoChange} />
          </div>

          <button className="adminForm-submit">Add Dish to Menu</button>

        </div>
    </form>
  
  );
};

export default CreateDish;
