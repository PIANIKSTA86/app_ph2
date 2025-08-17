const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const crypto = require('crypto');
const { Usuario } = require('./models');
const { Op } = require('sequelize');

exports.register = async (req, res) => {
  try {
    const { nombre, email, password, rol, conjuntoId } = req.body;

    // Check if user exists
    let usuario = await Usuario.findOne({ where: { email } });
    if (usuario) {
      return res.status(400).json({ 
        success: false,
        message: 'El usuario ya existe' 
      });
    }

    // Create new user
    usuario = await Usuario.create({
      nombre,
      email,
      password: await bcrypt.hash(password, 10),
      rol,
      conjunto_id: conjuntoId,
      activo: true
    });

    // Generate JWT
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      config.get('jwt.secret'),
      { expiresIn: config.get('jwt.expiresIn') }
    );

    res.json({
      success: true,
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Login request received');
    console.log('Request body:', req.body);
    console.log('Request query:', req.query);
    
    // Get credentials from either body or query parameters
    const email = req.body.email || req.query.email;
    const password = req.body.password || req.query.password;
    
    console.log('Login attempt with email:', email);
    
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Check if user exists
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      console.log('Usuario no encontrado:', email);
      return res.status(400).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }
    
    console.log('Usuario encontrado:', usuario.nombre);

    // Check if password matches
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      console.log('Contraseña incorrecta para usuario:', email);
      return res.status(400).json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }
    
    console.log('Contraseña correcta para usuario:', email);

    if (!usuario.activo) {
      return res.status(401).json({ 
        success: false,
        message: 'Usuario desactivado, contacte al administrador' 
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      config.get('jwt.secret'),
      { expiresIn: config.get('jwt.expiresIn') }
    );

    res.json({
      success: true,
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        conjuntoId: usuario.conjunto_id
      }
    });
    console.log('Login exitoso para:', email);
  } catch (err) {
    console.error('Error en login:', err.message);
    console.error('Stack trace:', err.stack);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor',
      error: err.message
    });
  }
};

exports.getUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['password'] }
    });
    res.json({
      success: true,
      usuario
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Solicitar reset de contraseña
exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Buscar el usuario por email
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email no encontrado' 
      });
    }
    
    // Generar token de reset
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpires = Date.now() + 3600000; // 1 hora
    
    // Actualizar usuario con token
    await usuario.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: new Date(resetExpires)
    });
    
    // Aquí se enviaría un email (pendiente implementación)
    
    res.json({
      success: true,
      message: 'Instrucciones enviadas a su email'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Verificar token de reset
exports.checkResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    
    const usuario = await Usuario.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() }
      }
    });
    
    if (!usuario) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
    
    res.json({
      success: true,
      message: 'Token válido'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Actualizar contraseña
exports.updatePassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    const usuario = await Usuario.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() }
      }
    });
    
    if (!usuario) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
    
    // Actualizar contraseña
    await usuario.update({
      password: await bcrypt.hash(password, 10),
      resetPasswordToken: null,
      resetPasswordExpires: null
    });
    
    res.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};
