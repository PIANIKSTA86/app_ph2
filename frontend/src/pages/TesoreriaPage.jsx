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
  Divider,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  AttachMoney as AttachMoneyIcon,
  Payment as PaymentIcon,
  AccountBalance as AccountBalanceIcon
} from '@mui/icons-material';

// Panel de contenido para las pestañas
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tesoreria-tabpanel-${index}`}
      aria-labelledby={`tesoreria-tab-${index}`}
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

// Datos de ejemplo para los movimientos de caja
const movimientosData = [
  { 
    id: 1, 
    fecha: '2025-08-01', 
    descripcion: 'Pago de administración Apto 101',
    tipo: 'Ingreso',
    monto: 250000,
    metodoPago: 'Transferencia',
    responsable: 'Laura Gómez'
  },
  { 
    id: 2, 
    fecha: '2025-08-05', 
    descripcion: 'Pago servicio de vigilancia',
    tipo: 'Egreso',
    monto: 1800000,
    metodoPago: 'Transferencia',
    responsable: 'Carlos Pérez'
  },
  { 
    id: 3, 
    fecha: '2025-08-10', 
    descripcion: 'Mantenimiento jardines',
    tipo: 'Egreso',
    monto: 150000,
    metodoPago: 'Efectivo',
    responsable: 'Carlos Pérez'
  },
  { 
    id: 4, 
    fecha: '2025-08-15', 
    descripcion: 'Pago de administración Apto 202',
    tipo: 'Ingreso',
    monto: 250000,
    metodoPago: 'PSE',
    responsable: 'Laura Gómez'
  },
  { 
    id: 5, 
    fecha: '2025-08-20', 
    descripcion: 'Pago de administración Apto 303',
    tipo: 'Ingreso',
    monto: 250000,
    metodoPago: 'PSE',
    responsable: 'Laura Gómez'
  }
];

// Datos de ejemplo para los bancos
const bancosData = [
  {
    id: 1,
    nombre: 'Banco de Colombia',
    tipo: 'Cuenta Corriente',
    numero: '24578963124',
    saldo: 15800000,
    ultimoMovimiento: '2025-08-20'
  },
  {
    id: 2,
    nombre: 'Banco de Bogotá',
    tipo: 'Cuenta Ahorros',
    numero: '31245698712',
    saldo: 8500000,
    ultimoMovimiento: '2025-08-18'
  },
  {
    id: 3,
    nombre: 'Caja Menor',
    tipo: 'Efectivo',
    numero: 'N/A',
    saldo: 1200000,
    ultimoMovimiento: '2025-08-15'
  }
];

// Componente para la página de tesorería
const TesoreriaPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [movimientos, setMovimientos] = useState([]);
  const [bancos, setBancos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simular carga de datos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulando una llamada API con timeout
      setTimeout(() => {
        setMovimientos(movimientosData);
        setBancos(bancosData);
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

  // Calcular el total de ingresos y egresos
  const totalIngresos = movimientos
    .filter(mov => mov.tipo === 'Ingreso')
    .reduce((sum, mov) => sum + mov.monto, 0);
  
  const totalEgresos = movimientos
    .filter(mov => mov.tipo === 'Egreso')
    .reduce((sum, mov) => sum + mov.monto, 0);
  
  const saldoTotal = bancos.reduce((sum, banco) => sum + banco.saldo, 0);

  // Componente para la pestaña de Movimientos de Caja
  const MovimientosCaja = () => (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Registro de Movimientos</Typography>
        <Box>
          <Button 
            variant="contained" 
            color="success" 
            startIcon={<AttachMoneyIcon />}
            size="small"
            sx={{ mr: 1 }}
          >
            Registrar Ingreso
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            startIcon={<PaymentIcon />}
            size="small"
          >
            Registrar Egreso
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="right">Monto</TableCell>
              <TableCell>Método de Pago</TableCell>
              <TableCell>Responsable</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Cargando datos...</TableCell>
              </TableRow>
            ) : (
              movimientos.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.fecha}</TableCell>
                  <TableCell>{row.descripcion}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.tipo} 
                      color={row.tipo === 'Ingreso' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">{formatCurrency(row.monto)}</TableCell>
                  <TableCell>{row.metodoPago}</TableCell>
                  <TableCell>{row.responsable}</TableCell>
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

  // Componente para la pestaña de Cuentas Bancarias
  const CuentasBancarias = () => (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Cuentas Bancarias</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          size="small"
        >
          Agregar Cuenta
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Banco</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Número</TableCell>
              <TableCell align="right">Saldo Actual</TableCell>
              <TableCell>Último Movimiento</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Cargando datos...</TableCell>
              </TableRow>
            ) : (
              bancos.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{row.tipo}</TableCell>
                  <TableCell>{row.numero}</TableCell>
                  <TableCell align="right">{formatCurrency(row.saldo)}</TableCell>
                  <TableCell>{row.ultimoMovimiento}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" title="Ver movimientos">
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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tesorería
        </Typography>
      </Box>

      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                  <AccountBalanceIcon />
                </Avatar>
                <Typography color="textSecondary">
                  Saldo Total
                </Typography>
              </Box>
              <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                {formatCurrency(saldoTotal)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Todas las cuentas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: 'success.main', mr: 1 }}>
                  <AttachMoneyIcon />
                </Avatar>
                <Typography color="textSecondary">
                  Ingresos del Mes
                </Typography>
              </Box>
              <Typography variant="h5" component="div" sx={{ mt: 2, color: 'success.main' }}>
                {formatCurrency(totalIngresos)}
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
                <Avatar sx={{ bgcolor: 'error.main', mr: 1 }}>
                  <PaymentIcon />
                </Avatar>
                <Typography color="textSecondary">
                  Egresos del Mes
                </Typography>
              </Box>
              <Typography variant="h5" component="div" sx={{ mt: 2, color: 'error.main' }}>
                {formatCurrency(totalEgresos)}
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
          <Tab label="Movimientos de Caja" />
          <Tab label="Cuentas Bancarias" />
          <Tab label="Informes" />
        </Tabs>
        <Divider />
        
        <TabPanel value={tabValue} index={0}>
          <MovimientosCaja />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <CuentasBancarias />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" align="center" color="textSecondary" sx={{ py: 3 }}>
            Informes en desarrollo
          </Typography>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default TesoreriaPage;
