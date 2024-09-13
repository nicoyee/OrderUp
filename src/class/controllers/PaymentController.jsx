import axios from 'axios';
import { FService } from "./FirebaseService.ts"; // Firebase service to store payment data

class PaymentController {
  // Create a PayMongo payment link
  static async createPaymentLink(amount, email, orderItems) {
    try {
      const response = await axios.post('http://localhost:3001/api/create-payment-link', {
        amount: amount, // Amount in PHP
        email: email,
        orderItems: orderItems,
      });
  
      const paymentLink = response.data.attributes.url;
      return paymentLink;
    } catch (error) {
      console.error('Error creating payment link:', error.response ? error.response.data : error.message);
      throw error; // Ensure error is properly handled
    }
  }
  
  // Store payment record in the 'payments' collection
  static async recordPayment(email, amount, paymentLink) {
    try {
      const paymentData = {
        email: email,
        amount: amount,
        paymentLink: paymentLink,
        status: 'pending',
        timestamp: new Date(),
      };
      // Store the payment record in Firestore
      await FService.collection('payments').add(paymentData);
    } catch (error) {
      console.error('Error recording payment:', error);
      throw error;
    }
  }
}

export default PaymentController;
