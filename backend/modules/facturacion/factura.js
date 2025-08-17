const { sequelize, Sequelize } = require('../../core/db');

// Modelo para facturas
const Factura = sequelize.define('Factura', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  propiedadId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  numeroFactura: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  fechaEmision: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  fechaVencimiento: {
    type: Sequelize.DATE,
    allowNull: false
  },
  subtotal: {
    type: Sequelize.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  descuento: {
    type: Sequelize.DECIMAL(12, 2),
    defaultValue: 0
  },
  iva: {
    type: Sequelize.DECIMAL(12, 2),
    defaultValue: 0
  },
  total: {
    type: Sequelize.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0
  },
  estado: {
    type: Sequelize.ENUM('Pendiente', 'Pagada', 'Parcial', 'Vencida', 'Anulada'),
    defaultValue: 'Pendiente'
  },
  observaciones: {
    type: Sequelize.TEXT
  },
  periodoFacturado: {
    type: Sequelize.STRING,
    allowNull: false
  },
  urlPDF: {
    type: Sequelize.STRING
  },
  enviada: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  notificada: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'facturas',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para detalles de factura
const DetalleFactura = sequelize.define('DetalleFactura', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  facturaId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  concepto: {
    type: Sequelize.STRING,
    allowNull: false
  },
  descripcion: {
    type: Sequelize.TEXT
  },
  cantidad: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  valorUnitario: {
    type: Sequelize.DECIMAL(12, 2),
    allowNull: false
  },
  subtotal: {
    type: Sequelize.DECIMAL(12, 2),
    allowNull: false
  },
  iva: {
    type: Sequelize.DECIMAL(12, 2),
    defaultValue: 0
  },
  descuento: {
    type: Sequelize.DECIMAL(12, 2),
    defaultValue: 0
  },
  total: {
    type: Sequelize.DECIMAL(12, 2),
    allowNull: false
  },
  cuentaContableId: {
    type: Sequelize.INTEGER
  },
  presupuestoRubroId: {
    type: Sequelize.INTEGER
  }
}, {
  tableName: 'detalles_facturas',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

module.exports = {
  Factura,
  DetalleFactura
};
