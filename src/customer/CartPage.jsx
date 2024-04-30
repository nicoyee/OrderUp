import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { getDoc, doc, updateDoc, deleteField, getFirestore } from "firebase/firestore";
import firebase from 'firebase/compat/app';
import '../css/CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError('User not authenticated.');
          return;
        }

        const cartRef = doc(db, 'cart', user.email);
        const cartDoc = await getDoc(cartRef);

        if (cartDoc.exists()) {
          const cartData = cartDoc.data();
          setCartItems(cartData.items || {});
        } else {
          setError('Cart not found.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const handleQuantityChange = (dishId, newQuantity) => {
    setCartItems((prevCartItems) => {
      const updatedCartItems = { ...prevCartItems };
      updatedCartItems[dishId].quantity = newQuantity;
      return updatedCartItems;
    });

    // Update quantity in database
    const user = auth.currentUser;
    const cartRef = doc(db, 'cart', user.email);
    updateDoc(cartRef, {
      items: { [dishId]: { quantity: newQuantity } },
    });
  };

  const handleRemoveItem = async (dishId) => {
    try {
      const user = auth.currentUser;
      const cartRef = doc(db, 'cart', user.email);
      const cartDoc = await getDoc(cartRef);
  
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        let updatedItems = cartData.items || [];
  
        // Find the item index by matching with the dishId
        const indexToRemove = updatedItems.findIndex(item => item.id === dishId);
  
        if (indexToRemove !== -1) {
          // Remove the item from the array
          updatedItems.splice(indexToRemove, 1);
  
          // Update the cart document in Firestore
          await updateDoc(cartRef, {
            items: updatedItems,
          });
        } else {
          // If item not found in cart, display error message
          alert('Item not found in cart.');
        }
      } else {
        // If cart document doesn't exist, display error message
        alert('Cart not found.');
      }
    } catch (error) {
      console.error("Error removing item:", error);
      // Display error message
      alert('Error removing item from cart. Please try again later.');
    }
  };

  const handleSelectItem = (dishId) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = new Set(prevSelectedItems);
      if (updatedSelectedItems.has(dishId)) {
        updatedSelectedItems.delete(dishId);
      } else {
        updatedSelectedItems.add(dishId);
      }
      return updatedSelectedItems;
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedItems(new Set(Object.keys(cartItems)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleDeleteSelectedItems = async () => {
    try {
      const user = auth.currentUser;
      const cartRef = doc(db, 'cart', user.email);

      // Filter out selected items from cartItems
      const updatedCartItems = Object.fromEntries(
        Object.entries(cartItems).filter(
          ([dishId]) => !selectedItems.has(dishId)
        )
      );

      // Update cartItems state and database
      await updateDoc(cartRef, {
        items: updatedCartItems,
      });

      // Update local state
      setCartItems(updatedCartItems);
      setSelectedItems(new Set());
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="cart-container">
      <div className="back-button" onClick={() => window.history.back()}>
      <a href="/dashboard">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
          >
            <path d="M14.71 5.71a.996.996 0 0 0-1.41 0L8.91 11.5H20c.55 0 1 .45 1 1s-.45 1-1 1H8.91l4.39 4.39a.996.996 0 1 0 1.41-1.41L6.71 12l6.71-6.71c.38-.38.38-1.02 0-1.41z" />
          </svg>
        </a>
      </div>
      <h1>Cart</h1>
      <form>
        <div className="select-all-container">
          <input
            type="checkbox"
            checked={selectedItems.size === Object.keys(cartItems).length}
            onChange={handleSelectAll}
          />
          <label htmlFor="select-all">Select all</label>
        </div>
        <ul>
          {Object.keys(cartItems).map((dishId) => (
            <li key={dishId} className="cart-item">
              <input
                type="checkbox"
                checked={selectedItems.has(dishId)}
                onChange={() => handleSelectItem(dishId)}
              />
              <span>{cartItems[dishId].name}</span>
              <span>Price: {cartItems[dishId].price}</span>
              <span>Quantity: {cartItems[dishId].quantity}</span>
              <input
                type="number"
                value={cartItems[dishId].quantity}
                onChange={(event) =>
                  handleQuantityChange(dishId, parseInt(event.target.value))
                }
              />
              <button type="button" onClick={() => handleRemoveItem(dishId)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={handleDeleteSelectedItems}>
        <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="trash-icon"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M5 9V21a2 2 0 002 2h10a2 2 0 002-2V9" />
  </svg>
        </button>
      </form>
    </div>
  );
};

export default CartPage;