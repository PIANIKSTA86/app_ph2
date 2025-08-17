const { sequelize, Sequelize } = require('../../core/db');

// Modelo para reuniones (asambleas, consejos, comités)
const Reunion = sequelize.define('Reunion', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conjuntoId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  titulo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  tipo: {
    type: Sequelize.ENUM('Asamblea General', 'Asamblea Extraordinaria', 'Consejo de Administración', 'Comité de Convivencia', 'Otro'),
    allowNull: false
  },
  fecha: {
    type: Sequelize.DATE,
    allowNull: false
  },
  horaInicio: {
    type: Sequelize.TIME,
    allowNull: false
  },
  horaFin: {
    type: Sequelize.TIME
  },
  lugar: {
    type: Sequelize.STRING,
    allowNull: false
  },
  modalidad: {
    type: Sequelize.ENUM('Presencial', 'Virtual', 'Mixta'),
    defaultValue: 'Presencial'
  },
  enlaceVirtual: {
    type: Sequelize.STRING
  },
  estado: {
    type: Sequelize.ENUM('Programada', 'En Curso', 'Finalizada', 'Cancelada'),
    defaultValue: 'Programada'
  },
  quorum: {
    type: Sequelize.FLOAT
  },
  descripcion: {
    type: Sequelize.TEXT
  },
  convocadaPor: {
    type: Sequelize.STRING
  },
  fechaConvocatoria: {
    type: Sequelize.DATE
  },
  notificada: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  codigoAcceso: {
    type: Sequelize.STRING
  }
}, {
  tableName: 'reuniones',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para orden del día
const PuntoOrdenDia = sequelize.define('PuntoOrdenDia', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reunionId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  numero: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  titulo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  descripcion: {
    type: Sequelize.TEXT
  },
  duracionEstimada: {
    type: Sequelize.INTEGER // en minutos
  },
  responsable: {
    type: Sequelize.STRING
  },
  estado: {
    type: Sequelize.ENUM('Pendiente', 'En Discusión', 'Aprobado', 'Rechazado', 'Aplazado'),
    defaultValue: 'Pendiente'
  },
  comentarios: {
    type: Sequelize.TEXT
  },
  documentoId: {
    type: Sequelize.INTEGER
  }
}, {
  tableName: 'puntos_orden_dia',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para asistentes a reuniones
const AsistenteReunion = sequelize.define('AsistenteReunion', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reunionId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  tipo: {
    type: Sequelize.ENUM('Propietario', 'Representante', 'Administrador', 'Invitado'),
    allowNull: false
  },
  propietarioId: {
    type: Sequelize.INTEGER
  },
  usuarioId: {
    type: Sequelize.INTEGER
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING
  },
  coeficiente: {
    type: Sequelize.FLOAT
  },
  asistio: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  horaRegistro: {
    type: Sequelize.TIME
  },
  poderId: {
    type: Sequelize.INTEGER
  },
  notas: {
    type: Sequelize.TEXT
  },
  modalidadAsistencia: {
    type: Sequelize.ENUM('Presencial', 'Virtual'),
    defaultValue: 'Presencial'
  }
}, {
  tableName: 'asistentes_reunion',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para poderes (representación en asamblea)
const PoderAsamblea = sequelize.define('PoderAsamblea', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reunionId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  propietarioId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  representanteId: {
    type: Sequelize.INTEGER
  },
  nombreRepresentante: {
    type: Sequelize.STRING,
    allowNull: false
  },
  documentoRepresentante: {
    type: Sequelize.STRING,
    allowNull: false
  },
  fechaExpedicion: {
    type: Sequelize.DATE,
    allowNull: false
  },
  archivoPoder: {
    type: Sequelize.STRING
  },
  estado: {
    type: Sequelize.ENUM('Pendiente', 'Aprobado', 'Rechazado'),
    defaultValue: 'Pendiente'
  },
  motivo: {
    type: Sequelize.TEXT
  },
  revisadoPor: {
    type: Sequelize.INTEGER
  },
  fechaRevision: {
    type: Sequelize.DATE
  }
}, {
  tableName: 'poderes_asamblea',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para votaciones en reuniones
const Votacion = sequelize.define('Votacion', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reunionId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  puntoOrdenDiaId: {
    type: Sequelize.INTEGER
  },
  titulo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  descripcion: {
    type: Sequelize.TEXT
  },
  tipoVotacion: {
    type: Sequelize.ENUM('Normal', 'Secreta', 'Nominal', 'Coeficiente'),
    defaultValue: 'Normal'
  },
  estado: {
    type: Sequelize.ENUM('Pendiente', 'En Curso', 'Finalizada', 'Anulada'),
    defaultValue: 'Pendiente'
  },
  fechaInicio: {
    type: Sequelize.DATE
  },
  fechaFin: {
    type: Sequelize.DATE
  },
  quorumRequerido: {
    type: Sequelize.FLOAT
  },
  mayoriaRequerida: {
    type: Sequelize.FLOAT,
    defaultValue: 50.0
  },
  resultadoFavor: {
    type: Sequelize.FLOAT,
    defaultValue: 0
  },
  resultadoContra: {
    type: Sequelize.FLOAT,
    defaultValue: 0
  },
  resultadoAbstencion: {
    type: Sequelize.FLOAT,
    defaultValue: 0
  },
  resultadoBlanco: {
    type: Sequelize.FLOAT,
    defaultValue: 0
  },
  aprobada: {
    type: Sequelize.BOOLEAN
  },
  observaciones: {
    type: Sequelize.TEXT
  }
}, {
  tableName: 'votaciones',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para opciones de votación
const OpcionVotacion = sequelize.define('OpcionVotacion', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  votacionId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  texto: {
    type: Sequelize.STRING,
    allowNull: false
  },
  descripcion: {
    type: Sequelize.TEXT
  },
  orden: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  resultado: {
    type: Sequelize.FLOAT,
    defaultValue: 0
  }
}, {
  tableName: 'opciones_votacion',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para votos individuales
const Voto = sequelize.define('Voto', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  votacionId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  asistenteReunionId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  propiedadId: {
    type: Sequelize.INTEGER
  },
  opcionVotacionId: {
    type: Sequelize.INTEGER
  },
  seleccion: {
    type: Sequelize.ENUM('A favor', 'En contra', 'Abstención', 'En blanco', 'Opción'),
    allowNull: false
  },
  coeficiente: {
    type: Sequelize.FLOAT,
    defaultValue: 1
  },
  fecha: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  ip: {
    type: Sequelize.STRING
  }
}, {
  tableName: 'votos',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para actas
const Acta = sequelize.define('Acta', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reunionId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  numeroActa: {
    type: Sequelize.STRING,
    allowNull: false
  },
  contenido: {
    type: Sequelize.TEXT('long')
  },
  estado: {
    type: Sequelize.ENUM('Borrador', 'Pendiente de Aprobación', 'Aprobada', 'Registrada'),
    defaultValue: 'Borrador'
  },
  fechaAprobacion: {
    type: Sequelize.DATE
  },
  fechaRegistro: {
    type: Sequelize.DATE
  },
  archivoActa: {
    type: Sequelize.STRING
  },
  elaboradaPor: {
    type: Sequelize.STRING
  },
  aprobadaPor: {
    type: Sequelize.STRING
  },
  registradaEn: {
    type: Sequelize.STRING
  },
  numeroRegistro: {
    type: Sequelize.STRING
  },
  observaciones: {
    type: Sequelize.TEXT
  },
  firmas: {
    type: Sequelize.JSON
  }
}, {
  tableName: 'actas',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Modelo para documentos
const Documento = sequelize.define('Documento', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  conjuntoId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  tipo: {
    type: Sequelize.ENUM('Acta', 'Reglamento', 'Presupuesto', 'Financiero', 'Contrato', 'Correspondencia', 'Otro'),
    allowNull: false
  },
  titulo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  descripcion: {
    type: Sequelize.TEXT
  },
  archivo: {
    type: Sequelize.STRING
  },
  fechaDocumento: {
    type: Sequelize.DATE,
    allowNull: false
  },
  categoria: {
    type: Sequelize.STRING
  },
  visibilidad: {
    type: Sequelize.ENUM('Público', 'Propietarios', 'Consejo', 'Administración'),
    defaultValue: 'Administración'
  },
  usuarioId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  versionActual: {
    type: Sequelize.STRING
  },
  etiquetas: {
    type: Sequelize.STRING
  },
  fechaPublicacion: {
    type: Sequelize.DATE
  },
  fechaVencimiento: {
    type: Sequelize.DATE
  },
  notificado: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  descargas: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'documentos',
  timestamps: true,
  createdAt: 'fechaCreacion',
  updatedAt: 'fechaActualizacion'
});

// Relaciones entre modelos
Reunion.hasMany(PuntoOrdenDia, { foreignKey: 'reunionId' });
PuntoOrdenDia.belongsTo(Reunion, { foreignKey: 'reunionId' });

Reunion.hasMany(AsistenteReunion, { foreignKey: 'reunionId' });
AsistenteReunion.belongsTo(Reunion, { foreignKey: 'reunionId' });

Reunion.hasMany(PoderAsamblea, { foreignKey: 'reunionId' });
PoderAsamblea.belongsTo(Reunion, { foreignKey: 'reunionId' });

Reunion.hasMany(Votacion, { foreignKey: 'reunionId' });
Votacion.belongsTo(Reunion, { foreignKey: 'reunionId' });

PuntoOrdenDia.hasMany(Votacion, { foreignKey: 'puntoOrdenDiaId' });
Votacion.belongsTo(PuntoOrdenDia, { foreignKey: 'puntoOrdenDiaId' });

Votacion.hasMany(OpcionVotacion, { foreignKey: 'votacionId' });
OpcionVotacion.belongsTo(Votacion, { foreignKey: 'votacionId' });

Votacion.hasMany(Voto, { foreignKey: 'votacionId' });
Voto.belongsTo(Votacion, { foreignKey: 'votacionId' });

AsistenteReunion.hasMany(Voto, { foreignKey: 'asistenteReunionId' });
Voto.belongsTo(AsistenteReunion, { foreignKey: 'asistenteReunionId' });

OpcionVotacion.hasMany(Voto, { foreignKey: 'opcionVotacionId' });
Voto.belongsTo(OpcionVotacion, { foreignKey: 'opcionVotacionId' });

Reunion.hasOne(Acta, { foreignKey: 'reunionId' });
Acta.belongsTo(Reunion, { foreignKey: 'reunionId' });

module.exports = {
  Reunion,
  PuntoOrdenDia,
  AsistenteReunion,
  PoderAsamblea,
  Votacion,
  OpcionVotacion,
  Voto,
  Acta,
  Documento
};
