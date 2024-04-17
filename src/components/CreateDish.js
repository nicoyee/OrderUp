import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import '../css/CreateDish.css';

const CreateDishModal = ({ closeModal }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState(null);

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
    !!closeModal && (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <h2>ADD A DISH TO YOUR MENU</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Photo/Browse Photo:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </div>
            {photo && <img src={URL.createObjectURL(photo)} alt="Preview" />}
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Price:</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <button type="submit">Add</button>
          </form>
        </div>
      </div>
    )
  );
};

export default CreateDishModal;
