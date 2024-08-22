const express = require('express');
const axios = require('axios');
const qs = require('qs');
const cors = require('cors');  // Import the CORS middleware

const app = express();

// Enable CORS for all routes and origins
app.use(cors());

// Alternatively, to allow only specific origins, use:
// app.use(cors({ origin: 'http://localhost:63342' }));

app.use(express.json());

app.post('/get-token', async (req, res) => {
    console.log('Request body:', req.body);
    const { client_id, client_secret, tenant_id, scope, grant_type } = req.body;

    const token_url = `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/token`;

    const payload = {
        client_id,
        client_secret,
        scope,
        grant_type,
    };

    try {
        const response = await axios.post(token_url, qs.stringify(payload), {
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

app.listen(3000, () => {
    console.log('Backend server running on http://localhost:3000');
});
