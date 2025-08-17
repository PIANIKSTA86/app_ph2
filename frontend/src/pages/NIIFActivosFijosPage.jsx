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
  Divider,
  Tab,
  Tabs,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItem,
  ListItemText,
  List
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  AttachFile as AttachFileIcon,
  Visibility as VisibilityIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';

// Panel de contenido para las pestañas
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`niif-tabpanel-${index}`}
      aria-labelledby={`niif-tab-${index}`}
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

// Datos de ejemplo para las políticas contables
const politicasContablesData = [
  {
    id: 1,
    titulo: 'Reconocimiento de Ingresos',
    descripcion: 'Los ingresos se reconocen cuando el control de los bienes o servicios se transfiere al cliente, por un monto que refleja la contraprestación a la que la entidad espera tener derecho.',
    fechaActualizacion: '2025-01-15',
    estado: 'Vigente'
  },
  {
    id: 2,
    titulo: 'Propiedad, Planta y Equipo',
    descripcion: 'Se mide inicialmente al costo. Después del reconocimiento inicial, se mide utilizando el modelo de costo menos la depreciación acumulada y cualquier pérdida por deterioro acumulada.',
    fechaActualizacion: '2025-01-15',
    estado: 'Vigente'
  },
  {
    id: 3,
    titulo: 'Deterioro de Activos',
    descripcion: 'Al final de cada periodo, se evalúa si hay indicios de deterioro de los activos. Si existen tales indicios, se realiza una estimación del monto recuperable del activo.',
    fechaActualizacion: '2025-01-15',
    estado: 'Vigente'
  },
  {
    id: 4,
    titulo: 'Provisiones',
    descripcion: 'Se reconoce una provisión cuando existe una obligación presente como resultado de un evento pasado, es probable que se requiera una salida de recursos y el monto puede ser estimado de manera confiable.',
    fechaActualizacion: '2025-01-15',
    estado: 'Vigente'
  },
  {
    id: 5,
    titulo: 'Instrumentos Financieros',
    descripcion: 'Los activos y pasivos financieros se reconocen inicialmente a su valor razonable. Después del reconocimiento inicial, se miden al costo amortizado utilizando el método de interés efectivo.',
    fechaActualizacion: '2025-01-15',
    estado: 'Vigente'
  }
];

// Datos de ejemplo para los estados financieros NIIF
const estadosFinancierosData = [
  {
    id: 1,
    nombre: 'Estado de Situación Financiera',
    periodo: 'Diciembre 2024',
    fechaEmision: '2025-02-15',
    aprobacion: 'Aprobado',
    documento: 'ESF_Dic_2024.pdf'
  },
  {
    id: 2,
    nombre: 'Estado de Resultados Integral',
    periodo: 'Diciembre 2024',
    fechaEmision: '2025-02-15',
    aprobacion: 'Aprobado',
    documento: 'ERI_Dic_2024.pdf'
  },
  {
    id: 3,
    nombre: 'Estado de Cambios en el Patrimonio',
    periodo: 'Diciembre 2024',
    fechaEmision: '2025-02-15',
    aprobacion: 'Aprobado',
    documento: 'ECP_Dic_2024.pdf'
  },
  {
    id: 4,
    nombre: 'Estado de Flujos de Efectivo',
    periodo: 'Diciembre 2024',
    fechaEmision: '2025-02-15',
    aprobacion: 'Aprobado',
    documento: 'EFE_Dic_2024.pdf'
  },
  {
    id: 5,
    nombre: 'Notas a los Estados Financieros',
    periodo: 'Diciembre 2024',
    fechaEmision: '2025-02-15',
    aprobacion: 'Aprobado',
    documento: 'Notas_Dic_2024.pdf'
  }
];

// Datos de ejemplo para activos fijos (PPYE)
const activosFijosData = [
  {
    id: 1,
    codigo: 'AF-0001',
    descripcion: 'Edificio Principal',
    categoria: 'Edificios',
    fechaAdquisicion: '2015-05-10',
    valorInicial: 1500000000,
    depreciacionAcumulada: 450000000,
    valorActual: 1050000000,
    vidaUtil: '30 años',
    estado: 'En uso'
  },
  {
    id: 2,
    codigo: 'AF-0002',
    descripcion: 'Ascensor Torre A',
    categoria: 'Maquinaria y Equipo',
    fechaAdquisicion: '2015-06-15',
    valorInicial: 120000000,
    depreciacionAcumulada: 60000000,
    valorActual: 60000000,
    vidaUtil: '20 años',
    estado: 'En uso'
  },
  {
    id: 3,
    codigo: 'AF-0003',
    descripcion: 'Planta Eléctrica',
    categoria: 'Maquinaria y Equipo',
    fechaAdquisicion: '2018-04-22',
    valorInicial: 85000000,
    depreciacionAcumulada: 29750000,
    valorActual: 55250000,
    vidaUtil: '15 años',
    estado: 'En uso'
  },
  {
    id: 4,
    codigo: 'AF-0004',
    descripcion: 'Mobiliario Áreas Comunes',
    categoria: 'Muebles y Enseres',
    fechaAdquisicion: '2020-11-08',
    valorInicial: 35000000,
    depreciacionAcumulada: 8750000,
    valorActual: 26250000,
    vidaUtil: '10 años',
    estado: 'En uso'
  },
  {
    id: 5,
    codigo: 'AF-0005',
    descripcion: 'Equipo de Cómputo Oficina',
    categoria: 'Equipo de Cómputo',
    fechaAdquisicion: '2023-01-20',
    valorInicial: 8500000,
    depreciacionAcumulada: 2833333,
    valorActual: 5666667,
    vidaUtil: '5 años',
    estado: 'En uso'
  }
];

// Componente para la página de NIIF y Activos Fijos
const NIIFActivosFijosPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [politicas, setPoliticas] = useState([]);
  const [estadosFinancieros, setEstadosFinancieros] = useState([]);
  const [activosFijos, setActivosFijos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [politicaActual, setPoliticaActual] = useState(null);

  // Simular carga de datos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulando una llamada API con timeout
      setTimeout(() => {
        setPoliticas(politicasContablesData);
        setEstadosFinancieros(estadosFinancierosData);
        setActivosFijos(activosFijosData);
        setLoading(false);
      }, 800);
    };

    fetchData();
  }, []);

  // Manejar cambios de pestañas
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Abrir diálogo para ver política
  const handleOpenPoliticaDialog = (politica) => {
    setPoliticaActual(politica);
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

  // Calcular total de activos fijos
  const totalActivosFijos = activosFijos.reduce(
    (sum, activo) => sum + activo.valorActual, 
    0
  );

  // Componente para la pestaña de Políticas Contables
  const PoliticasContablesTab = () => (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Políticas Contables NIIF</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          size="small"
        >
          Nueva Política
        </Button>
      </Box>

      <List component={Paper} variant="outlined">
        {loading ? (
          <ListItem>
            <ListItemText primary="Cargando políticas contables..." />
          </ListItem>
        ) : (
          politicas.map((politica) => (
            <React.Fragment key={politica.id}>
              <ListItem 
                secondaryAction={
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => handleOpenPoliticaDialog(politica)}
                  >
                    Ver Detalles
                  </Button>
                }
              >
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center">
                      <Typography variant="subtitle1" component="span" fontWeight="medium">
                        {politica.titulo}
                      </Typography>
                      <Chip 
                        label={politica.estado}
                        color="primary"
                        size="small"
                        sx={{ ml: 2 }}
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Actualizado: {politica.fechaActualizacion}
                      </Typography>
                      <Typography
                        sx={{ display: 'block', mt: 0.5 }}
                        component="span"
                        variant="body2"
                      >
                        {politica.descripcion.substring(0, 100)}...
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))
        )}
      </List>

      {/* Diálogo para ver detalles de política */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {politicaActual && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {politicaActual.titulo}
              <Chip 
                label={politicaActual.estado}
                color="primary"
                size="small"
              />
            </DialogTitle>
            <DialogContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Última actualización: {politicaActual.fechaActualizacion}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" paragraph>
                {politicaActual.descripcion}
              </Typography>
              
              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                Aplicación Práctica
              </Typography>
              <Typography variant="body1" paragraph>
                Esta política se aplica a todas las transacciones relacionadas con {politicaActual.titulo.toLowerCase()}. Los encargados de contabilidad deben asegurarse de cumplir con estos lineamientos durante el registro y medición de las operaciones financieras.
              </Typography>
              
              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                Marco Normativo
              </Typography>
              <Typography variant="body1">
                Esta política está basada en:
              </Typography>
              <ul>
                <li>NIIF para PYMES Sección correspondiente</li>
                <li>Normatividad legal colombiana vigente</li>
                <li>Acuerdos de la Asamblea General</li>
              </ul>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cerrar</Button>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<EditIcon />}
              >
                Editar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );

  // Componente para la pestaña de Estados Financieros
  const EstadosFinancierosTab = () => (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Estados Financieros NIIF</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<BarChartIcon />}
          size="small"
        >
          Generar Informes
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Periodo</TableCell>
              <TableCell>Fecha Emisión</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Cargando estados financieros...</TableCell>
              </TableRow>
            ) : (
              estadosFinancieros.map((estado) => (
                <TableRow key={estado.id} hover>
                  <TableCell>{estado.nombre}</TableCell>
                  <TableCell>{estado.periodo}</TableCell>
                  <TableCell>{estado.fechaEmision}</TableCell>
                  <TableCell>
                    <Chip 
                      label={estado.aprobacion} 
                      color="success"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" title="Ver">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Descargar">
                      <AttachFileIcon fontSize="small" />
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

  // Componente para la pestaña de Activos Fijos
  const ActivosFijosTab = () => (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Propiedad, Planta y Equipo (PPYE)</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          size="small"
        >
          Nuevo Activo
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Fecha Adq.</TableCell>
              <TableCell align="right">Valor Inicial</TableCell>
              <TableCell align="right">Depreciación</TableCell>
              <TableCell align="right">Valor Actual</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} align="center">Cargando activos fijos...</TableCell>
              </TableRow>
            ) : (
              activosFijos.map((activo) => (
                <TableRow key={activo.id} hover>
                  <TableCell>{activo.codigo}</TableCell>
                  <TableCell>{activo.descripcion}</TableCell>
                  <TableCell>{activo.categoria}</TableCell>
                  <TableCell>{activo.fechaAdquisicion}</TableCell>
                  <TableCell align="right">{formatCurrency(activo.valorInicial)}</TableCell>
                  <TableCell align="right">{formatCurrency(activo.depreciacionAcumulada)}</TableCell>
                  <TableCell align="right">{formatCurrency(activo.valorActual)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={activo.estado} 
                      color="primary"
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
    </>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          NIIF y Activos Fijos
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
                  Total Activos Fijos
                </Typography>
              </Box>
              <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                {formatCurrency(totalActivosFijos)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Valor en libros actual
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ArrowDownwardIcon color="error" sx={{ mr: 1 }} />
                <Typography color="textSecondary">
                  Depreciación Acumulada
                </Typography>
              </Box>
              <Typography variant="h5" component="div" sx={{ mt: 2, color: 'error.main' }}>
                {formatCurrency(activosFijos.reduce((sum, activo) => sum + activo.depreciacionAcumulada, 0))}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ReceiptIcon color="success" sx={{ mr: 1 }} />
                <Typography color="textSecondary">
                  Políticas Contables
                </Typography>
              </Box>
              <Typography variant="h5" component="div" sx={{ mt: 2 }}>
                {politicas.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Documentos vigentes
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
          <Tab label="Activos Fijos" />
          <Tab label="Políticas Contables" />
          <Tab label="Estados Financieros" />
        </Tabs>
        <Divider />
        
        <TabPanel value={tabValue} index={0}>
          <ActivosFijosTab />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <PoliticasContablesTab />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <EstadosFinancierosTab />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default NIIFActivosFijosPage;
