const express = require('express');
const cors = require('cors');
const config = require('config');
const morgan = require('morgan');
const { sequelize } = require('./db');
const authMiddleware = require('./authMiddleware');
const authRoutes = require('./auth.routes');

// Import route modules
let facturacionRoutes, presupuestoRoutes, carteraRoutes, inventarioRoutes;

// Importar solo las rutas que existen
try {
  facturacionRoutes = require('../modules/facturacion/facturacion.routes');
  console.log('Rutas de facturación cargadas');
} catch (error) {
  console.log('Rutas de facturación no disponibles:', error.message);
  facturacionRoutes = express.Router();
}

try {
  presupuestoRoutes = require('../modules/presupuesto/presupuesto.routes');
  console.log('Rutas de presupuesto cargadas');
} catch (error) {
  console.log('Rutas de presupuesto no disponibles:', error.message);
  presupuestoRoutes = express.Router();
}

try {
  carteraRoutes = require('../modules/cartera/cartera.routes');
  console.log('Rutas de cartera cargadas');
} catch (error) {
  console.log('Rutas de cartera no disponibles:', error.message);
  carteraRoutes = express.Router();
}

try {
  inventarioRoutes = require('../modules/inventario/inventario.routes');
  console.log('Rutas de inventario cargadas');
} catch (error) {
  console.log('Rutas de inventario no disponibles:', error.message);
  inventarioRoutes = express.Router();
}

// Routers vacíos para los módulos que aún no existen
const contabilidadRoutes = express.Router();
const activosFijosRoutes = express.Router();
const tesoreriaRoutes = express.Router();
const comprasRoutes = express.Router();
const gerenciaRoutes = express.Router();
const niifRoutes = express.Router();
const nominaRoutes = express.Router();
const apiMovilRoutes = express.Router();

// Init Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API funcionando correctamente' });
});

// Debug route to see request details
app.post('/debug', (req, res) => {
  console.log('DEBUG - Headers:', req.headers);
  console.log('DEBUG - Body:', req.body);
  console.log('DEBUG - Query:', req.query);
  res.json({ 
    headers: req.headers,
    body: req.body,
    query: req.query
  });
});

// Direct login route at root level
app.post('/login', require('./auth').login);

// Test login route that doesn't require auth middleware
app.post('/test-login', async (req, res) => {
  try {
    console.log('Test login requested');
    console.log('Body:', req.body);
    console.log('Query:', req.query);
    
    const email = req.body.email || req.query.email || 'admin@sistema.com';
    const password = req.body.password || req.query.password || 'admin123';
    
    res.json({
      success: true,
      message: 'Ruta de prueba funcionando',
      receivedCredentials: { email, password }
    });
  } catch (error) {
    console.error('Error en test-login:', error);
    res.status(500).json({
      success: false,
      message: 'Error en la ruta de prueba',
      error: error.message
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/facturacion', facturacionRoutes);
app.use('/api/presupuesto', presupuestoRoutes);
app.use('/api/cartera', carteraRoutes);
app.use('/api/contabilidad', contabilidadRoutes);
app.use('/api/activos-fijos', activosFijosRoutes);
app.use('/api/tesoreria', tesoreriaRoutes);
app.use('/api/compras', comprasRoutes);
app.use('/api/gerencia', gerenciaRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/niif', niifRoutes);
app.use('/api/nomina', nominaRoutes);
app.use('/api/movil', apiMovilRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: err.message
  });
});

// Start server
const PORT = config.get('port') || 3000;
const HOST = '0.0.0.0'; // Bind to all available network interfaces

app.listen(PORT, HOST, async () => {
  console.log(`Servidor ejecutándose en http://${HOST}:${PORT}`);
  console.log(`Try accessing: http://localhost:${PORT}`);
  
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida correctamente.');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
});

module.exports = app;
