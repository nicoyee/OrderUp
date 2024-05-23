import React, { useState, useEffect } from 'react';
import Cart from '../class/Cart.js';
import Customer from "../class/Customer.ts"
import '../css/CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const cart = new Cart();
  

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        
        setCartItems(Cart.getCartItems());
        console.log("cartItems", cartItems)
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const handleQuantityChange = async (dishId, newQuantity) => {
    const updatedCartItems = { ...cartItems };
    updatedCartItems[dishId].quantity = newQuantity;
    setCartItems(updatedCartItems);

    try {
      await Customer.persistCartItemQuantity(dishId, newQuantity);
      if (this.items[dishId]) {
        this.items[dishId].quantity = newQuantity;
      }
    } catch (error) {
      setError(error.message);
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
      const updatedCartItems = Object.fromEntries(
        Object.entries(cartItems).filter(
          ([dishId]) => !selectedItems.has(dishId)
        )
      );
      
      await Customer.persistDeletedCartItems(updatedCartItems);
      setCartItems(updatedCartItems);
      setSelectedItems(new Set());
    } catch (error) {
      setError(error.message);
    }
  };

  const totalPrice = Object.values(cartItems).reduce(
    (acc, item) => acc + item.price * item.quantity, 0
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
            <path d="M14.71 5.71a.996.996 0 0 0-1.41 0L8.91 11.5H20c.55 0 1 .45 1 1s-.45 1-1-1H8.91l4.39 4.39a.996.996 0 1 0 1.41-1.41L6.71 12l6.71-6.71c.38-.38.38-1.02 0-1.41z" />
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
              <span className="item-price">
                Price: ₱{Number(cartItems[dishId].price).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </form>
      <div className="total-price">
        Total: ₱ {totalPrice.toFixed(2)}
      </div>
      <div className="checkout-container">
        <button type="button" className="checkout-btn" onClick={() => window.history.push('/checkout')}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;