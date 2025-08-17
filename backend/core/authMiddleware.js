const jwt = require('jsonwebtoken');
const config = require('config');
const models = require('./models');
const Usuario = models.Usuario;

// Middleware para verificar token
const verificarToken = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No hay token de autenticación, acceso denegado' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.get('jwt.secret'));

    // Find user
    const usuario = await Usuario.findByPk(decoded.id);
    if (!usuario) {
      return res.status(401).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    if (!usuario.activo) {
      return res.status(401).json({ 
        success: false,
        message: 'Usuario desactivado, contacte al administrador' 
      });
    }

    // Add user to request object
    req.usuario = usuario;
    next();
  } catch (err) {
    res.status(401).json({ 
      success: false,
      message: 'Token no válido' 
    });
  }
};

module.exports = {
  verificarToken
};
