const { sequelize, Sequelize } = require('../../core/db');

// Modelo para activos fijos
const ActivoFijo = sequelize.define('ActivoFijo', {
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
  fechaAdquisicion: {
    type: Sequelize.DATE,
    allowNull: false
  },
  valorCompra: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  valorResidual: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  vidaUtilAnios: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  categoriaId: {
    type: Sequelize.INTEGER
  },
  ubicacion: {
    type: Sequelize.STRING
  },
  estado: {
    type: Sequelize.ENUM('Activo', 'Inactivo', 'En Mantenimiento', 'Dado de Baja'),
    defaultValue: 'Activo'
  },
  fechaBaja: {
    type: Sequelize.DATE
  },
  motivoBaja: {
    type: Sequelize.TEXT
  },
  proveedorId: {
    type: Sequelize.INTEGER
  },
  numeroFactura: {
    type: Sequelize.STRING
  },
  valorActual: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  metodoProrrateo: {
    type: Sequelize.ENUM('Lineal', 'Suma de dígitos', 'Unidades de producción'),
    defaultValue: 'Lineal'
  },
  cuentaActivoId: {
    type: Sequelize.INTEGER
  },
  cuentaDepreciacionId: {
    type: Sequelize.INTEGER
  },
  cuentaGastoId: {
    type: Sequelize.INTEGER
  },
  centroCostoId: {
    type: Sequelize.INTEGER
  },
  tipoActivo: {
    type: Sequelize.ENUM('Mueble', 'Inmueble', 'Equipo', 'Vehículo', 'Otro'),
    defaultValue: 'Otro'
  },
  imagen: {
    type: Sequelize.STRING
  },
  caracteristicas: {
    type: Sequelize.JSON
  },
  observaciones: {
    type: Sequelize.TEXT
  },
  fechaUltimaDepreciacion: {
    type: Sequelize.DATE
  },
  depreciacionAcumulada: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  }
}, {
  tableName: 'activos_fijos',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para categorías de activos fijos
const CategoriaActivoFijo = sequelize.define('CategoriaActivoFijo', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false
  },
  descripcion: {
    type: Sequelize.TEXT
  },
  vidaUtilAnios: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  porcentajeDepreciacionAnual: {
    type: Sequelize.DECIMAL(5, 2),
    allowNull: false
  },
  cuentaActivoId: {
    type: Sequelize.INTEGER
  },
  cuentaDepreciacionId: {
    type: Sequelize.INTEGER
  },
  cuentaGastoId: {
    type: Sequelize.INTEGER
  },
  activo: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'categorias_activos_fijos',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para depreciaciones de activos fijos
const DepreciacionActivoFijo = sequelize.define('DepreciacionActivoFijo', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  activoFijoId: {
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
  montoDepreciacion: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  depreciacionAcumulada: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  valorLibros: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  asientoContableId: {
    type: Sequelize.INTEGER
  },
  observaciones: {
    type: Sequelize.TEXT
  }
}, {
  tableName: 'depreciaciones_activos_fijos',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para mantenimientos de activos fijos
const MantenimientoActivoFijo = sequelize.define('MantenimientoActivoFijo', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  activoFijoId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  fecha: {
    type: Sequelize.DATE,
    allowNull: false
  },
  tipo: {
    type: Sequelize.ENUM('Preventivo', 'Correctivo', 'Mejora'),
    allowNull: false
  },
  descripcion: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  costo: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false
  },
  proveedorId: {
    type: Sequelize.INTEGER
  },
  factura: {
    type: Sequelize.STRING
  },
  responsable: {
    type: Sequelize.STRING
  },
  resultado: {
    type: Sequelize.TEXT
  },
  proximoMantenimiento: {
    type: Sequelize.DATE
  },
  asientoContableId: {
    type: Sequelize.INTEGER
  }
}, {
  tableName: 'mantenimientos_activos_fijos',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para traslados de activos fijos
const TrasladoActivoFijo = sequelize.define('TrasladoActivoFijo', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  activoFijoId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  fecha: {
    type: Sequelize.DATE,
    allowNull: false
  },
  ubicacionAnterior: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ubicacionNueva: {
    type: Sequelize.STRING,
    allowNull: false
  },
  responsableAnterior: {
    type: Sequelize.STRING
  },
  responsableNuevo: {
    type: Sequelize.STRING
  },
  motivo: {
    type: Sequelize.TEXT
  },
  usuarioId: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'traslados_activos_fijos',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Relaciones entre modelos
ActivoFijo.belongsTo(CategoriaActivoFijo, { foreignKey: 'categoriaId' });
CategoriaActivoFijo.hasMany(ActivoFijo, { foreignKey: 'categoriaId' });

ActivoFijo.hasMany(DepreciacionActivoFijo, { foreignKey: 'activoFijoId' });
DepreciacionActivoFijo.belongsTo(ActivoFijo, { foreignKey: 'activoFijoId' });

ActivoFijo.hasMany(MantenimientoActivoFijo, { foreignKey: 'activoFijoId' });
MantenimientoActivoFijo.belongsTo(ActivoFijo, { foreignKey: 'activoFijoId' });

ActivoFijo.hasMany(TrasladoActivoFijo, { foreignKey: 'activoFijoId' });
TrasladoActivoFijo.belongsTo(ActivoFijo, { foreignKey: 'activoFijoId' });

module.exports = {
  ActivoFijo,
  CategoriaActivoFijo,
  DepreciacionActivoFijo,
  MantenimientoActivoFijo,
  TrasladoActivoFijo
};
