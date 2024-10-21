import { FService } from "./FirebaseService.ts";

class PaymentController {
  static async createPaymentLink(amount, description, remarks) {
    try {
      const formattedAmount = amount * 100; 

      const apiKey = process.env.REACT_APP_PAYMONGO_SECRET_KEY;
      if (!apiKey) {
        throw new Error("PayMongo API Key is not configured");
      }

      
      const authHeader = `Basic ${btoa(`${apiKey}:`)}`;

      const requestData = {
        data: {
          attributes: {
            amount: formattedAmount,
            description: description,
            remarks: remarks 
          }
        }
      };

      console.log('Creating payment link with data:', requestData);

      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: authHeader,
        },
        body: JSON.stringify(requestData),
      };

      const response = await fetch('https://api.paymongo.com/v1/links', options);
      const responseData = await response.json();
      console.log('PayMongo response:', responseData);

      // if(responseData!=null){
      //   const paymentLink = responseData.data.attributes.checkout_url;
      //   console.log(paymentLink);

      // const paymentData = {
      //     amount: formattedAmount / 100, 
      //     description: description,
      //     remarks: remarks, 
      // };

      if (responseData && responseData.data && responseData.data.attributes && responseData.data.attributes.checkout_url) {
        const paymentLink = responseData.data.attributes.checkout_url;
        console.log(paymentLink);

        const paymentData = {
          amount: formattedAmount / 100, 
          description: description,
          remarks: remarks, 
      };

        // await FService.collection('payments').add(paymentData);
        // console.log('Payment data successfully stored in Firestore:', paymentData);

        return paymentLink;
      } else {
        throw new Error('Unexpected response format from PayMongo API');
      }
    } catch (error) {
      console.error('Error creating payment link:', error.message);
      throw error;
    }
  }

  static async getAllPayments(limit = 50, after = null, before = null) {
    try {
      const apiKey = process.env.REACT_APP_PAYMONGO_SECRET_KEY;
      if (!apiKey) {
        throw new Error("PayMongo API Key is not configured");
      }

      const authHeader = `Basic ${btoa(`${apiKey}:`)}`;
      const params = new URLSearchParams();

      // Set the limit for the number of payments to fetch
      params.append("limit", limit);

      // If after or before cursors are provided, append them as well
      if (after) {
        params.append("after", after);
      }
      if (before) {
        params.append("before", before);
      }

      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          authorization: authHeader,
        },
      };

      const response = await fetch(`https://api.paymongo.com/v1/payments?${params.toString()}`, options);
      const responseData = await response.json();
      console.log("PayMongo payments response:", responseData);

      if (responseData && responseData.data) {
        return responseData.data; // Return the list of payments
      } else {
        throw new Error("Unexpected response format from PayMongo API");
      }
    } catch (error) {
      console.error("Error fetching all payments:", error.message);
      throw error;
    }
  }
  
  static async getPayment(paymentId) {
    try {
      const apiKey = process.env.REACT_APP_PAYMONGO_SECRET_KEY;
      if (!apiKey) {
        throw new Error("PayMongo API Key is not configured");
      }

      const authHeader = `Basic ${btoa(`${apiKey}:`)}`;

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          authorization: authHeader,
        },
      };

      const response = await fetch(`https://api.paymongo.com/v1/payments/${paymentId}`, options);
      const responseData = await response.json();
      console.log('PayMongo payment response:', responseData);

      if (responseData && responseData.data) {
        return responseData.data; // Return the specific payment data
      } else {
        throw new Error('Unexpected response format from PayMongo API');
      }
    } catch (error) {
      console.error('Error retrieving payment:', error.message);
      throw error;
    }
  }
  
  static async createRefund(paymentId, amount, reason) {
    try {
      const apiKey = process.env.REACT_APP_PAYMONGO_SECRET_KEY;
      if (!apiKey) {
        throw new Error("PayMongo API Key is not configured");
      }

      const authHeader = `Basic ${btoa(`${apiKey}:`)}`;

      const formattedAmount = amount * 100; // PayMongo accepts amounts in cents

      const requestData = {
        data: {
          attributes: {
            amount: formattedAmount,
            reason: reason,
            payment_id: paymentId,
          }
        }
      };

      console.log('Creating refund with data:', requestData);

      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          authorization: authHeader,
        },
        body: JSON.stringify(requestData),
      };

      const response = await fetch('https://api.paymongo.com/v1/refunds', options);
      const responseData = await response.json();
      console.log('PayMongo refund response:', responseData);

      if (responseData && responseData.data) {
        return responseData.data; // Return the created refund data
      } else {
        throw new Error('Unexpected response format from PayMongo API');
      }
    } catch (error) {
      console.error('Error creating refund:', error.message);
      throw error;
    }
  }

  static async updatePaymentStatus(paymentId, status) {
    try {
      const paymentRef = FService.collection('payments').doc(paymentId);
      await paymentRef.update({ status: status });
      console.log(`Payment status successfully updated to ${status} in Firestore.`);
    } catch (error) {
      console.error('Error updating payment status in Firestore:', error.message);
      throw error;
    }
  }

}

export default PaymentController;