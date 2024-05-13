import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import '../css/CartPage.css';
import { addDoc, collection, Timestamp, deleteDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Import uuid library for generating reference number


const CartPage = () => {
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const navigate = useNavigate();

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

  const handleCheckout = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        // Handle user not authenticated
        return;
      }
  
      // Generate reference number using UUID
      const referenceNumber = uuidv4();
  
      // Record the current date and time
      const currentDate = Timestamp.now();
  
      // Fetch cart data from Firestore
      const cartRef = doc(db, 'cart', user.email);
      const cartDoc = await getDoc(cartRef);
      const cartData = cartDoc.data();
  
      // Add checkout information to checkout collection
      console.log(user.email)
      const checkoutInfoRef = collection(db, `checkouts`);
      await addDoc(checkoutInfoRef, {
        referenceNumber,
        date: currentDate,
        items: cartData.items
      });
  
      // Delete the cart document
      await deleteDoc(cartRef);
  
      // Navigate to the checkout page with cartData, referenceNumber, and currentDate
      navigate('/checkout', { state: { cartData, referenceNumber, currentDate } });
    } catch (error) {
      // Handle error
      console.error("Error handling checkout:", error);
    }
  };

  const totalPrice = Object.values(cartItems).reduce((acc, item) => acc + item.price * item.quantity, 0);

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
      <h1>YOUR CART</h1>
      <form>
        <div className="select-all-container">
          <input
            type="checkbox"
            checked={selectedItems.size === Object.keys(cartItems).length}
            onChange={handleSelectAll}
          />
          <label htmlFor="select-all">Select all</label>
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
        </div>
        <ul className="cart-items">
          {Object.keys(cartItems).map((dishId) => (
            <li key={dishId} className="cart-item">
              <div className="item-details">
                <input
                  type="checkbox"
                  checked={selectedItems.has(dishId)}
                  onChange={() => handleSelectItem(dishId)}
                  className="cart-item-checkbox"
                />
                <div>
                  <span className="item-name">{cartItems[dishId].name}</span>
                  <span className="item-quantity">Quantity: {cartItems[dishId].quantity}</span>
                </div>
              </div>
              <span className="item-price">Price: ${cartItems[dishId].price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </form>
      <div className="total-price">
        Total:₱ {totalPrice.toFixed(2)}
      </div>
      <div className="checkout-container">
        <button type="button" className="checkout-btn" onClick={() => handleCheckout()}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;