import React, { useState, useEffect } from 'react';
import Cart from '../class/Cart';
import { Dish } from '../class/Dish';
import '../css/CustomerMenu.css';

const CustomerMenu = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDishes = () => {
      Dish.getDishes()
        .then(querySnapshot => {
          const dishesData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setDishes(dishesData);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching dishes:', error);
          setLoading(false);
        });
    };

  fetchDishes();
  }, []);


  return (
    <div className="customer-menu">
      <h1 className="menu-title">Our Menu</h1>
      <div className="menu-items">
        {dishes.map(dish => (
          <div key={dish.id} className="menu-item">
            <div className="menu-item-image-container">
              <img src={dish.photoURL} alt={dish.name} className="menu-item-image" />
            </div>
            <div className="menu-item-details">
              <h3 className="menu-item-name">{dish.name}</h3>
              <p className="menu-item-description">{dish.description}</p>
              <p className="menu-item-price">Price: ${dish.price}</p>
              <button className="add-to-cart-btn" onClick={() => Cart.addToCart(dish.id)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerMenu;