const { sequelize, Sequelize } = require('../../core/db');

// Modelo para cuentas contables
const CuentaContable = sequelize.define('CuentaContable', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false
  },
  descripcion: {
    type: Sequelize.TEXT
  },
  tipo: {
    type: Sequelize.ENUM('Activo', 'Pasivo', 'Patrimonio', 'Ingreso', 'Gasto'),
    allowNull: false
  },
  naturaleza: {
    type: Sequelize.ENUM('Débito', 'Crédito'),
    allowNull: false
  },
  cuentaPadreId: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  nivel: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  esAuxiliar: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  activo: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'cuentas_contables',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para asientos contables
const AsientoContable = sequelize.define('AsientoContable', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conjuntoId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  fecha: {
    type: Sequelize.DATE,
    allowNull: false
  },
  concepto: {
    type: Sequelize.STRING,
    allowNull: false
  },
  descripcion: {
    type: Sequelize.TEXT
  },
  numero: {
    type: Sequelize.STRING,
    allowNull: false
  },
  tipo: {
    type: Sequelize.ENUM('Manual', 'Automático'),
    defaultValue: 'Manual'
  },
  moduloOrigen: {
    type: Sequelize.STRING
  },
  referenciaOrigen: {
    type: Sequelize.STRING
  },
  totalDebito: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  totalCredito: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
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
  cerrado: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'asientos_contables',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para detalles de asiento contable (líneas del asiento)
const DetalleAsientoContable = sequelize.define('DetalleAsientoContable', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  asientoContableId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  cuentaContableId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  debito: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  credito: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  descripcion: {
    type: Sequelize.STRING
  },
  terceroId: {
    type: Sequelize.INTEGER
  },
  tipoTercero: {
    type: Sequelize.ENUM('Propietario', 'Proveedor', 'Empleado', 'Otro'),
    defaultValue: 'Otro'
  },
  centroCostoId: {
    type: Sequelize.INTEGER
  },
  documentoReferencia: {
    type: Sequelize.STRING
  }
}, {
  tableName: 'detalles_asientos_contables',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para libro diario
const LibroDiario = sequelize.define('LibroDiario', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conjuntoId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  fecha: {
    type: Sequelize.DATE,
    allowNull: false
  },
  cuentaContableId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  asientoContableId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  debito: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  credito: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  saldo: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  concepto: {
    type: Sequelize.STRING
  },
  terceroId: {
    type: Sequelize.INTEGER
  },
  tipoTercero: {
    type: Sequelize.ENUM('Propietario', 'Proveedor', 'Empleado', 'Otro'),
    defaultValue: 'Otro'
  },
  centroCostoId: {
    type: Sequelize.INTEGER
  },
  documentoReferencia: {
    type: Sequelize.STRING
  },
  anulado: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'libro_diario',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para centros de costo
const CentroCosto = sequelize.define('CentroCosto', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conjuntoId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  codigo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false
  },
  descripcion: {
    type: Sequelize.TEXT
  },
  activo: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'centros_costo',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para períodos contables
const PeriodoContable = sequelize.define('PeriodoContable', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conjuntoId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  anio: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  mes: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  estado: {
    type: Sequelize.ENUM('Abierto', 'Cerrado', 'Procesando'),
    defaultValue: 'Abierto'
  },
  fechaApertura: {
    type: Sequelize.DATE,
    allowNull: false
  },
  fechaCierre: {
    type: Sequelize.DATE
  },
  usuarioAperturaId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  usuarioCierreId: {
    type: Sequelize.INTEGER
  }
}, {
  tableName: 'periodos_contables',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Relaciones entre modelos
AsientoContable.hasMany(DetalleAsientoContable, { foreignKey: 'asientoContableId' });
DetalleAsientoContable.belongsTo(AsientoContable, { foreignKey: 'asientoContableId' });

DetalleAsientoContable.belongsTo(CuentaContable, { foreignKey: 'cuentaContableId' });
CuentaContable.hasMany(DetalleAsientoContable, { foreignKey: 'cuentaContableId' });

AsientoContable.hasMany(LibroDiario, { foreignKey: 'asientoContableId' });
LibroDiario.belongsTo(AsientoContable, { foreignKey: 'asientoContableId' });

LibroDiario.belongsTo(CuentaContable, { foreignKey: 'cuentaContableId' });
CuentaContable.hasMany(LibroDiario, { foreignKey: 'cuentaContableId' });

module.exports = {
  CuentaContable,
  AsientoContable,
  DetalleAsientoContable,
  LibroDiario,
  CentroCosto,
  PeriodoContable
};
