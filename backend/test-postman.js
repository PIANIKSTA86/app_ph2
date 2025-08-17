const axios = require('axios');

// Función para simular la solicitud de Postman
async function testLogin() {
  try {
    console.log('Enviando solicitud a /api/auth/login...');
    // Solicitud con parámetros de consulta
    const response = await axios.post('http://localhost:3000/api/auth/login', {}, {
      params: {
        email: 'admin@sistema.com',
        password: 'admin123'
      },
      timeout: 5000
    });
    
    console.log('Respuesta:', response.data);
    console.log('Código de estado:', response.status);
    
    console.log('\nEnviando solicitud a /login...');
    // También probemos la ruta directa
    const directResponse = await axios.post('http://localhost:3000/login', {}, {
      params: {
        email: 'admin@sistema.com',
        password: 'admin123'
      },
      timeout: 5000
    });
    
    console.log('Respuesta ruta directa:', directResponse.data);
    console.log('Código de estado ruta directa:', directResponse.status);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Error completo:', error);
    if (error.response) {
      console.error('Respuesta de error:', error.response.data);
      console.error('Código de estado:', error.response.status);
    }
  }
}

testLogin();
