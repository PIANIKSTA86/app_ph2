import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Button, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  AlertTitle,
  Card,
  CardContent,
  Divider,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

// Datos de ejemplo para productos (simplificado)
const productosData = [
  { 
    id: 1, 
    codigo: 'PROD-001', 
    nombre: 'Bombillos LED', 
    categoria: 'Eléctricos',
    stockActual: 48,
    stockMinimo: 20,
    ubicacion: 'Almacén Central',
    ultimaEntrada: '2025-08-10'
  },
  { 
    id: 2, 
    codigo: 'PROD-002', 
    nombre: 'Pintura Blanca 5Gal', 
    categoria: 'Pinturas',
    stockActual: 12,
    stockMinimo: 15,
    ubicacion: 'Almacén Central',
    ultimaEntrada: '2025-08-05'
  },
  { 
    id: 3, 
    codigo: 'PROD-003', 
    nombre: 'Cemento 50kg', 
    categoria: 'Construcción',
    stockActual: 4,
    stockMinimo: 10,
    ubicacion: 'Bodega Externa',
    ultimaEntrada: '2025-07-20'
  }
];

// Función de TabPanel para el contenido de las pestañas
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`inventario-tabpanel-${index}`}
      aria-labelledby={`inventario-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Componente principal de Inventario
const InventarioPageNew = () => {
  // Estados básicos
  const [tabValue, setTabValue] = useState(0);
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Filtrar productos por término de búsqueda
  const filteredProductos = React.useMemo(() => {
    try {
      if (!productos || productos.length === 0) return [];
      
      return productos.filter(producto => {
        if (!producto) return false;
        
        const nombre = (producto.nombre || '').toLowerCase();
        const codigo = (producto.codigo || '').toLowerCase();
        const categoria = (producto.categoria || '').toLowerCase();
        const term = (searchTerm || '').toLowerCase();
        
        return nombre.includes(term) || 
               codigo.includes(term) || 
               categoria.includes(term);
      });
    } catch (err) {
      console.error("Error al filtrar productos:", err);
      return [];
    }
  }, [productos, searchTerm]);

  // Productos con alerta de stock bajo
  const productosAlerta = React.useMemo(() => {
    try {
      if (!productos || productos.length === 0) return [];
      return productos.filter(p => p.stockActual <= p.stockMinimo);
    } catch (err) {
      console.error("Error al filtrar alertas:", err);
      return [];
    }
  }, [productos]);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simular carga de datos con un pequeño retardo
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Cargar datos
        setProductos(productosData);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(err);
        setLoading(false);
        setSnackbar({
          open: true,
          message: 'Error al cargar datos de inventario',
          severity: 'error'
        });
      }
    };
    
    fetchData();
    
    // Manejar errores globales
    const handleWindowError = (event) => {
      console.error("Error no capturado:", event);
      setError(event.error || event);
    };
    
    window.addEventListener('error', handleWindowError);
    
    return () => {
      window.removeEventListener('error', handleWindowError);
    };
  }, []);

  // Manejar cambio de pestañas
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Manejar cierre de notificaciones
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Si hay error, mostrar mensaje
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          <AlertTitle>Error al cargar la página de inventario</AlertTitle>
          <Typography>
            {error.message || JSON.stringify(error) || 'Error desconocido'}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => window.location.reload()}
          >
            Recargar página
          </Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Inventario y Almacenes
      </Typography>
      
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="inventario-tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<InventoryIcon />} iconPosition="start" label="Productos" />
          <Tab 
            icon={<WarningIcon />} 
            iconPosition="start" 
            label={`Alertas (${productosAlerta.length})`} 
            sx={{ color: productosAlerta.length > 0 ? 'warning.main' : 'inherit' }}
          />
        </Tabs>
      </Paper>

      {/* Pestaña de Productos */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <TextField
            size="small"
            placeholder="Buscar productos..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
          >
            Nuevo Producto
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Categoría</TableCell>
                  <TableCell align="center">Stock Actual</TableCell>
                  <TableCell align="center">Stock Mínimo</TableCell>
                  <TableCell>Ubicación</TableCell>
                  <TableCell>Última Entrada</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProductos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No se encontraron productos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProductos.map(row => (
                    <TableRow 
                      key={row.id} 
                      hover
                      sx={{
                        backgroundColor: row.stockActual <= row.stockMinimo ? '#fff8e1' : 'inherit'
                      }}
                    >
                      <TableCell>{row.codigo}</TableCell>
                      <TableCell>{row.nombre}</TableCell>
                      <TableCell>{row.categoria}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={row.stockActual} 
                          color={
                            row.stockActual <= row.stockMinimo ? 'warning' : 'primary'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">{row.stockMinimo}</TableCell>
                      <TableCell>{row.ubicacion}</TableCell>
                      <TableCell>{row.ultimaEntrada}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      {/* Pestaña de Alertas */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>Productos con Bajo Stock</Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : productosAlerta.length === 0 ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            No hay productos con alerta de stock bajo
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {productosAlerta.map(producto => (
              <Grid item xs={12} md={6} lg={4} key={producto.id}>
                <Card sx={{ mb: 2 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <WarningIcon color="warning" sx={{ mr: 1 }} />
                      <Typography variant="h6">{producto.nombre}</Typography>
                    </Box>
                    <Divider sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Código: {producto.codigo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Categoría: {producto.categoria}
                    </Typography>
                    <Typography variant="body1" color="warning.main">
                      Stock Actual: {producto.stockActual} (Mínimo: {producto.stockMinimo})
                    </Typography>
                    <Typography variant="body2">
                      Ubicación: {producto.ubicacion}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InventarioPageNew;
