import React, { useState, useEffect } from "react";
import '../css/Checkout.css';
import CartController from "../class/controllers/CartController.js";
import OrderController from "../class/controllers/OrderController.js";
import { FService } from "../class/controllers/FirebaseService.ts";

const Checkout = ({ onClose, cartItems }) => {
  const [formData, setFormData] = useState({
    receiverName: "",
    contactNo: "",
    address: "",
    paymentOption: "fullpayment",  // Default option to full payment
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [downpaymentAmount, setDownpaymentAmount] = useState(0);

  // Calculate total and downpayment amounts whenever cartItems change
  useEffect(() => {
    let total = 0;
    Object.values(cartItems).forEach(item => {
      total += item.price * item.quantity;
    });
    setTotalAmount(total);
    setDownpaymentAmount(total * 0.2); // 20% downpayment
  }, [cartItems]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch the current user's email from Firebase auth
      const user = FService.auth.currentUser;
      if (!user) {
        throw new Error('User is not authenticated');
      }
      const email = user.email;

      // Determine the amount to be paid based on the payment option
      let amountToPay = totalAmount;
      if (formData.paymentOption === 'downpayment') {
        amountToPay = downpaymentAmount;
      }

      // Fetch the cart data from CartController
      const userCartItems = await CartController.getCartData();
      if (Object.keys(userCartItems).length === 0) {
        alert('Your cart is empty! Please add items before checking out.');
        return;
      }

      // Create the order using the OrderController
      await OrderController.createOrder(email, formData, userCartItems, amountToPay);

      alert("Order successfully placed!");
      onClose(); // Close the modal after successful submission
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Failed to submit order. Please try again.");
    }
  };

  return (
    <div className="checkout-modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h2>Checkout</h2>

        <form onSubmit={handleSubmit}>
          <h3>Billing Information</h3>

          <div className="form-group">
            <label>Receiver Name:</label>
            <input
              type="text"
              name="receiverName"
              value={formData.receiverName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact No:</label>
            <input
              type="tel"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <h3>Payment Information</h3>
          <div className="payment-options">
            <label className="payment-option">
              <input
                type="radio"
                name="paymentOption"
                value="downpayment"
                checked={formData.paymentOption === "downpayment"}
                onChange={handleChange}
              />
              <span className="circle"></span>
              <span className="description">
                Downpayment - Pay 20% ({downpaymentAmount.toFixed(2)})
              </span>
            </label>

            <label className="payment-option">
              <input
                type="radio"
                name="paymentOption"
                value="fullpayment"
                checked={formData.paymentOption === "fullpayment"}
                onChange={handleChange}
              />
              <span className="circle"></span>
              <span className="description">
                Full Payment - Pay total amount ({totalAmount.toFixed(2)})
              </span>
            </label>
          </div>

          <button type="submit">Confirm Order</button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
