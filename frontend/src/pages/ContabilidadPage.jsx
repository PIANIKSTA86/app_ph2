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
  Tab,
  Tabs,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  BarChart as BarChartIcon,
  AccountBalance as AccountBalanceIcon,
  ReceiptLong as ReceiptLongIcon
} from '@mui/icons-material';

// Panel de contenido para las pestañas
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`contabilidad-tabpanel-${index}`}
      aria-labelledby={`contabilidad-tab-${index}`}
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

// Datos de ejemplo para los asientos contables
const asientosData = [
  { 
    id: 1, 
    fecha: '2023-08-01', 
    concepto: 'Pago de administración Apto 101',
    tipo: 'Ingreso',
    monto: 250000,
    estado: 'Conciliado'
  },
  { 
    id: 2, 
    fecha: '2023-08-05', 
    concepto: 'Pago servicio de vigilancia',
    tipo: 'Gasto',
    monto: 3800000,
    estado: 'Conciliado'
  },
  { 
    id: 3, 
    fecha: '2023-08-10', 
    concepto: 'Mantenimiento ascensores',
    tipo: 'Gasto',
    monto: 450000,
    estado: 'Pendiente'
  },
  { 
    id: 4, 
    fecha: '2023-08-15', 
    concepto: 'Pago de administración Apto 202',
    tipo: 'Ingreso',
    monto: 250000,
    estado: 'Conciliado'
  },
  { 
    id: 5, 
    fecha: '2023-08-20', 
    concepto: 'Servicios de aseo',
    tipo: 'Gasto',
    monto: 1200000,
    estado: 'Pendiente'
  }
];

// Datos de ejemplo para los informes financieros
const informesFinancierosData = [
  {
    id: 1,
    nombre: 'Balance General',
    periodo: 'Agosto 2025',
    fechaGeneracion: '2025-08-31',
    estado: 'Publicado'
  },
  {
    id: 2,
    nombre: 'Estado de Resultados',
    periodo: 'Agosto 2025',
    fechaGeneracion: '2025-08-31',
    estado: 'Publicado'
  },
  {
    id: 3,
    nombre: 'Flujo de Efectivo',
    periodo: 'Agosto 2025',
    fechaGeneracion: '2025-08-31',
    estado: 'Publicado'
  },
  {
    id: 4,
    nombre: 'Balance General',
    periodo: 'Julio 2025',
    fechaGeneracion: '2025-07-31',
    estado: 'Publicado'
  },
  {
    id: 5,
    nombre: 'Estado de Resultados',
    periodo: 'Julio 2025',
    fechaGeneracion: '2025-07-31',
    estado: 'Publicado'
  }
];

// Componente para la página de contabilidad
const ContabilidadPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [asientos, setAsientos] = useState([]);
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simular carga de datos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulando una llamada API con timeout
      setTimeout(() => {
        setAsientos(asientosData);
        setInformes(informesFinancierosData);
        setLoading(false);
      }, 800);
    };

    fetchData();
  }, []);

  // Manejar cambios de pestañas
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Función para formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Componente para la pestaña de Asientos Contables
  const AsientosContables = () => (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Asientos Contables</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          size="small"
        >
          Nuevo Asiento
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Concepto</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="right">Monto</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Cargando datos...</TableCell>
              </TableRow>
            ) : (
              asientos.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.fecha}</TableCell>
                  <TableCell>{row.concepto}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.tipo} 
                      color={row.tipo === 'Ingreso' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">{formatCurrency(row.monto)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.estado} 
                      color={row.estado === 'Conciliado' ? 'primary' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
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

  // Componente para la pestaña de Informes Financieros
  const InformesFinancieros = () => (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Informes Financieros</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<BarChartIcon />}
          size="small"
        >
          Generar Informe
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Periodo</TableCell>
              <TableCell>Fecha Generación</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Cargando datos...</TableCell>
              </TableRow>
            ) : (
              informes.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{row.periodo}</TableCell>
                  <TableCell>{row.fechaGeneracion}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.estado} 
                      color="primary"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" title="Ver">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Descargar">
                      <DownloadIcon fontSize="small" />
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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Contabilidad
        </Typography>
      </Box>

      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AccountBalanceIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="textSecondary">
                  Balance General
                </Typography>
              </Box>
              <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                {formatCurrency(125000000)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Activos totales
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <BarChartIcon color="success" sx={{ mr: 1 }} />
                <Typography color="textSecondary">
                  Ingresos del Mes
                </Typography>
              </Box>
              <Typography variant="h5" component="div" sx={{ mt: 2, color: 'success.main' }}>
                {formatCurrency(12500000)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Agosto 2025
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ReceiptLongIcon color="error" sx={{ mr: 1 }} />
                <Typography color="textSecondary">
                  Gastos del Mes
                </Typography>
              </Box>
              <Typography variant="h5" component="div" sx={{ mt: 2, color: 'error.main' }}>
                {formatCurrency(9800000)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Agosto 2025
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
          <Tab label="Asientos Contables" />
          <Tab label="Informes Financieros" />
          <Tab label="Plan de Cuentas" />
        </Tabs>
        <Divider />
        
        <TabPanel value={tabValue} index={0}>
          <AsientosContables />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <InformesFinancieros />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" align="center" color="textSecondary" sx={{ py: 3 }}>
            Plan de cuentas en desarrollo
          </Typography>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default ContabilidadPage;
