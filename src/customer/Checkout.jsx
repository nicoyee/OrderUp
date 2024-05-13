import '../css/CartPage.css';

import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Checkout = () => {
    const location = useLocation();
    const [cartItems, setCartItems] = useState({});
    const { cartData, referenceNumber, currentDate } = location.state;
    const navigate = useNavigate();

    useEffect(() => {
        // Update cart items once when the component mounts
        setCartItems(cartData.items || {});
    }, [cartData]);

    const totalPrice = Object.values(cartItems).reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
    <div className="cart-container">
        <h1>Checkout</h1>
        <h2>Cart Items:</h2>
        <ul className="cart-items">
          {Object.keys(cartItems).map((dishId) => (
            <li key={dishId} className="cart-item">
              <div className="item-details">
                <div>
                  <span className="item-name">{cartItems[dishId].name}</span>
                  <span className="item-quantity">Quantity: {cartItems[dishId].quantity}</span>
                </div>
              </div>
              <span className="item-price">Price: ${cartItems[dishId].price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="total-price">
        Total:₱ {totalPrice.toFixed(2)}
      </div>
      <h3>Payment Method: </h3>
      <h3>Reference number: {referenceNumber}</h3>
      <h3>Checkout Date: {new Date(currentDate.seconds * 1000).toLocaleString()}</h3>
            {/* Convert Firestore Timestamp to JavaScript Date object and format it using toLocaleString() */}
      <div className="checkout-container">
        <button type="button" className="checkout-btn" onClick={() => navigate('/')}>
          Return
        </button>
      </div>
    </div>
    );
}

export default Checkout;