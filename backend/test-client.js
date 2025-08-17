// Simple login test with axios
const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login with admin credentials');
    console.log('URL: http://localhost:3000/api/auth/login');
    
    // First, let's install axios if not already installed
    const { execSync } = require('child_process');
    try {
      execSync('npm list axios || npm install axios');
      console.log('Axios is ready');
    } catch (err) {
      console.log('Error installing axios:', err.message);
    }

    // Try with direct POST request
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'admin@sistema.com',
      password: 'admin123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
      console.log('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.log('No response received:', error.request);
    } else {
      // Something else happened
      console.log('Error:', error.message);
    }
  }
}

testLogin();
