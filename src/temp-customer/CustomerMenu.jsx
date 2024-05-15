import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; // Assuming you have initialized Firebase and exported 'auth'
import { collection,setDoc, getDocs,getDoc, addDoc, updateDoc, doc } from 'firebase/firestore';
import '../css/CustomerMenu.css';

const CustomerMenu = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'dishes'));
        const dishesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDishes(dishesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dishes:', error);
        setLoading(false);
      }
    };

    fetchDishes();
  }, []);

  const addToCart = async (dishId) => {
    try {
      const user = auth.currentUser; // Get the currently authenticated user
      if (!user) {
        throw new Error('User not authenticated.');
      }
  
      const dishRef = doc(db, 'dishes', dishId);
      const dishDoc = await getDoc(dishRef);
  
      if (dishDoc.exists()) {
        const dishData = dishDoc.data();
  
        const cartRef = doc(db, 'cart', user.email); // Use user's email as cart document ID
        const cartDoc = await getDoc(cartRef);
  
        if (cartDoc.exists()) {
          // Cart document exists for the user, update the cart item or add new item
          const cartData = cartDoc.data();
          const cartItems = cartData.items || {};
  
          if (cartItems[dishId]) {
            // Increment quantity if the dish is already in the cart
            cartItems[dishId].quantity += 1;
          } else {
            // Add new dish to cart with initial quantity of 1
            cartItems[dishId] = {
              name: dishData.name,
              description: dishData.description,
              price: dishData.price,
              quantity: 1
            };
          }
  
          // Update the cart document with updated cart items
          await updateDoc(cartRef, { items: cartItems });
        } else {
          // Cart document doesn't exist, create a new cart document for the user
          const newCartItems = {
            [dishId]: {
              name: dishData.name,
              description: dishData.description,
              price: dishData.price,
              quantity: 1
            }
          };
  
          await setDoc(cartRef, { items: newCartItems });
        }
  
        alert('Item added to cart!');
      } else {
        alert('Dish not found.');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('Failed to add item to cart. See console for details.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

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
              <button className="add-to-cart-btn" onClick={() => addToCart(dish.id)}>
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