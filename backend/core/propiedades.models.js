const { sequelize, Sequelize } = require('./db');

// Modelo para el Conjunto Residencial
const Conjunto = sequelize.define('Conjunto', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false
  },
  direccion: {
    type: Sequelize.STRING,
    allowNull: false
  },
  nit: {
    type: Sequelize.STRING,
    allowNull: false
  },
  telefono: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  representanteLegal: {
    type: Sequelize.STRING
  },
  administrador: {
    type: Sequelize.STRING
  },
  revisorFiscal: {
    type: Sequelize.STRING
  },
  codigoPostal: {
    type: Sequelize.STRING
  },
  ciudad: {
    type: Sequelize.STRING,
    allowNull: false
  },
  departamento: {
    type: Sequelize.STRING,
    allowNull: false
  },
  pais: {
    type: Sequelize.STRING,
    defaultValue: 'Colombia'
  },
  logo: {
    type: Sequelize.STRING
  },
  activo: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'conjuntos',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para tipos de propiedad (apartamento, casa, local, parqueadero, etc)
const TipoPropiedad = sequelize.define('TipoPropiedad', {
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
    type: Sequelize.STRING
  },
  activo: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'tipos_propiedades',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para propiedades específicas
const Propiedad = sequelize.define('Propiedad', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conjuntoId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  tipoPropiedadId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  propietarioId: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  identificacion: {
    type: Sequelize.STRING, // Número/nombre de la propiedad (ej: Apto 101, Casa 5)
    allowNull: false
  },
  bloque: {
    type: Sequelize.STRING
  },
  torre: {
    type: Sequelize.STRING
  },
  piso: {
    type: Sequelize.STRING
  },
  area: {
    type: Sequelize.FLOAT // en metros cuadrados
  },
  coeficiente: {
    type: Sequelize.FLOAT // Coeficiente de propiedad horizontal
  },
  habitada: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  activo: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'propiedades',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para propietarios
const Propietario = sequelize.define('Propietario', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: Sequelize.INTEGER,
    allowNull: true // Permite crear propietarios sin usuario asociado inicialmente
  },
  tipoDocumento: {
    type: Sequelize.ENUM('CC', 'NIT', 'CE', 'Pasaporte'),
    defaultValue: 'CC'
  },
  numeroDocumento: {
    type: Sequelize.STRING,
    allowNull: false
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false
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
  direccionCorrespondencia: {
    type: Sequelize.STRING
  },
  notificacionesEmail: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  notificacionesSMS: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  activo: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'propietarios',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para residentes (personas que viven en la propiedad pero no son propietarios)
const Residente = sequelize.define('Residente', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  propiedadId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  usuarioId: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  tipoDocumento: {
    type: Sequelize.ENUM('CC', 'CE', 'Pasaporte'),
    defaultValue: 'CC'
  },
  numeroDocumento: {
    type: Sequelize.STRING,
    allowNull: false
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false
  },
  parentesco: {
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
  notificacionesEmail: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  notificacionesSMS: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  activo: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'residentes',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para áreas comunes
const AreaComun = sequelize.define('AreaComun', {
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
  capacidad: {
    type: Sequelize.INTEGER
  },
  horario: {
    type: Sequelize.STRING
  },
  reservable: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  costoReserva: {
    type: Sequelize.DECIMAL(10, 2),
    defaultValue: 0
  },
  activo: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'areas_comunes',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

module.exports = {
  Conjunto,
  TipoPropiedad,
  Propiedad,
  Propietario,
  Residente,
  AreaComun
};
