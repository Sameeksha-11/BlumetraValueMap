require('dotenv').config(); // Load environment variables
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/get-token', async (req, res) => {
    const tokenUrl = `https://login.microsoftonline.com/f939db98-9ab3-4b52-8e5a-0d2b6168b56a/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append('client_id', '9575f570-860e-4801-8142-682ec0129c27');
    params.append('client_secret', 'dd9a8af0-44eb-4b45-a43e-bd8df7f66213');
    params.append('grant_type', 'client_credentials');
    params.append('scope', 'https://graph.microsoft.com/.default');

    try {
        const response = await axios.post(tokenUrl, params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json(error.response ? error.response.data : { message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
