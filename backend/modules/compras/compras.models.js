const { sequelize, Sequelize } = require('../../core/db');

// Modelo para proveedores
const Proveedor = sequelize.define('Proveedor', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conjuntoId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  tipoDocumento: {
    type: Sequelize.ENUM('NIT', 'CC', 'CE', 'Pasaporte'),
    defaultValue: 'NIT'
  },
  numeroDocumento: {
    type: Sequelize.STRING,
    allowNull: false
  },
  digitoVerificacion: {
    type: Sequelize.STRING(1)
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false
  },
  razonSocial: {
    type: Sequelize.STRING
  },
  direccion: {
    type: Sequelize.STRING
  },
  ciudad: {
    type: Sequelize.STRING
  },
  departamento: {
    type: Sequelize.STRING
  },
  telefono: {
    type: Sequelize.STRING
  },
  celular: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  contacto: {
    type: Sequelize.STRING
  },
  telefonoContacto: {
    type: Sequelize.STRING
  },
  condicionPago: {
    type: Sequelize.STRING
  },
  plazoCredito: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  regimenTributario: {
    type: Sequelize.ENUM('Común', 'Simplificado', 'Gran Contribuyente'),
    defaultValue: 'Común'
  },
  activo: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  categoria: {
    type: Sequelize.STRING
  },
  cuentaContableId: {
    type: Sequelize.INTEGER
  },
  sitioWeb: {
    type: Sequelize.STRING
  },
  calificacion: {
    type: Sequelize.INTEGER,
    defaultValue: 3 // de 1 a 5
  },
  observaciones: {
    type: Sequelize.TEXT
  }
}, {
  tableName: 'proveedores',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para órdenes de compra
const OrdenCompra = sequelize.define('OrdenCompra', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conjuntoId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  proveedorId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  numeroOrden: {
    type: Sequelize.STRING,
    allowNull: false
  },
  fecha: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  fechaEntrega: {
    type: Sequelize.DATE
  },
  subtotal: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  iva: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  descuento: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  total: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  estado: {
    type: Sequelize.ENUM('Borrador', 'Pendiente', 'Aprobada', 'Recibida Parcial', 'Recibida', 'Cancelada'),
    defaultValue: 'Borrador'
  },
  formaPago: {
    type: Sequelize.STRING
  },
  plazoEntrega: {
    type: Sequelize.STRING
  },
  lugarEntrega: {
    type: Sequelize.STRING
  },
  observaciones: {
    type: Sequelize.TEXT
  },
  usuarioId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  aprobadaPor: {
    type: Sequelize.INTEGER
  },
  fechaAprobacion: {
    type: Sequelize.DATE
  },
  motivoRechazo: {
    type: Sequelize.TEXT
  },
  solicitante: {
    type: Sequelize.STRING
  },
  centroCostoId: {
    type: Sequelize.INTEGER
  },
  asientoContableId: {
    type: Sequelize.INTEGER
  }
}, {
  tableName: 'ordenes_compra',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para detalles de orden de compra
const DetalleOrdenCompra = sequelize.define('DetalleOrdenCompra', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ordenCompraId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  descripcion: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cantidad: {
    type: Sequelize.DECIMAL(12, 2),
    allowNull: false
  },
  unidadMedida: {
    type: Sequelize.STRING
  },
  precioUnitario: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  subtotal: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  iva: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  descuento: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  total: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  cantidadRecibida: {
    type: Sequelize.DECIMAL(12, 2),
    defaultValue: 0
  },
  cantidadPendiente: {
    type: Sequelize.DECIMAL(12, 2),
    allowNull: false
  },
  presupuestoRubroId: {
    type: Sequelize.INTEGER
  },
  cuentaContableId: {
    type: Sequelize.INTEGER
  },
  estado: {
    type: Sequelize.ENUM('Pendiente', 'Recibido Parcial', 'Recibido'),
    defaultValue: 'Pendiente'
  }
}, {
  tableName: 'detalles_orden_compra',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para compras (facturas de proveedores)
const Compra = sequelize.define('Compra', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conjuntoId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  proveedorId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  ordenCompraId: {
    type: Sequelize.INTEGER
  },
  numeroFactura: {
    type: Sequelize.STRING,
    allowNull: false
  },
  fecha: {
    type: Sequelize.DATE,
    allowNull: false
  },
  fechaVencimiento: {
    type: Sequelize.DATE,
    allowNull: false
  },
  subtotal: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  iva: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  retencionFuente: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  retencionICA: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  retencionIVA: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  descuento: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  total: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  estado: {
    type: Sequelize.ENUM('Pendiente', 'Pagada Parcial', 'Pagada', 'Anulada'),
    defaultValue: 'Pendiente'
  },
  observaciones: {
    type: Sequelize.TEXT
  },
  asientoContableId: {
    type: Sequelize.INTEGER
  },
  usuarioId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  formaPago: {
    type: Sequelize.STRING
  },
  imagenFactura: {
    type: Sequelize.STRING
  }
}, {
  tableName: 'compras',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para detalles de compra
const DetalleCompra = sequelize.define('DetalleCompra', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  compraId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  detalleOrdenCompraId: {
    type: Sequelize.INTEGER
  },
  descripcion: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cantidad: {
    type: Sequelize.DECIMAL(12, 2),
    allowNull: false
  },
  unidadMedida: {
    type: Sequelize.STRING
  },
  precioUnitario: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  subtotal: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  iva: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  descuento: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  total: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  presupuestoRubroId: {
    type: Sequelize.INTEGER
  },
  cuentaContableId: {
    type: Sequelize.INTEGER
  },
  centroCostoId: {
    type: Sequelize.INTEGER
  }
}, {
  tableName: 'detalles_compra',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para pagos a proveedores
const PagoProveedor = sequelize.define('PagoProveedor', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  compraId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  fecha: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  monto: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  medioPago: {
    type: Sequelize.ENUM('Efectivo', 'Transferencia', 'Cheque', 'Tarjeta Crédito', 'Otro'),
    allowNull: false
  },
  referencia: {
    type: Sequelize.STRING
  },
  bancoId: {
    type: Sequelize.INTEGER
  },
  cajaId: {
    type: Sequelize.INTEGER
  },
  observaciones: {
    type: Sequelize.TEXT
  },
  movimientoTesoreriaId: {
    type: Sequelize.INTEGER
  },
  asientoContableId: {
    type: Sequelize.INTEGER
  },
  usuarioId: {
    type: Sequelize.INTEGER,
    allowNull: false
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
  },
  comprobante: {
    type: Sequelize.STRING
  }
}, {
  tableName: 'pagos_proveedor',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Relaciones entre modelos
OrdenCompra.belongsTo(Proveedor, { foreignKey: 'proveedorId' });
Proveedor.hasMany(OrdenCompra, { foreignKey: 'proveedorId' });

OrdenCompra.hasMany(DetalleOrdenCompra, { foreignKey: 'ordenCompraId' });
DetalleOrdenCompra.belongsTo(OrdenCompra, { foreignKey: 'ordenCompraId' });

Compra.belongsTo(Proveedor, { foreignKey: 'proveedorId' });
Proveedor.hasMany(Compra, { foreignKey: 'proveedorId' });

Compra.belongsTo(OrdenCompra, { foreignKey: 'ordenCompraId' });
OrdenCompra.hasMany(Compra, { foreignKey: 'ordenCompraId' });

Compra.hasMany(DetalleCompra, { foreignKey: 'compraId' });
DetalleCompra.belongsTo(Compra, { foreignKey: 'compraId' });

DetalleCompra.belongsTo(DetalleOrdenCompra, { foreignKey: 'detalleOrdenCompraId' });
DetalleOrdenCompra.hasMany(DetalleCompra, { foreignKey: 'detalleOrdenCompraId' });

Compra.hasMany(PagoProveedor, { foreignKey: 'compraId' });
PagoProveedor.belongsTo(Compra, { foreignKey: 'compraId' });

module.exports = {
  Proveedor,
  OrdenCompra,
  DetalleOrdenCompra,
  Compra,
  DetalleCompra,
  PagoProveedor
};
