// services/PayMongoService.js
import axios from "axios";

const PayMongoService = {
  createPaymentLink: async (email, amount) => {
    const url = "https://api.paymongo.com/v1/links";
    const data = {
      data: {
        attributes: {
          amount: amount * 100,  // PayMongo uses centavos, so multiply by 100
          description: `Payment for order`,
          remarks: `Payment for ${email}`,
          // Add more attributes if needed
        }
      }
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa('your_secret_key')}` // replace 'your_secret_key' with the actual key
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error creating payment link:", error);
      throw error;
    }
  }
};

export default PayMongoService;
