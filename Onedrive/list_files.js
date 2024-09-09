const axios = require('axios');
const qs = require('qs');
 
const client_id = "9575f570-860e-4801-8142-682ec0129c27";
const client_secret = "dd9a8af0-44eb-4b45-a43e-bd8df7f66213";
const tenant_id = "f939db98-9ab3-4b52-8e5a-0d2b6168b56a";
const scope = 'https://graph.microsoft.com/.default';
const grant_type = 'client_credentials';
 
async function getAccessToken() {
  const token_url = `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/token`;
  const payload = {
    client_id,
    client_secret,
    scope,
    grant_type
  };
 
  try {
    const response = await axios.post(token_url, qs.stringify(payload));
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error.response.data);
    throw error;
  }
}
 
async function listFiles() {
  const accessToken = await getAccessToken();
  const folderUrl = `https://graph.microsoft.com/v1.0/me/drive/root/children`;
 
  try {
    const response = await axios.get(folderUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    const files = response.data.value;
    console.log('Files in OneDrive:');
    files.forEach(file => {
      console.log(`Name: ${file.name}, ID: ${file.id}`);
    });
  } catch (error) {
    console.error('Error listing files:', error.response.data);
    throw error;
  }
}
 
// Example usage
listFiles();