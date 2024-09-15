require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.post('/api/create-payment-link', async (req, res) => {
  const { amount, description, remarks } = req.body; // Add 'remarks' to body

  try {
    const amountInCentavos = Math.round(amount * 100);
    if (isNaN(amountInCentavos) || amountInCentavos < 10000) {
      return res.status(400).json({ error: 'Invalid amount. Minimum amount is PHP 100.00 (10000 centavos).' });
    }

    const paymongoSecretKey = process.env.PAYMONGO_SECRET_KEY;
    const authHeader = `Basic ${Buffer.from(`${paymongoSecretKey}:`).toString('base64')}`;

    const response = await axios.post('https://api.paymongo.com/v1/links', {
      data: {
        attributes: {
          amount: amountInCentavos,
          description: description,
          remarks: remarks 
        }
      }
    }, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      }
    });

    res.json({ paymentLink: response.data.data.attributes.url });
  } catch (error) {
    if (error.response) {
      console.error("Error creating payment link:", error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      console.error("Error creating payment link:", error.message);
      res.status(500).json({ error: 'Failed to create payment link', details: error.message });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
