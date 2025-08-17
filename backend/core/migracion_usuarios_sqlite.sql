-- Creación de tablas iniciales para SQLite

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    rol TEXT NOT NULL DEFAULT 'propietario',
    conjunto_id INTEGER,
    activo INTEGER DEFAULT 1,
    reset_password_token TEXT,
    reset_password_expires DATETIME,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Conjuntos
CREATE TABLE IF NOT EXISTS conjuntos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    direccion TEXT NOT NULL,
    nit TEXT NOT NULL,
    telefono TEXT,
    email TEXT,
    representante_legal TEXT,
    administrador TEXT,
    revisor_fiscal TEXT,
    codigo_postal TEXT,
    ciudad TEXT NOT NULL,
    departamento TEXT NOT NULL,
    pais TEXT DEFAULT 'Colombia',
    logo TEXT,
    activo INTEGER DEFAULT 1,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Tipos de Propiedades
CREATE TABLE IF NOT EXISTS tipos_propiedades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    activo INTEGER DEFAULT 1,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos iniciales

-- Tipos de propiedades básicas
INSERT INTO tipos_propiedades (nombre, descripcion)
VALUES 
    ('Apartamento', 'Unidad residencial en edificio'),
    ('Casa', 'Vivienda independiente'),
    ('Local Comercial', 'Espacio para actividad comercial'),
    ('Parqueadero', 'Espacio para estacionamiento de vehículos'),
    ('Depósito', 'Espacio para almacenamiento');

-- Conjunto de ejemplo
INSERT INTO conjuntos (nombre, direccion, nit, telefono, email, ciudad, departamento)
VALUES 
    ('Conjunto Residencial Ejemplo', 'Calle Principal 123', '900123456-7', '601-1234567', 'admin@ejemplo.com', 'Bogotá', 'Cundinamarca');

-- Usuario administrador por defecto
INSERT INTO usuarios (nombre, email, password, rol, activo)
VALUES 
    ('Administrador', 'admin@sistema.com', '$2b$10$CuRQqHpX43CKVVgJBiPglORAWlLpUzvqg6k3Txz7NBdiTe6vB97ea', 'admin', 1);
-- La contraseña por defecto es 'admin123' (hash en bcrypt)

-- Usuario contador por defecto
INSERT INTO usuarios (nombre, email, password, rol, activo)
VALUES 
    ('Contador', 'contador@sistema.com', '$2b$10$CuRQqHpX43CKVVgJBiPglORAWlLpUzvqg6k3Txz7NBdiTe6vB97ea', 'contador', 1);
-- La contraseña por defecto es 'admin123' (hash en bcrypt)
