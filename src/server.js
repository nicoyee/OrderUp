require('dotenv').config(); // Load environment variables

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Endpoint to create a PayMongo payment link
app.post('/api/create-payment-link', async (req, res) => {
  const { amount, email, orderItems } = req.body;

  try {
    // Validate that the required fields are provided
    if (!amount || !email || !orderItems) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Ensure amount is a number and convert to centavos
    const amountInCentavos = Math.round(amount * 100);
    if (isNaN(amountInCentavos) || amountInCentavos <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Validate that orderItems is an array and not empty
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty orderItems' });
    }

    // Debugging logs to check data being sent
    console.log('Creating payment link with:', {
      amount: amountInCentavos,
      email: email,
      orderItems: orderItems,
    });

    // Make sure the secret key is loaded
    const paymongoSecretKey = process.env.PAYMONGO_SECRET_KEY;
    if (!paymongoSecretKey) {
      return res.status(500).json({ error: 'PayMongo secret key is not set in environment variables' });
    }

    // Make the API request to PayMongo
    const response = await axios.post('https://api.paymongo.com/v1/links', {
      data: {
        attributes: {
          amount: amountInCentavos, // Amount in centavos
          description: 'Order payment',
          remarks: 'Payment for your order',
          checkout_url: 'http://your-frontend-url/dashboard', // Adjust this URL
          currency: 'PHP',
          metadata: {
            email: email,
            order_items: JSON.stringify(orderItems) // Ensure order items are properly stringified
          }
        }
      }
    }, {
      headers: {
        'Authorization': `Bearer ${paymongoSecretKey}`,
        'Content-Type': 'application/json'
      }
    });

    // Debugging logs to see the API response
    console.log('Payment link response:', response.data);

    res.json(response.data.data);
  } catch (error) {
    // Enhanced error logging
    if (error.response) {
      console.error("Error creating payment link:", error.response.data);
    } else {
      console.error("Error creating payment link:", error.message);
    }
    res.status(400).json({ error: 'Failed to create payment link' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
