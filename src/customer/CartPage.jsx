import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cart from "../class/Cart";
import Customer from "../class/Customer.ts";
import "../css/CartPage.css";
import { UserContext } from "../App";
import { Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import Checkout from "./Checkout.jsx";

// Modal for confirmation
const ConfirmationModal = ({ onClose, onConfirm, message }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="modal-confirm" onClick={onConfirm}>
            Confirm
          </button>
          <button className="modal-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const user = useContext(UserContext);
  const [cartItems, setCartItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Modal for deletion
  const cart = useRef(new Cart()).current;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        if (!user) throw new Error("User not authenticated.");

        const cartInstance = new Cart();
        await cartInstance.fetchCartData(user);
        setCartItems(cartInstance.items); // Update the state with fetched items

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [user]); // Depend on user, but not cart directly

  const handleQuantityChange = async (dishId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity from being less than 1
    const updatedCartItems = { ...cartItems };
    updatedCartItems[dishId].quantity = newQuantity;
    setCartItems(updatedCartItems);

    try {
      await Customer.persistCartItemQuantity(dishId, newQuantity);
      cart.updateItemQuantity(dishId, newQuantity);
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

  const openConfirmDeleteModal = () => {
    setIsConfirmModalOpen(true);
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
      setIsConfirmModalOpen(false); // Close the modal after deletion
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      setError("User not authenticated.");
      return;
    }

    setIsCheckoutOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsCheckoutOpen(false); // Close the modal
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false); // Close the confirmation modal
  };

  const totalPrice = Object.values(cartItems).reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="cart-container">
      <div className="back-button" onClick={() => navigate("/dashboard")}>
        <a>
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
          <button type="button" onClick={openConfirmDeleteModal}>
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
                  <div className="item-quantity">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(
                          dishId,
                          cartItems[dishId].quantity - 1
                        )
                      }
                      disabled={cartItems[dishId].quantity <= 1}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="currentColor"
                      >
                        <path d="M19 13H5v-2h14v2z" />
                      </svg>
                    </button>
                    <input
                      type="number"
                      value={cartItems[dishId].quantity}
                      onChange={(e) =>
                        handleQuantityChange(dishId, parseInt(e.target.value))
                      }
                      min="1"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(
                          dishId,
                          cartItems[dishId].quantity + 1
                        )
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="currentColor"
                      >
                        <path d="M19 13H5v-2h14v2z" />
                        <path d="M13 19V5h-2v14h2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <span className="item-price">
                Price: ₱{Number(cartItems[dishId].price).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </form>
      <div className="total-price">Total: ₱ {totalPrice.toFixed(2)}</div>
      <div className="checkout-container">
        <button type="button" className="checkout-btn" onClick={handleCheckout}>
          Checkout
        </button>
      </div>

      {/* Modal Checkout */}
      {isCheckoutOpen && <Checkout onClose={closeModal} cartItems={cartItems} />}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete the selected items?"
          onConfirm={handleDeleteSelectedItems}
          onClose={closeConfirmModal}
        />
      )}
    </div>
  );
};

export default CartPage;
