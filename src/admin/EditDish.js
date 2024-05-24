import React, { useState } from 'react';
import AdminController from '../class/admin/AdminController';

const EditDish = ({ modalIsOpen, setModalIsOpen, dish }) => {
    const initialDish = {
        name: dish.name,
        menuType: dish.menuType,
        description: dish.description,
        price: dish.price, 
        photo: null
    }

    const [editedDish, setEditedDish] = useState({...initialDish})

    const handlePhotoChange = (e) => {
        //TODO: To all object accessing, add "?"
        const file = e?.target?.files[0];
        setEditedDish({...editedDish, photo: file})
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedDish = AdminController.createDish(name, menuType, description, price, photo);
            await updatedDish.saveToDatabase();
            setModalIsOpen(false);
        } catch (error) {
            console.error('Error updating dish:', error);
        }
    };

    return (
        modalIsOpen && (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={() => setModalIsOpen(false)}>&times;</span>
                    <h1>Edit Dish</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Dish Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setEditedDish({...editedDish, name: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="menuType">Menu Type</label>
                            <select
                                id="menuType"
                                value={menuType}
                                onChange={(e) => setEditedDish({...editedDish, menuType: e.target.value})}
                                required
                            >
                            {/* TODO: USE ENUM MENUTYPE INSTEAD OF HARDCODE */}
                                <option value="Meat">Meat</option>
                                <option value="Vegetarian">Vegetarian</option>
                                <option value="Dessert">Dessert</option>
                                <option value="Seafood">Seafood</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={description}
                                onChange={(e) => setEditedDish({...editedDish, description: e.target.value})}
                                required
                                rows="5"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">Price</label>
                            <input
                                type="text"
                                id="price"
                                name="price"
                                value={price}
                                onChange={(e) => setEditedDish({...editedDish, price: e.target.value})}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="photo" className="add-photo-label">
                                Add Photo
                            </label>
                            <input
                                type="file"
                                id="photo"
                                name="photo"
                                accept="image/*"
                                onChange={handlePhotoChange}
                            />
                        </div>
                        <button type="submit" className="update-button">
                            Update Dish
                        </button>
                    </form>
                </div>
            </div>
        )
    );
};

export default EditDish;
