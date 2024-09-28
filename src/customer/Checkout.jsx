import React, { useState, useEffect } from "react";
import '../css/Checkout.css';
import CartController from "../class/controllers/CartController.js";
import OrderController from "../class/controllers/OrderController.js";
import PaymentController from "../class/controllers/PaymentController.jsx";
import { auth } from '../firebase'; // Import auth from the firebase.js file
import { FService } from "../class/controllers/FirebaseService.ts";

const Checkout = ({ onClose, cartItems }) => {
  const [formData, setFormData] = useState({
    receiverName: "",
    contactNo: "",
    address: "",
    paymentOption: "fullpayment", // Default option to full payment
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [downpaymentAmount, setDownpaymentAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total and downpayment amounts whenever cartItems change
  // Calculate total and downpayment amounts whenever cartItems change
useEffect(() => {
  let total = 0;
  Object.values(cartItems).forEach((item) => {
    total += item.price * item.quantity;
  });
  setTotalAmount(total);
  setDownpaymentAmount(total * 0.4); // 40% downpayment
}, [cartItems]);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if the cart is empty
      const userCartItems = await CartController.getCartData();
      if (!userCartItems || Object.keys(userCartItems).length === 0) {
        alert("Your cart is empty! Please add items before checking out.");
        return;
      }

      // Check if the user is logged in
      const email = auth.currentUser?.email;
      if (!email) {
        alert("You must be logged in to place an order.");
        return;
      }

      // Fetch transaction documents under "Balance/{email}/transactions"
      const transactionsPath = `Balance/${email}/transactions`;
      const transactionsSnapshot = await FService.getDocuments(transactionsPath);
      let hasUnpaidBalance = false;

      transactionsSnapshot.forEach((doc) => {
        const transaction = doc.data();
        if (transaction.status === "unpaid") {
          hasUnpaidBalance = true;
        }
      });

      // If there is any unpaid balance, stop the process and alert the user
      if (hasUnpaidBalance) {
        alert("You cannot checkout with an unpaid balance. Please pay the remaining balance first.");
        return;
      }

      // Determine the payment amount based on the payment option
      const paymentAmount = formData.paymentOption === "downpayment" ? downpaymentAmount : totalAmount;

      console.log("Total Amount:", totalAmount);
      console.log("Downpayment Amount:", downpaymentAmount);
      console.log("Payment Amount being sent:", paymentAmount);

      // Create the order
      const orderId = await OrderController.createOrder({
        email,
        receiverName: formData.receiverName,
        contactNo: formData.contactNo,
        address: formData.address,
        paymentOption: formData.paymentOption,
        items: cartItems,
        totalAmount: paymentAmount,
      });

      // Create a description for the order items
      const orderDescription = Object.keys(cartItems)
        .map((key) => `${cartItems[key].name} x ${cartItems[key].quantity}`)
        .join(", ");

      console.log("Order Description:", orderDescription);

      // Create a payment link
      const paymentLink = await PaymentController.createPaymentLink(
        paymentAmount,
        email,
        orderDescription
      );

      // Redirect user to payment link
      window.location.href = paymentLink;

    } catch (error) {
      console.error("Error during payment:", error.message || error);
      alert(error.message || "Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
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

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Confirm Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
