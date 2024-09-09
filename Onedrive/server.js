const express = require('express');
const axios = require('axios');
const Qs = require('qs');
const cors = require('cors');  // Import the CORS middleware
const bodyParser = require('body-parser');
const app = express();
require('isomorphic-fetch'); // Needed for Node.js
require('dotenv').config();

app.use(cors());

// Middleware to serve static files
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.post('/get-token', async (req, res) => {
    //console.log('Request body:', req.body);
    const {client_id, client_secret, tenant_id, scope, grant_type} = req.body;

    const token_url = `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/token`;

    const payload = {
        client_id,
        client_secret,
        tenant_id,
        scope,
        grant_type
    };

    try {
        const response = await axios.post(token_url, Qs.stringify(payload), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        res.json({ access_token: response.data.access_token });
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error fetching access token' });
    }
});

let storedData = {};

// Route to save data
app.post('/save-data', (req, res) => {
    const data = req.body;
    storedData = data;
    res.status(200).send('Data received and stored successfully');
});

// Route to retrieve data
app.get('/get-data', (req, res) => {
    res.json(storedData);
});


app.listen(3000, () => {
    console.log('Backend server running on http://localhost:3000');
});