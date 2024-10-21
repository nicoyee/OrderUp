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

  static async getAllPayments(limit = 100, after = null, before = null) {
    try {
        const apiKey = process.env.REACT_APP_PAYMONGO_SECRET_KEY;
        if (!apiKey) {
            throw new Error("PayMongo API Key is not configured");
        }

        const authHeader = `Basic ${btoa(`${apiKey}:`)}`;
        const params = new URLSearchParams();

        
        params.append("limit", limit);

        
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
        

        if (responseData && responseData.data) {
            // Save each payment data to the Firestore 'payments' collection
            for (const payment of responseData.data) {
                const paymentData = {
                    id: payment.id, // Payment ID from PayMongo
                    amount: payment.attributes.amount / 100, // Convert back from cents
                    description: payment.attributes.description || null,
                    status: payment.attributes.status || null,
                    remarks: payment.attributes.remarks || null,
                    created_at: payment.attributes.created_at
                        ? new Date(payment.attributes.created_at * 1000)
                        : null, // Convert timestamp
                };

                // Use FService to save the payment data to Firestore
                await FService.setDocument('payments', payment.id, paymentData);
                
            }

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
  
  static async getRefund(refundId) {
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

      const response = await fetch(`https://api.paymongo.com/v1/refunds/${refundId}`, options);
      const responseData = await response.json();
      console.log('PayMongo refund response:', responseData);

      if (responseData && responseData.data) {
        return responseData.data; // Return the specific refund data
      } else {
        throw new Error('Unexpected response format from PayMongo API');
      }
    } catch (error) {
      console.error('Error retrieving refund:', error.message);
      throw error;
    }
  }

  static async getAllRefunds(limit = 100, after = null, before = null) {
    try {
      const apiKey = process.env.REACT_APP_PAYMONGO_SECRET_KEY;
      if (!apiKey) {
        throw new Error("PayMongo API Key is not configured");
      }
  
      const authHeader = `Basic ${btoa(`${apiKey}:`)}`;
      const params = new URLSearchParams();
      params.append("limit", limit);
  
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
  
      const response = await fetch(`https://api.paymongo.com/v1/refunds?${params.toString()}`, options);
      const responseData = await response.json();
  
      if (responseData && responseData.data) {
        return responseData.data;
      } else {
        throw new Error("Unexpected response format from PayMongo API");
      }
    } catch (error) {
      console.error("Error fetching all refunds:", error.message);
      throw error;
    }
  }

  static async getAllPaymentsAndHandleRefunds(limit = 100, after = null, before = null) {
    try {
      const apiKey = process.env.REACT_APP_PAYMONGO_SECRET_KEY;
      if (!apiKey) {
        throw new Error("PayMongo API Key is not configured");
      }
  
      // Fetch all payments
      const payments = await PaymentController.getAllPayments(limit, after, before);
  
      // Fetch all refunds
      const refunds = await PaymentController.getAllRefunds(limit, after, before);
  
      // Map refunds by payment_id for easy lookup
      const refundsMap = new Map();
      refunds.forEach(refund => {
        refundsMap.set(refund.attributes.payment_id, refund);
      });
  
      // Loop through payments and update status if refunded
      for (const payment of payments) {
        const paymentId = payment.id;
        const amount = payment.attributes.amount / 100;
        let status = payment.attributes.status;
  
        // If this payment has a corresponding refund, mark it as refunded
        if (refundsMap.has(paymentId)) {
          status = 'refunded';
        }
  
        const paymentData = {
          id: payment.id, 
          amount: amount, 
          description: payment.attributes.description || null,
          status: status, // Update status to "refunded" if refund exists
          remarks: payment.attributes.remarks || null,
          created_at: payment.attributes.created_at
            ? new Date(payment.attributes.created_at * 1000)
            : null,
        };
  
        // Update the payment in Firestore with new status
        await FService.setDocument('payments', payment.id, paymentData);
      }
  
      return payments; // Return updated payments with refunds handled
    } catch (error) {
      console.error("Error fetching payments and handling refunds:", error.message);
      throw error;
    }
  }
  

}

export default PaymentController;