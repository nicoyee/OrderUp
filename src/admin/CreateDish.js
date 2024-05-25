import React, { useState } from 'react';
import Admin from '../class/admin/Admin';
import { MenuType } from '../constants';

const CreateDish = ({ setDishes, modalIsOpen, setModalIsOpen }) => {
  const [name, setName] = useState('');
  //TODO do not hardcode State
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
      const newDish = await Admin.createDish(name, menuType, description, price, photo);

      //TODO: DECIDE how to sort dishes, by name? by created date?
      setDishes((state)=>{
        return [newDish, ...state]
      })
      setName('');
      setDescription('');
      setPrice('');
      setPhoto(null);
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error creating dish:', error);
    }
  };

  return (
    modalIsOpen && (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => setModalIsOpen(false)}>&times;</span>
          <h1>Create a Dish</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Dish Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="menuType">Menu Type</label>
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
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                onChange={(e) => setPrice(e.target.value)}
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
                required
              />
            </div>
            <button type="submit" className="add-button">
              Add Dish
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default CreateDish;
