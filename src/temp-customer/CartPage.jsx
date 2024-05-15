import React, { useState, useEffect } from 'react';
import { auth,db } from '../firebase';
import '../css/CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const user = auth.currentUser; // Assuming 'auth' is your Firebase Auth instance
        if (user) {
          const cartItemsSnapshot = await db
            .collection('cart')
            .where('userId', '==', user.uid) // Assuming 'userId' field in cart items
            .get();
  
          const itemsList = cartItemsSnapshot.docs.map(doc => {
            const { Description, Name, Price } = doc.data();
            return { id: doc.id, Description, Name, Price, selected: false };
          });
          setCartItems(itemsList);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };
  
    fetchCartItems();
  }, []);

  const handleCheckboxChange = itemId => {
    const updatedItems = cartItems.map(item =>
      item.id === itemId ? { ...item, selected: !item.selected } : item
    );
    setCartItems(updatedItems);
  };

  const handleSelectAll = () => {
    const updatedItems = cartItems.map(item => ({
      ...item,
      selected: !selectAll
    }));
    setCartItems(updatedItems);
    setSelectAll(!selectAll);
  };

  const handleRemoveItem = itemId => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
  };

  const handleSelectedItemCount = () => {
    const selectedCount = cartItems.filter(item => item.selected).length;
    return selectedCount;
  };

  const handleDeleteSelected = () => {
    const updatedItems = cartItems.filter(item => !item.selected);
    setCartItems(updatedItems);
  };

  const handleCheckout = () => {
    // Logic for checkout functionality
    alert('Proceeding to checkout...');
  };

  return (
    <div className="cart">
      <div className="back-to-dashboard">
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
      <h2>Your Cart</h2>
      <div className="cart-controls">
        <button className="select-all-btn" onClick={handleSelectAll}>
          {selectAll ? 'Deselect All' : 'Select All'}
        </button>
        {handleSelectedItemCount() > 0 && (
          <button className="delete-selected-btn" onClick={handleDeleteSelected}>
            Delete Selected
          </button>
        )}
        <p className="selected-count">Item selected: {handleSelectedItemCount()}</p>
      </div>
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <input
              type="checkbox"
              checked={item.selected}
              onChange={() => handleCheckboxChange(item.id)}
            />
            <h3>{item.Name}</h3>
            <p>{item.Description}</p>
            <p>Price: ${item.Price}</p>
            <button className="remove-item-btn" onClick={() => handleRemoveItem(item.id)}>
              🗑️ Remove
            </button>
          </div>
        ))}
      </div>
      {/* Checkout button */}
      <button className="checkout-btn" onClick={handleCheckout}>
        Checkout
      </button>
    </div>
  );
};

export default CartPage;