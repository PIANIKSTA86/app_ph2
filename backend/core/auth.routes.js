const express = require('express');
const router = express.Router();
const { register, login, resetPassword, updatePassword, checkResetToken } = require('./auth');

// Registro de usuarios
router.post('/register', register);

// Login
router.post('/login', login);

// Solicitar reset de contraseña
router.post('/reset-password', resetPassword);

// Verificar token de reset
router.get('/check-reset-token/:token', checkResetToken);

// Actualizar contraseña
router.post('/update-password', updatePassword);

// Ruta para verificar el estado de la API de autenticación
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API de autenticación funcionando correctamente',
    endpoints: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      resetPassword: '/api/auth/reset-password',
      checkResetToken: '/api/auth/check-reset-token/:token',
      updatePassword: '/api/auth/update-password'
    }
  });
});

module.exports = router;
