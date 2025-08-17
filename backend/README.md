# Sistema de Gestión para Propiedad Horizontal (SGPH)

Sistema integral de gestión administrativa y contable especializado para la Propiedad Horizontal, diseñado para facilitar la administración de conjuntos residenciales, edificios y condominios.

## Características Principales

El sistema cuenta con los siguientes módulos:

### Facturación
- Generación masiva de facturas
- Aplicación de conceptos con coeficientes
- Envío de facturas por correo electrónico
- Consulta de estado de facturas
- Reportes de facturación

### Presupuesto
- Creación de presupuestos anuales
- Distribución mensual de rubros
- Seguimiento a la ejecución presupuestal
- Comparativos de presupuesto vs. ejecución

### Contabilidad
- Plan de cuentas configurable
- Registro de asientos contables
- Libro diario, mayor y balances
- Centros de costo
- Estados financieros

### Activos Fijos
- Registro detallado de activos
- Cálculo automático de depreciación
- Seguimiento a mantenimientos
- Gestión de traslados
- Baja de activos

### Tesorería
- Gestión de cajas y bancos
- Registro de ingresos y egresos
- Conciliación bancaria
- Arqueos de caja
- Flujo de caja

### Compras y Proveedores
- Registro de proveedores
- Órdenes de compra
- Registro de facturas de proveedores
- Control de pagos a proveedores
- Informes de compras

### Gerencia Electrónica
- Programación de asambleas y consejos
- Registro de asistencia
- Votaciones electrónicas
- Generación de actas
- Repositorio documental

### Cartera
- Control de pagos
- Gestión de cartera por edades
- Intereses de mora
- Acuerdos de pago
- Reportes de cartera

### Inventario
- Control de elementos comunes
- Entrada y salida de inventario
- Alertas de stock mínimo
- Valorización de inventario

### NIIF
- Parametrización NIIF
- Estados financieros bajo NIIF
- Comparativos contables
- Reportes regulatorios

### Nómina
- Gestión de empleados
- Cálculo de nómina
- Liquidaciones
- Vacaciones y prestaciones
- Interfaz con contabilidad

### App Móvil para Propietarios
- Consulta de estado de cuenta
- Pagos en línea
- Comunicaciones y anuncios
- Reserva de zonas comunes
- Reporte de PQRs

## Requisitos del Sistema

- Node.js (v14.x o superior)
- Navegador web moderno (Chrome, Firefox, Edge)
- No se requiere instalar ninguna base de datos externa, ya que el sistema utiliza SQLite

## Instalación

### Backend

1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/sgph.git
cd sgph/backend
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar la base de datos
   - Copiar el archivo `.env.example` a `.env` (puedes mantener los valores predeterminados)
   - Inicializar la base de datos SQLite ejecutando:
```bash
npm run init-db
```

4. Iniciar el servidor en modo desarrollo
```bash
npm run dev
```

### Frontend (próximamente)

El frontend está en desarrollo y se incorporará a este repositorio en una versión futura.

## Estructura del Proyecto

```
backend/
│
├── config/                  # Configuraciones de la aplicación
│   └── default.js           # Configuración predeterminada
│
├── core/                    # Componentes principales del sistema
│   ├── auth.js              # Autenticación de usuarios
│   ├── authMiddleware.js    # Middleware de autenticación
│   ├── db.js                # Conexión a base de datos
│   ├── models.js            # Definición de modelos centrales
│   ├── propiedades.models.js # Modelos para gestión de propiedades
│   ├── server.js            # Configuración del servidor
│   └── usuario.js           # Modelo de usuarios
│
├── modules/                 # Módulos del sistema
│   ├── activos_fijos/       # Módulo de Activos Fijos
│   ├── api_movil/           # API para la app móvil
│   ├── cartera/             # Módulo de Cartera
│   ├── compras/             # Módulo de Compras y Proveedores
│   ├── contabilidad/        # Módulo de Contabilidad
│   ├── facturacion/         # Módulo de Facturación
│   ├── gerencia/            # Módulo de Gerencia Electrónica
│   ├── inventario/          # Módulo de Inventario
│   ├── niif/                # Módulo de NIIF
│   ├── nomina/              # Módulo de Nómina
│   ├── presupuesto/         # Módulo de Presupuesto
│   └── tesoreria/           # Módulo de Tesorería
│
├── index.js                 # Punto de entrada de la aplicación
└── package.json             # Dependencias y scripts
```

## Contribuciones

Las contribuciones son bienvenidas. Por favor, asegúrese de seguir las siguientes pautas:

1. Crear un fork del repositorio
2. Crear una rama para su funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Hacer commit de sus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Hacer push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - vea el archivo LICENSE para más detalles.

## Soporte

Para soporte técnico, contacte a nuestro equipo en soporte@sgph.com o abra un issue en este repositorio.

## Agradecimientos

- Inspirado en sistemas como Properix y VecindApp
