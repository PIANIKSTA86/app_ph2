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
  Divider,
  Tab,
  Tabs,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  FilePresent as FileIcon,
  EventNote as EventIcon,
  AttachMoney as MoneyIcon,
  Group as GroupIcon
} from '@mui/icons-material';

// Panel de contenido para las pestañas
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nomina-tabpanel-${index}`}
      aria-labelledby={`nomina-tab-${index}`}
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

// Datos de ejemplo para los empleados
const empleadosData = [
  {
    id: 1,
    nombre: 'Luis Gómez',
    identificacion: '1098765432',
    cargo: 'Administrador',
    fechaIngreso: '2022-03-15',
    salario: 2500000,
    estado: 'Activo',
    tipoContrato: 'Indefinido'
  },
  {
    id: 2,
    nombre: 'María Rodríguez',
    identificacion: '1087654321',
    cargo: 'Asistente Administrativo',
    fechaIngreso: '2022-05-20',
    salario: 1800000,
    estado: 'Activo',
    tipoContrato: 'Fijo'
  },
  {
    id: 3,
    nombre: 'Carlos Vargas',
    identificacion: '1076543210',
    cargo: 'Contador',
    fechaIngreso: '2023-01-10',
    salario: 2200000,
    estado: 'Activo',
    tipoContrato: 'Prestación de Servicios'
  },
  {
    id: 4,
    nombre: 'Ana Martínez',
    identificacion: '1065432109',
    cargo: 'Recepcionista',
    fechaIngreso: '2023-02-15',
    salario: 1500000,
    estado: 'Activo',
    tipoContrato: 'Fijo'
  },
  {
    id: 5,
    nombre: 'Juan Pérez',
    identificacion: '1054321098',
    cargo: 'Vigilante',
    fechaIngreso: '2022-08-01',
    salario: 1400000,
    estado: 'Inactivo',
    tipoContrato: 'Indefinido'
  }
];

// Datos de ejemplo para las nóminas
const nominasData = [
  {
    id: 1,
    periodo: 'Agosto 2025',
    fechaInicio: '2025-08-01',
    fechaFin: '2025-08-31',
    fechaPago: '2025-09-05',
    estado: 'Pagada',
    totalBruto: 9400000,
    totalDeducciones: 3760000,
    totalNeto: 5640000
  },
  {
    id: 2,
    periodo: 'Julio 2025',
    fechaInicio: '2025-07-01',
    fechaFin: '2025-07-31',
    fechaPago: '2025-08-05',
    estado: 'Pagada',
    totalBruto: 9400000,
    totalDeducciones: 3760000,
    totalNeto: 5640000
  },
  {
    id: 3,
    periodo: 'Junio 2025',
    fechaInicio: '2025-06-01',
    fechaFin: '2025-06-30',
    fechaPago: '2025-07-05',
    estado: 'Pagada',
    totalBruto: 9400000,
    totalDeducciones: 3760000,
    totalNeto: 5640000
  },
  {
    id: 4,
    periodo: 'Mayo 2025',
    fechaInicio: '2025-05-01',
    fechaFin: '2025-05-31',
    fechaPago: '2025-06-05',
    estado: 'Pagada',
    totalBruto: 9400000,
    totalDeducciones: 3760000,
    totalNeto: 5640000
  }
];

// Datos de ejemplo para los pagos individuales
const pagosData = [
  {
    id: 1,
    empleadoId: 1,
    nombre: 'Luis Gómez',
    periodo: 'Agosto 2025',
    fechaPago: '2025-09-05',
    salarioBase: 2500000,
    horasExtra: 0,
    bonificaciones: 0,
    deducciones: 1000000,
    totalPago: 1500000
  },
  {
    id: 2,
    empleadoId: 2,
    nombre: 'María Rodríguez',
    periodo: 'Agosto 2025',
    fechaPago: '2025-09-05',
    salarioBase: 1800000,
    horasExtra: 100000,
    bonificaciones: 50000,
    deducciones: 780000,
    totalPago: 1170000
  },
  {
    id: 3,
    empleadoId: 3,
    nombre: 'Carlos Vargas',
    periodo: 'Agosto 2025',
    fechaPago: '2025-09-05',
    salarioBase: 2200000,
    horasExtra: 0,
    bonificaciones: 0,
    deducciones: 880000,
    totalPago: 1320000
  },
  {
    id: 4,
    empleadoId: 4,
    nombre: 'Ana Martínez',
    periodo: 'Agosto 2025',
    fechaPago: '2025-09-05',
    salarioBase: 1500000,
    horasExtra: 75000,
    bonificaciones: 0,
    deducciones: 630000,
    totalPago: 945000
  }
];

// Componente para la página de nómina
const NominaPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [empleados, setEmpleados] = useState([]);
  const [nominas, setNominas] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);

  // Simular carga de datos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulando una llamada API con timeout
      setTimeout(() => {
        setEmpleados(empleadosData);
        setNominas(nominasData);
        setPagos(pagosData);
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

  // Abrir diálogo de empleado
  const handleOpenDialog = (empleado = null) => {
    setSelectedEmpleado(empleado);
    setOpenDialog(true);
  };

  // Cerrar diálogo
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

  // Filtrar empleados por término de búsqueda
  const filteredEmpleados = empleados.filter(
    empleado => 
      empleado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      empleado.identificacion.includes(searchTerm) ||
      empleado.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Componente para la pestaña de Empleados
  const EmpleadosTab = () => (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" width="50%">
          <TextField
            variant="outlined"
            placeholder="Buscar empleado..."
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
          onClick={() => handleOpenDialog()}
        >
          Nuevo Empleado
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Identificación</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>Fecha Ingreso</TableCell>
              <TableCell>Tipo Contrato</TableCell>
              <TableCell align="right">Salario Base</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">Cargando datos...</TableCell>
              </TableRow>
            ) : filteredEmpleados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">No se encontraron empleados</TableCell>
              </TableRow>
            ) : (
              filteredEmpleados.map((empleado) => (
                <TableRow key={empleado.id} hover>
                  <TableCell>{empleado.nombre}</TableCell>
                  <TableCell>{empleado.identificacion}</TableCell>
                  <TableCell>{empleado.cargo}</TableCell>
                  <TableCell>{empleado.fechaIngreso}</TableCell>
                  <TableCell>{empleado.tipoContrato}</TableCell>
                  <TableCell align="right">{formatCurrency(empleado.salario)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={empleado.estado} 
                      color={empleado.estado === 'Activo' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenDialog(empleado)}
                      title="Editar"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small"
                      title="Ver historial"
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para agregar/editar empleado */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedEmpleado ? "Editar Empleado" : "Agregar Nuevo Empleado"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Nombre Completo"
                fullWidth
                variant="outlined"
                defaultValue={selectedEmpleado?.nombre || ''}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Identificación"
                fullWidth
                variant="outlined"
                defaultValue={selectedEmpleado?.identificacion || ''}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cargo"
                fullWidth
                variant="outlined"
                defaultValue={selectedEmpleado?.cargo || ''}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha Ingreso"
                fullWidth
                variant="outlined"
                type="date"
                defaultValue={selectedEmpleado?.fechaIngreso || new Date().toISOString().split('T')[0]}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Tipo Contrato</InputLabel>
                <Select
                  label="Tipo Contrato"
                  defaultValue={selectedEmpleado?.tipoContrato || "Indefinido"}
                >
                  <MenuItem value="Indefinido">Indefinido</MenuItem>
                  <MenuItem value="Fijo">Término Fijo</MenuItem>
                  <MenuItem value="Prestación de Servicios">Prestación de Servicios</MenuItem>
                  <MenuItem value="Obra Labor">Obra Labor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Salario Base"
                fullWidth
                variant="outlined"
                type="number"
                defaultValue={selectedEmpleado?.salario || ''}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Estado</InputLabel>
                <Select
                  label="Estado"
                  defaultValue={selectedEmpleado?.estado || "Activo"}
                >
                  <MenuItem value="Activo">Activo</MenuItem>
                  <MenuItem value="Inactivo">Inactivo</MenuItem>
                </Select>
              </FormControl>
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
            {selectedEmpleado ? "Actualizar" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  // Componente para la pestaña de Nóminas
  const NominasTab = () => (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Procesamiento de Nóminas</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<MoneyIcon />}
          size="small"
        >
          Generar Nómina
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Periodo</TableCell>
              <TableCell>Fecha Inicio</TableCell>
              <TableCell>Fecha Fin</TableCell>
              <TableCell>Fecha Pago</TableCell>
              <TableCell align="right">Total Bruto</TableCell>
              <TableCell align="right">Deducciones</TableCell>
              <TableCell align="right">Total Neto</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">Cargando datos...</TableCell>
              </TableRow>
            ) : (
              nominas.map((nomina) => (
                <TableRow key={nomina.id} hover>
                  <TableCell>{nomina.periodo}</TableCell>
                  <TableCell>{nomina.fechaInicio}</TableCell>
                  <TableCell>{nomina.fechaFin}</TableCell>
                  <TableCell>{nomina.fechaPago}</TableCell>
                  <TableCell align="right">{formatCurrency(nomina.totalBruto)}</TableCell>
                  <TableCell align="right">{formatCurrency(nomina.totalDeducciones)}</TableCell>
                  <TableCell align="right">{formatCurrency(nomina.totalNeto)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={nomina.estado} 
                      color={nomina.estado === 'Pagada' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" title="Ver detalles">
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

  // Componente para la pestaña de Pagos Individuales
  const PagosIndividualesTab = () => (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Pagos Individuales - Agosto 2025</Typography>
        <FormControl variant="outlined" size="small" sx={{ width: 200 }}>
          <InputLabel>Seleccionar Periodo</InputLabel>
          <Select
            label="Seleccionar Periodo"
            value="Agosto 2025"
          >
            <MenuItem value="Agosto 2025">Agosto 2025</MenuItem>
            <MenuItem value="Julio 2025">Julio 2025</MenuItem>
            <MenuItem value="Junio 2025">Junio 2025</MenuItem>
            <MenuItem value="Mayo 2025">Mayo 2025</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Empleado</TableCell>
              <TableCell align="right">Salario Base</TableCell>
              <TableCell align="right">Horas Extra</TableCell>
              <TableCell align="right">Bonificaciones</TableCell>
              <TableCell align="right">Deducciones</TableCell>
              <TableCell align="right">Total Pago</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Cargando datos...</TableCell>
              </TableRow>
            ) : (
              pagos.map((pago) => (
                <TableRow key={pago.id} hover>
                  <TableCell>{pago.nombre}</TableCell>
                  <TableCell align="right">{formatCurrency(pago.salarioBase)}</TableCell>
                  <TableCell align="right">{formatCurrency(pago.horasExtra)}</TableCell>
                  <TableCell align="right">{formatCurrency(pago.bonificaciones)}</TableCell>
                  <TableCell align="right">{formatCurrency(pago.deducciones)}</TableCell>
                  <TableCell align="right">{formatCurrency(pago.totalPago)}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" title="Ver detalles">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Descargar comprobante">
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

  // Calcular totales para las tarjetas
  const totalSalarios = empleados
    .filter(emp => emp.estado === 'Activo')
    .reduce((sum, emp) => sum + emp.salario, 0);
  
  const empleadosActivos = empleados.filter(emp => emp.estado === 'Activo').length;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Nómina
        </Typography>
      </Box>

      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <GroupIcon color="primary" sx={{ mr: 1 }} />
                <Typography color="textSecondary">
                  Empleados Activos
                </Typography>
              </Box>
              <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                {empleadosActivos}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                De {empleados.length} registrados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <MoneyIcon color="success" sx={{ mr: 1 }} />
                <Typography color="textSecondary">
                  Total Salarios
                </Typography>
              </Box>
              <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                {formatCurrency(totalSalarios)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Nómina mensual
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <EventIcon color="info" sx={{ mr: 1 }} />
                <Typography color="textSecondary">
                  Próximo Pago
                </Typography>
              </Box>
              <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                05/09/2025
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Nómina de Agosto
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
          <Tab label="Empleados" />
          <Tab label="Nóminas" />
          <Tab label="Pagos Individuales" />
        </Tabs>
        <Divider />
        
        <TabPanel value={tabValue} index={0}>
          <EmpleadosTab />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <NominasTab />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <PagosIndividualesTab />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default NominaPage;
