-- Creación de tablas iniciales

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'propietario',
    conjunto_id INTEGER,
    activo BOOLEAN DEFAULT TRUE,
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Conjuntos
CREATE TABLE IF NOT EXISTS conjuntos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    nit VARCHAR(20) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(255),
    representante_legal VARCHAR(255),
    administrador VARCHAR(255),
    revisor_fiscal VARCHAR(255),
    codigo_postal VARCHAR(20),
    ciudad VARCHAR(100) NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    pais VARCHAR(100) DEFAULT 'Colombia',
    logo VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Tipos de Propiedades
CREATE TABLE IF NOT EXISTS tipos_propiedades (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    ('Administrador', 'admin@sistema.com', '$2b$10$KV1XWWpzGY9jXmf0oZJGVe5U95nh2O9DYpiH.QBsCvl.nhVgakeTm', 'admin', true);
-- La contraseña por defecto es 'admin123' (hash en bcrypt)

-- Usuario contador por defecto
INSERT INTO usuarios (nombre, email, password, rol, activo)
VALUES 
    ('Contador', 'contador@sistema.com', '$2b$10$KV1XWWpzGY9jXmf0oZJGVe5U95nh2O9DYpiH.QBsCvl.nhVgakeTm', 'contador', true);
-- La contraseña por defecto es 'admin123' (hash en bcrypt)
