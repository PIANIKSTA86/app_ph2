const { sequelize, Sequelize } = require('../../core/db');

// Modelo para bancos
const Banco = sequelize.define('Banco', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conjuntoId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false
  },
  numeroCuenta: {
    type: Sequelize.STRING,
    allowNull: false
  },
  tipoCuenta: {
    type: Sequelize.ENUM('Ahorros', 'Corriente', 'Fiducia', 'Otro'),
    allowNull: false
  },
  saldoInicial: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  saldoActual: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  fechaApertura: {
    type: Sequelize.DATE
  },
  titular: {
    type: Sequelize.STRING
  },
  cuentaContableId: {
    type: Sequelize.INTEGER
  },
  activo: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  fechaUltimaConciliacion: {
    type: Sequelize.DATE
  },
  observaciones: {
    type: Sequelize.TEXT
  },
  contactoBanco: {
    type: Sequelize.STRING
  },
  telefonoContacto: {
    type: Sequelize.STRING
  }
}, {
  tableName: 'bancos',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para cajas
const Caja = sequelize.define('Caja', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conjuntoId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false
  },
  descripcion: {
    type: Sequelize.TEXT
  },
  saldoInicial: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  saldoActual: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  responsable: {
    type: Sequelize.STRING
  },
  cuentaContableId: {
    type: Sequelize.INTEGER
  },
  activo: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  maximoEfectivo: {
    type: Sequelize.DECIMAL(15, 2)
  },
  fechaUltimoArqueo: {
    type: Sequelize.DATE
  }
}, {
  tableName: 'cajas',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para movimientos de tesorería
const MovimientoTesoreria = sequelize.define('MovimientoTesoreria', {
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
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  tipo: {
    type: Sequelize.ENUM('Ingreso', 'Egreso', 'Transferencia'),
    allowNull: false
  },
  concepto: {
    type: Sequelize.STRING,
    allowNull: false
  },
  descripcion: {
    type: Sequelize.TEXT
  },
  monto: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  origenId: {
    type: Sequelize.INTEGER
  },
  tipoOrigen: {
    type: Sequelize.ENUM('Banco', 'Caja'),
    allowNull: false
  },
  destinoId: {
    type: Sequelize.INTEGER
  },
  tipoDestino: {
    type: Sequelize.ENUM('Banco', 'Caja', 'Externo'),
    allowNull: false
  },
  numeroComprobante: {
    type: Sequelize.STRING
  },
  referencia: {
    type: Sequelize.STRING
  },
  terceroId: {
    type: Sequelize.INTEGER
  },
  tipoTercero: {
    type: Sequelize.ENUM('Propietario', 'Proveedor', 'Empleado', 'Otro'),
    defaultValue: 'Otro'
  },
  asientoContableId: {
    type: Sequelize.INTEGER
  },
  centroCostoId: {
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
  imagen: {
    type: Sequelize.STRING
  }
}, {
  tableName: 'movimientos_tesoreria',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para conciliación bancaria
const ConciliacionBancaria = sequelize.define('ConciliacionBancaria', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bancoId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  fecha: {
    type: Sequelize.DATE,
    allowNull: false
  },
  periodo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  saldoLibros: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  saldoExtracto: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  diferencia: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  estado: {
    type: Sequelize.ENUM('Pendiente', 'En Proceso', 'Conciliada'),
    defaultValue: 'Pendiente'
  },
  usuarioId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  observaciones: {
    type: Sequelize.TEXT
  },
  archivoConciliacion: {
    type: Sequelize.STRING
  }
}, {
  tableName: 'conciliaciones_bancarias',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para partidas pendientes en conciliación
const PartidaConciliacion = sequelize.define('PartidaConciliacion', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conciliacionId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  fecha: {
    type: Sequelize.DATE,
    allowNull: false
  },
  descripcion: {
    type: Sequelize.STRING,
    allowNull: false
  },
  monto: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  tipo: {
    type: Sequelize.ENUM('Cheque no cobrado', 'Depósito en tránsito', 'Nota débito', 'Nota crédito', 'Error en libros', 'Otro'),
    allowNull: false
  },
  estado: {
    type: Sequelize.ENUM('Pendiente', 'Conciliado'),
    defaultValue: 'Pendiente'
  },
  movimientoId: {
    type: Sequelize.INTEGER
  },
  observaciones: {
    type: Sequelize.TEXT
  }
}, {
  tableName: 'partidas_conciliacion',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para arqueos de caja
const ArqueoCaja = sequelize.define('ArqueoCaja', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cajaId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  fecha: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  saldoLibros: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  saldoFisico: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  diferencia: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  observaciones: {
    type: Sequelize.TEXT
  },
  estado: {
    type: Sequelize.ENUM('Cuadrado', 'Sobrante', 'Faltante'),
    allowNull: false
  },
  responsable: {
    type: Sequelize.STRING,
    allowNull: false
  },
  supervisor: {
    type: Sequelize.STRING
  },
  asientoContableId: {
    type: Sequelize.INTEGER
  },
  detalleEfectivo: {
    type: Sequelize.JSON
  }
}, {
  tableName: 'arqueos_caja',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Relaciones entre modelos
ConciliacionBancaria.belongsTo(Banco, { foreignKey: 'bancoId' });
Banco.hasMany(ConciliacionBancaria, { foreignKey: 'bancoId' });

ConciliacionBancaria.hasMany(PartidaConciliacion, { foreignKey: 'conciliacionId' });
PartidaConciliacion.belongsTo(ConciliacionBancaria, { foreignKey: 'conciliacionId' });

ArqueoCaja.belongsTo(Caja, { foreignKey: 'cajaId' });
Caja.hasMany(ArqueoCaja, { foreignKey: 'cajaId' });

module.exports = {
  Banco,
  Caja,
  MovimientoTesoreria,
  ConciliacionBancaria,
  PartidaConciliacion,
  ArqueoCaja
};
