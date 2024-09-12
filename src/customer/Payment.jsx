import React, { useState, useEffect } from "react";
import PayMongoService from "../services/PayMongoService";
import PaymentController from "../class/controllers/PaymentController";
import '../css/Payment.css';

const Payment = ({ totalAmount, downpaymentAmount, paymentOption, orderId, onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amountToPay, setAmountToPay] = useState(totalAmount);

  useEffect(() => {
    // Determine the amount to pay based on the selected payment option (downpayment or full)
    if (paymentOption === 'downpayment') {
      setAmountToPay(downpaymentAmount);
    } else {
      setAmountToPay(totalAmount);
    }
  }, [paymentOption, totalAmount, downpaymentAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Create a PayMongo payment link
      const response = await PayMongoService.createPaymentLink(email, amountToPay);
  
      if (response.data && response.data.attributes) {
        const { checkout_url, id: paymentLinkId } = response.data.attributes;
  
        // Record the payment transaction and update order status based on payment option
        await PaymentController.recordPaymentTransaction(
          orderId,
          paymentLinkId,
          amountToPay,
          paymentOption === 'downpayment' ? 'Downpayment Paid' : 'Full Payment Paid'
        );
  
        // Redirect to the PayMongo checkout URL
        window.location.href = checkout_url;
      } else {
        throw new Error("Failed to create PayMongo payment link.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="payment-modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h2>Pay with GCash</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Total Amount to Pay:</label>
            <input type="text" value={`₱${amountToPay}`} disabled />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : `Pay ₱${amountToPay} with GCash`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
