const { sequelize, Sequelize } = require('./db');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  rol: {
    type: Sequelize.ENUM('admin', 'gerente', 'contador', 'tesorero', 'propietario', 'residente'),
    allowNull: false,
    defaultValue: 'propietario'
  },
  conjunto_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
    field: 'conjunto_id'
  },
  activo: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  resetPasswordToken: {
    type: Sequelize.STRING,
    allowNull: true,
    field: 'reset_password_token'
  },
  resetPasswordExpires: {
    type: Sequelize.DATE,
    allowNull: true,
    field: 'reset_password_expires'
  }
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'fecha_creacion',
  updatedAt: 'fecha_actualizacion',
  underscored: true
});

module.exports = Usuario;
