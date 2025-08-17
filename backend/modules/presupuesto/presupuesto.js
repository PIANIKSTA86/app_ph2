const { sequelize, Sequelize } = require('../../core/db');

// Modelo para presupuestos
const Presupuesto = sequelize.define('Presupuesto', {
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
  anio: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  descripcion: {
    type: Sequelize.TEXT
  },
  montoTotal: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  estado: {
    type: Sequelize.ENUM('Borrador', 'Aprobado', 'Ejecutándose', 'Finalizado', 'Anulado'),
    defaultValue: 'Borrador'
  },
  fechaAprobacion: {
    type: Sequelize.DATE
  },
  documentoAprobacion: {
    type: Sequelize.STRING
  },
  activo: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  fechaInicio: {
    type: Sequelize.DATE
  },
  fechaFin: {
    type: Sequelize.DATE
  }
}, {
  tableName: 'presupuestos',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para rubros de presupuesto
const RubroPresupuesto = sequelize.define('RubroPresupuesto', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  presupuestoId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  codigo: {
    type: Sequelize.STRING
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false
  },
  descripcion: {
    type: Sequelize.TEXT
  },
  montoPresupuestado: {
    type: Sequelize.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  montoEjecutado: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  tipo: {
    type: Sequelize.ENUM('Ingreso', 'Gasto'),
    allowNull: false
  },
  cuentaContableId: {
    type: Sequelize.INTEGER
  },
  distribucionMensual: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  activo: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  // Distribución mensual (si aplica)
  enero: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  febrero: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  marzo: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  abril: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  mayo: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  junio: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  julio: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  agosto: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  septiembre: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  octubre: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  noviembre: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  },
  diciembre: {
    type: Sequelize.DECIMAL(15, 2),
    defaultValue: 0
  }
}, {
  tableName: 'rubros_presupuesto',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

module.exports = {
  Presupuesto,
  RubroPresupuesto
};
