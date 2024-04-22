import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import '../css/authForms.css'

const CreateDishModal = ({ closeModal }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState(null);
  const [menuType, setMenuType] = useState('Meat');

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let photoURL = '';
      if (photo) {
        const storageRef = ref(storage, 'dishes/' + photo.name); // Specify path to "dishes" folder
        await uploadBytes(storageRef, photo);
        photoURL = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'dishes'), {
        name,
        description,
        price: parseFloat(price),
        photoURL,
        menuType
      });

      setName('');
      setDescription('');
      setPrice('');
      setPhoto(null);
      closeModal();
    } catch (error) {
      console.error('Error adding dish:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <h1>ADD A DISH TO YOUR MENU</h1>
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
            <label htmlFor="menuType">Menu Type</label>
            <select
              id="menuType"
              value={menuType}
              onChange={(e) => setMenuType(e.target.value)}
              required
            >
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
  );
};

export default CreateDishModal;