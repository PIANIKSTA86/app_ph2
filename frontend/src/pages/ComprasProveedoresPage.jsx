import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Grid, 
  Box, 
  Button, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Tab,
  Tabs
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';

// Panel de contenido para las pestañas
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`compras-tabpanel-${index}`}
      aria-labelledby={`compras-tab-${index}`}
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

// Datos de ejemplo para las órdenes de compra
const ordenesCompraData = [
  { 
    id: 1, 
    numero: 'OC-2025-001', 
    fecha: '2025-08-01', 
    proveedor: 'Distribuidora Nacional Ltda.', 
    estado: 'Completada', 
    total: 2500000,
    fechaEntrega: '2025-08-10'
  },
  { 
    id: 2, 
    numero: 'OC-2025-002', 
    fecha: '2025-08-05', 
    proveedor: 'Suministros ABC S.A.', 
    estado: 'Pendiente', 
    total: 1800000,
    fechaEntrega: '2025-08-15'
  },
  { 
    id: 3, 
    numero: 'OC-2025-003', 
    fecha: '2025-08-12', 
    proveedor: 'Equipos Técnicos S.A.S', 
    estado: 'En proceso', 
    total: 3500000,
    fechaEntrega: '2025-08-30'
  },
  { 
    id: 4, 
    numero: 'OC-2025-004', 
    fecha: '2025-08-18', 
    proveedor: 'Distribuidora Nacional Ltda.', 
    estado: 'Pendiente', 
    total: 1200000,
    fechaEntrega: '2025-09-05'
  }
];

// Datos de ejemplo para los proveedores
const proveedoresData = [
  {
    id: 1,
    nombre: 'Distribuidora Nacional Ltda.',
    contacto: 'Juan Pérez',
    telefono: '310-456-7890',
    email: 'contacto@distribuidoranacional.com',
    categoria: 'Materiales',
    estado: 'Activo'
  },
  {
    id: 2,
    nombre: 'Suministros ABC S.A.',
    contacto: 'María González',
    telefono: '315-789-4561',
    email: 'ventas@suministrosabc.com',
    categoria: 'Suministros',
    estado: 'Activo'
  },
  {
    id: 3,
    nombre: 'Equipos Técnicos S.A.S',
    contacto: 'Carlos Rodríguez',
    telefono: '300-123-4567',
    email: 'info@equipostecnicos.com',
    categoria: 'Equipos',
    estado: 'Activo'
  },
  {
    id: 4,
    nombre: 'Servicios Generales Ltda.',
    contacto: 'Ana Martínez',
    telefono: '320-567-8901',
    email: 'servicios@serviciosgenerales.com',
    categoria: 'Servicios',
    estado: 'Inactivo'
  },
  {
    id: 5,
    nombre: 'Mantenimientos Express S.A.',
    contacto: 'Luis Vargas',
    telefono: '311-234-5678',
    email: 'contacto@mantenimientosexpress.com',
    categoria: 'Mantenimiento',
    estado: 'Activo'
  }
];

// Componente para la página de compras y proveedores
const ComprasProveedoresPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [ordenesCompra, setOrdenesCompra] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  // Simular carga de datos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulando una llamada API con timeout
      setTimeout(() => {
        setOrdenesCompra(ordenesCompraData);
        setProveedores(proveedoresData);
        setLoading(false);
      }, 800);
    };

    fetchData();
  }, []);

  // Manejar cambios de pestañas
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Manejar cambios en el campo de búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Abrir y cerrar diálogo para nuevo proveedor
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Función para formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Filtrar proveedores basados en el término de búsqueda
  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Componente para la pestaña de Órdenes de Compra
  const OrdenesCompraTab = () => (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Órdenes de Compra</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<ShoppingCartIcon />}
          size="small"
        >
          Nueva Orden
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Número</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Fecha Entrega</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Cargando datos...</TableCell>
              </TableRow>
            ) : (
              ordenesCompra.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.numero}</TableCell>
                  <TableCell>{row.fecha}</TableCell>
                  <TableCell>{row.proveedor}</TableCell>
                  <TableCell>{row.fechaEntrega}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.estado} 
                      color={
                        row.estado === 'Completada' ? 'success' : 
                        row.estado === 'En proceso' ? 'primary' : 'warning'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">{formatCurrency(row.total)}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" title="Ver detalles">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Editar">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  // Componente para la pestaña de Proveedores
  const ProveedoresTab = () => (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" width="50%">
          <TextField
            variant="outlined"
            placeholder="Buscar proveedor..."
            fullWidth
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          size="small"
          onClick={handleOpenDialog}
        >
          Nuevo Proveedor
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Contacto</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Cargando datos...</TableCell>
              </TableRow>
            ) : filteredProveedores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No se encontraron proveedores</TableCell>
              </TableRow>
            ) : (
              filteredProveedores.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{row.contacto}</TableCell>
                  <TableCell>{row.telefono}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.categoria}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.estado} 
                      color={row.estado === 'Activo' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" title="Ver detalles">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Editar">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para agregar nuevo proveedor */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Nombre Empresa"
                fullWidth
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nombre Contacto"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Teléfono"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                variant="outlined"
                type="email"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Categoría</InputLabel>
                <Select
                  label="Categoría"
                  defaultValue=""
                >
                  <MenuItem value="Materiales">Materiales</MenuItem>
                  <MenuItem value="Suministros">Suministros</MenuItem>
                  <MenuItem value="Equipos">Equipos</MenuItem>
                  <MenuItem value="Servicios">Servicios</MenuItem>
                  <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Estado</InputLabel>
                <Select
                  label="Estado"
                  defaultValue="Activo"
                >
                  <MenuItem value="Activo">Activo</MenuItem>
                  <MenuItem value="Inactivo">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Dirección"
                fullWidth
                variant="outlined"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notas"
                fullWidth
                variant="outlined"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCloseDialog}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  // Calcular estadísticas
  const totalOrdenes = ordenesCompra.reduce((sum, orden) => sum + orden.total, 0);
  const proveedoresActivos = proveedores.filter(p => p.estado === 'Activo').length;
  const ordenesPendientes = ordenesCompra.filter(o => o.estado === 'Pendiente').length;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Compras y Proveedores
        </Typography>
      </Box>

      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ShoppingCartIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="textSecondary">
                  Total en Compras
                </Typography>
              </Box>
              <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                {formatCurrency(totalOrdenes)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Mes actual
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PersonIcon color="success" sx={{ mr: 1 }} />
                <Typography color="textSecondary">
                  Proveedores Activos
                </Typography>
              </Box>
              <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                {proveedoresActivos}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                De {proveedores.length} registrados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <LocalShippingIcon color="warning" sx={{ mr: 1 }} />
                <Typography color="textSecondary">
                  Órdenes Pendientes
                </Typography>
              </Box>
              <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                {ordenesPendientes}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Por entregar
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pestañas de contenido */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Órdenes de Compra" />
          <Tab label="Proveedores" />
          <Tab label="Solicitudes de Compra" />
        </Tabs>
        <Divider />
        
        <TabPanel value={tabValue} index={0}>
          <OrdenesCompraTab />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <ProveedoresTab />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" align="center" color="textSecondary" sx={{ py: 3 }}>
            Módulo de Solicitudes en desarrollo
          </Typography>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default ComprasProveedoresPage;
