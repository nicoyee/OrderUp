import "../css/Checkout.css";
import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { UserContext } from "../App";
import { getDoc, doc, deleteDoc, setDoc } from "firebase/firestore";

const Checkout = () => {
  const user = useContext(UserContext);
  const location = useLocation();
  const [cartItems, setCartItems] = useState({});
  const [gcashImageUrl, setGcashImageUrl] = useState(""); // State to hold the GCash image URL
  const { referenceNumber, currentDate, cartData } = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    // Update cart items once when the component mounts
    setCartItems(cartData.items || {});
  }, [cartData]);

  useEffect(() => {
    // Fetch the GCash image URL from Firestore
    const fetchGcashImageUrl = async () => {
      try {
        const gcashDocRef = doc(db, "qr_code", "gcash");
        const gcashDocSnapshot = await getDoc(gcashDocRef);
        if (gcashDocSnapshot.exists()) {
          const gcashData = gcashDocSnapshot.data();
          const gcashImageUrl = gcashData.imageUrl;
          console.log("GCash image URL:", gcashImageUrl);
          setGcashImageUrl(gcashImageUrl);
        } else {
          console.log("GCash document not found");
          return null;
        }
      } catch (error) {
        console.error("Error fetching GCash image URL:", error);
        return null;
      }
    };

    fetchGcashImageUrl();
  }, []);

  const totalPrice = Object.values(cartItems).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = async (
    user,
    cartData,
    referenceNumber,
    currentDate
  ) => {
    try {
      if (!user) {
        // Handle user not authenticated
        return;
      }

      const cartRef = doc(db, "cart", user.email);
      // Add checkout information to checkout collection
      const checkoutRef = doc(db, "checkouts", user.email);
      await setDoc(checkoutRef, {
        referenceNumber,
        date: currentDate,
        items: cartData.items,
      });

      // Delete the cart document
      await deleteDoc(cartRef);

      // Navigate to the checkout page with cartData, referenceNumber, and currentDate
      navigate("/");
    } catch (error) {
      // Handle error
      console.error("Error handling checkout:", error);
    }
  };

  return (
    <div className="container">
      <div className="containerLeft">
        <img
          src={gcashImageUrl} // Use the dynamic GCash image URL
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
                Price: ${Number(cartItems[dishId].price).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div className="total-price">Total:₱ {totalPrice.toFixed(2)}</div>
        <h3>Payment Method: </h3>
        <h3>Reference number: {referenceNumber}</h3>
        <h3>
          Checkout Date: {new Date(currentDate.seconds * 1000).toLocaleString()}
        </h3>
        <div className="checkout-container">
          <button
            type="button"
            className="checkout-btn"
            onClick={() =>
              handleCheckout(user, cartData, referenceNumber, currentDate)
            }
          >
            Confirm
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
