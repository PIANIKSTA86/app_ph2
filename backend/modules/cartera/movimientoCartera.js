const { sequelize, Sequelize } = require('../../core/db');

// Modelo para movimientos de cartera
const MovimientoCartera = sequelize.define('MovimientoCartera', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  facturaId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  tipoMovimiento: {
    type: Sequelize.ENUM('Pago', 'Abono', 'Interés', 'Descuento', 'Ajuste'),
    allowNull: false
  },
  monto: {
    type: Sequelize.DECIMAL(12, 2),
    allowNull: false
  },
  fecha: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  descripcion: {
    type: Sequelize.TEXT
  },
  comprobante: {
    type: Sequelize.STRING
  },
  medioPago: {
    type: Sequelize.ENUM('Efectivo', 'Transferencia', 'Cheque', 'Tarjeta Crédito', 'Tarjeta Débito', 'PSE', 'Otro'),
    allowNull: false
  },
  bancoId: {
    type: Sequelize.INTEGER
  },
  referencia: {
    type: Sequelize.STRING
  },
  usuarioId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  aprobado: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  anulado: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  fechaAnulacion: {
    type: Sequelize.DATE
  },
  motivoAnulacion: {
    type: Sequelize.TEXT
  },
  usuarioAnulacionId: {
    type: Sequelize.INTEGER
  }
}, {
  tableName: 'movimientos_cartera',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

module.exports = {
  MovimientoCartera
};
