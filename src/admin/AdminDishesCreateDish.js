import React, { useState } from 'react';
import { toast, Flip } from 'react-toastify';

import Admin from '../class/admin/Admin';
import { MenuType } from '../constants';

const AdminDishesCreateDish = ({ closeCreateDish, setDishes }) => {
    
    const [ name, setName ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ menuType, setMenuType ] = useState('Meat');
    const [ price, setPrice ] = useState('');
    const [ photo, setPhoto ] = useState(null);

    const handleCreateDish = async (e) => {
        e.preventDefault();

        const numericPrice = parseFloat(price) || 0;

        try {
            const newDish = await Admin.createDish(name, menuType, description, numericPrice, photo);
            setDishes((prevDishes) => [...prevDishes, newDish]);
            closeCreateDish();
        } catch (error) {
            console.error('Error creating dish:', error);
        }
    };

    return (
        <form id="adminDishesCreateDish" className="modal form" onSubmit={ handleCreateDish }>

            <div className='modal-header'>
                <span>
                    <h1>Create New Dish</h1>
                    <svg
                        onClick={ closeCreateDish }
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
                <h2>Create a new dish</h2>
            </div>

            <div className="modal-body">
                <div className="modal-body-section vertical">
                    <label>Name</label>
                    <input 
                        type = "text" 
                        placeholder = "Enter dish Name" 
                        value = { name } 
                        onChange={(e)=>setName(e.target.value)}
                        required
                    />
                </div>
                <div className="modal-body-section vertical">
                    <label>Description</label>
                    <textarea 
                        type = "text"
                        name = "description"  
                        value = { description } 
                        placeholder = "Enter dish Description"
                        onChange={(e)=>setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="modal-body-section vertical">
                    <label>Menu Type</label>
                    <select
                        name = " menuType " 
                        value = { menuType } 
                        onChange={(e) => setMenuType(e.target.value)}
                        required
                    >
                        <option value={ MenuType.MEAT }>{ MenuType.MEAT }</option>
                        <option value={ MenuType.VEGETARIAN }>{ MenuType.VEGETARIAN }</option>
                        <option value={ MenuType.DESSERT }>{ MenuType.DESSERT }</option>
                        <option value={ MenuType.SEAFOOD }>{ MenuType.SEAFOOD }</option>
                        <option value={ MenuType.FOODPACKAGE }>{ MenuType.FOODPACKAGE }</option>
                        <option value={ MenuType.BEVERAGES }>{ MenuType.BEVERAGES }</option>
                    </select>
                </div>
                <div className="modal-body-section">
                    <div className="modal-body-section vertical">
                        <label>Price</label>
                        <input 
                            type = "number"
                            name = "price" 
                            value = { price } 
                            placeholder = "Enter dish Price" 
                            onChange={(e)=>setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div className="modal-body-section vertical">
                        <label>Photo</label>
                        <input 
                            type = "file" 
                            name = "photoURL"
                            onChange={(e) => setPhoto(e.target.files[0])}
                            required
                        />
                    </div>
                </div>
                <div className="modal-body-section">
                    <button
                        type="submit"
                        className="modalButton primary submit"
                    >
                        Create Dish
                    </button>
                </div>
            </div>

            <div className="modal-footer">

            </div>

        </form>
    );
};

export default AdminDishesCreateDish;
