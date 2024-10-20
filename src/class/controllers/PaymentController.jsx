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

  static async fetchAllPaymentLinks() {
    const apiKey = process.env.REACT_APP_PAYMONGO_SECRET_KEY;
    // const authHeader = `Basic ${btoa(`${apiKey}:`)}`;

    try {
      const response = await fetch('https://api.paymongo.com/v1/links?page[limit]=10', {
        method: 'GET',
        headers: {
          Authorization: `Basic ${btoa(`${apiKey}:`)}`,
          Accept: 'application/json',
        },
      });
      

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error('PayMongo API Error:', errorResponse);
        throw new Error(`Error fetching payment links: ${response.status} - ${JSON.stringify(errorResponse)}`);
      }

      const data = await response.json();
      console.log('Fetched payment links:', data);

      // Optionally store links in Firestore
      data.data.forEach(async (link) => {
        const paymentData = {
          linkId: link.id,
          amount: link.attributes.amount / 100, // Convert from centavos to PHP
          description: link.attributes.description,
          status: link.attributes.status,
          created_at: new Date(link.attributes.created_at * 1000), // Convert timestamp
        };

        await FService.collection('payments').doc(link.id).set(paymentData, { merge: true });
        console.log('Payment link synced to Firestore:', paymentData);
      });

      return data;
    } catch (error) {
      console.error('Error fetching payment links:', error);
      throw error; // Re-throw the error for further handling
    }
  }

}

export default PaymentController;
