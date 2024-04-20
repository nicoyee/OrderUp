import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import '../css/Menu.css';

const Menu = () => {
  const [dishes, setDishes] = useState([]);
  const [cart, setCart] = useState([]);

  const addToCart = (id, price, name, photoURL) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === id);
      if (existingItem) {
        return prevCart.map((item) => (item.id === id? {...item, quantity: item.quantity + 1 } : item));
      } else {
        return [...prevCart, { id, price, name, photoURL, quantity: 1 }];
      }
    });
  };

  const setQuantity = (id, quantity) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === id);
      if (existingItem) {
        return prevCart.map((item) => (item.id === id? {...item, quantity } : item));
      } else {
        return prevCart;
      }
    });
  };

  return (
    <div className="menu-container">
      {dishes.map((dish) => (
        <div className="menu-card" key={dish.id}>
          <img src={dish.photoURL} alt={dish.name} className="menu-card-img" />
          <div className="menu-card-info">
            <h3 className="menu-card-name">{dish.name}</h3>
            <p className="menu-card-description">{dish.description}</p>
            <p className="menu-card-price">${dish.price}</p>
            <div className="menu-card-quantity">
              <button onClick={() => setQuantity(dish.id, dish.quantity - 1)}>-</button>
              <span>{dish.quantity}</span>
              <button onClick={() => setQuantity(dish.id, dish.quantity + 1)}>+</button>
            </div>
            <button className="menu-card-add-to-cart" onClick={() => addToCart(dish.id, dish.price, dish.name, dish.photoURL)}>
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Menu;