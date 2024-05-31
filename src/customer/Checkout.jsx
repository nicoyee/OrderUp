// Checkout.js
import "../css/Checkout.css";
import React, { useState, useEffect,useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Customer from "../class/Customer.ts";
import { FController } from "../class/controllers/controller.ts";
import { UserContext } from "../App";
import Cart from "../class/Cart";
import { auth, db } from "../firebase";
import {
  getDoc,
  doc,
  collection,
  Timestamp,
  deleteDoc,
  setDoc,
} from "firebase/firestore";

const Checkout = () => {
  const user = useContext(UserContext);
  const location = useLocation();
  const [cartItems, setCartItems] = useState({});
  const [gcashImageUrl, setGcashImageUrl] = useState("");
  const cart = useRef(new Cart()).current;
  const { cartData, referenceNumber, currentDate } = location.state || {};

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        await cart.fetchCartData();
        setCartItems(cart.items);
      } finally {
      }
    };

    fetchCartData();
  }, [cart]);

  useEffect(() => {
    const fetchGcashImageUrl = async () => {
      try {
        const gcashData = await Customer.getGcashQrCode();
        if (gcashData) {
          const gcashImageUrl = gcashData.imageUrl;
          console.log("GCash image URL:", gcashImageUrl);
          setGcashImageUrl(gcashImageUrl);
        } else {
          console.log("GCash document not found");
        }
      } catch (error) {
        console.error("Error fetching GCash image URL:", error);
      }
    };

    fetchGcashImageUrl();
  }, []);

  const totalPrice = Object.values(cartItems).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCreateOrder = async () => {
    try {
      const user = FController.auth.currentUser;
      if (user) {
        if (!cartData) {
          throw new Error('Cart data is missing');
        }
        console.log(cartData)
        const refNum = referenceNumber
        const currDate = currentDate
        const userName = user.email

         // Reference to the user's document in the "Orders" collection
      const userOrderDocRef = doc(db, "Orders", userName);

        // Add the user's name to the user's document in the "Orders" collection
      await setDoc(userOrderDocRef, { name: userName }, { merge: true });

      // Reference to the user's orders subcollection
      const ordersRef = collection(userOrderDocRef, "orders");

      // Add the cart data to the orders subcollection with the reference number as document ID
      await setDoc(doc(ordersRef, referenceNumber), cartData);

      // Get the cart data
      const cartRef = doc(db, "cart", user.email);

       // Delete the cart document
       await deleteDoc(cartRef);

        alert('Order created successfully!');
        navigate("/");
      } else {
        alert('User not authenticated.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. See console for details.');
    }
  };

  return (
    <div className="container">
      <div className="containerLeft">
        <img
          src={gcashImageUrl}
          alt="GCash"
          className="gcash-image"
        />
      </div>
      <div className="containerRight">
        <h1>Checkout</h1>
        <h2>Cart Items:</h2>
        <ul className="cart-items">
          {Object.keys(cartItems).map((dishId) => (
            <li key={dishId} className="cart-item">
              <div className="item-details">
                <div>
                  <span className="item-name">{cartItems[dishId].name}</span>
                  <span className="item-quantity">
                    Quantity: {cartItems[dishId].quantity}
                  </span>
                </div>
              </div>
              <span className="item-price">
                Price: ₱{cartItems[dishId].price.toFixed(2)}

              </span>
            </li>
          ))}
        </ul>
        <div className="total-price">Total: ₱{totalPrice.toFixed(2)}</div>
        <h3>Payment Method: </h3>
        <h3>Reference number: {referenceNumber}</h3>
        <h3>
          Checkout Date: {new Date(currentDate.seconds * 1000).toLocaleString()}
        </h3>
        <div className="checkout-container">
          <button
            type="button"
            className="checkout-btn"
            onClick={handleCreateOrder}
          >
            Create Order

          </button>
          <button
            type="button"
            className="checkout-btn"
            onClick={() => navigate("/")}
          >
            Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
