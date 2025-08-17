import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  TextField, 
  Button, 
  Divider,
  FormControl,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  MenuItem,
  Select,
  InputLabel,
  Snackbar,
  Alert,
  Tooltip
} from '@mui/material';
import { 
  Save as SaveIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Backup as BackupIcon,
  Restore as RestoreIcon,
  Receipt as ReceiptIcon,
  LibraryBooks as LibraryBooksIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

// Datos de ejemplo para tipos de transacción
const tiposTransaccionData = [
  { id: 1, codigo: 'COMP', nombre: 'Comprobante de Compra', modulo: 'Compras', consecutivoActual: 125 },
  { id: 2, codigo: 'VENT', nombre: 'Comprobante de Venta', modulo: 'Facturación', consecutivoActual: 387 },
  { id: 3, codigo: 'RCI', nombre: 'Recibo de Caja Ingreso', modulo: 'Tesorería', consecutivoActual: 89 },
  { id: 4, codigo: 'RCE', nombre: 'Recibo de Caja Egreso', modulo: 'Tesorería', consecutivoActual: 75 },
  { id: 5, codigo: 'NC', nombre: 'Nota Crédito', modulo: 'Facturación', consecutivoActual: 18 },
  { id: 6, codigo: 'ND', nombre: 'Nota Débito', modulo: 'Facturación', consecutivoActual: 12 },
];

// Datos de ejemplo para resoluciones de facturación
const resolucionesData = [
  { 
    id: 1, 
    numero: '18764000001234', 
    fechaResolucion: '2025-01-15', 
    fechaVencimiento: '2026-01-15', 
    prefijoAsociado: 'FE', 
    rangoInicial: 1, 
    rangoFinal: 50000,
    consecutivoActual: 387,
    activa: true
  },
  { 
    id: 2, 
    numero: '18764000005678', 
    fechaResolucion: '2024-06-10', 
    fechaVencimiento: '2025-06-10', 
    prefijoAsociado: 'NC', 
    rangoInicial: 1, 
    rangoFinal: 10000,
    consecutivoActual: 18,
    activa: true
  },
  { 
    id: 3, 
    numero: '18764000009012', 
    fechaResolucion: '2024-06-10', 
    fechaVencimiento: '2025-06-10', 
    prefijoAsociado: 'ND', 
    rangoInicial: 1, 
    rangoFinal: 10000,
    consecutivoActual: 12,
    activa: true
  }
];

// Panel de contenido para las pestañas
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`config-tabpanel-${index}`}
      aria-labelledby={`config-tab-${index}`}
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

// Componente para la página de configuración
const ConfiguracionPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [tiposTransaccion, setTiposTransaccion] = useState(tiposTransaccionData);
  const [resoluciones, setResoluciones] = useState(resolucionesData);
  const [openTipoTransaccionDialog, setOpenTipoTransaccionDialog] = useState(false);
  const [openResolucionDialog, setOpenResolucionDialog] = useState(false);
  const [openBackupDialog, setOpenBackupDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedTipoTransaccion, setSelectedTipoTransaccion] = useState(null);
  const [selectedResolucion, setSelectedResolucion] = useState(null);
  const [formTipoTransaccion, setFormTipoTransaccion] = useState({ 
    codigo: '', 
    nombre: '', 
    modulo: '', 
    consecutivoActual: 1 
  });
  const [formResolucion, setFormResolucion] = useState({
    numero: '',
    fechaResolucion: '',
    fechaVencimiento: '',
    prefijoAsociado: '',
    rangoInicial: 1,
    rangoFinal: 50000,
    consecutivoActual: 1,
    activa: true
  });

  // Manejar cambios de pestañas
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handlers para diálogo de tipos de transacción
  const handleOpenTipoTransaccionDialog = (tipo = null) => {
    if (tipo) {
      setSelectedTipoTransaccion(tipo);
      setFormTipoTransaccion({ ...tipo });
    } else {
      setSelectedTipoTransaccion(null);
      setFormTipoTransaccion({ 
        codigo: '', 
        nombre: '', 
        modulo: '', 
        consecutivoActual: 1 
      });
    }
    setOpenTipoTransaccionDialog(true);
  };

  const handleCloseTipoTransaccionDialog = () => {
    setOpenTipoTransaccionDialog(false);
  };

  const handleSaveTipoTransaccion = () => {
    if (selectedTipoTransaccion) {
      // Editar existente
      setTiposTransaccion(tiposTransaccion.map(tipo => 
        tipo.id === selectedTipoTransaccion.id ? { ...tipo, ...formTipoTransaccion } : tipo
      ));
      setSnackbar({ open: true, message: 'Tipo de transacción actualizado correctamente', severity: 'success' });
    } else {
      // Crear nuevo
      const newTipo = {
        id: tiposTransaccion.length + 1,
        ...formTipoTransaccion
      };
      setTiposTransaccion([...tiposTransaccion, newTipo]);
      setSnackbar({ open: true, message: 'Tipo de transacción creado correctamente', severity: 'success' });
    }
    setOpenTipoTransaccionDialog(false);
  };

  const handleDeleteTipoTransaccion = (id) => {
    setTiposTransaccion(tiposTransaccion.filter(tipo => tipo.id !== id));
    setSnackbar({ open: true, message: 'Tipo de transacción eliminado correctamente', severity: 'success' });
  };

  // Handlers para diálogo de resoluciones
  const handleOpenResolucionDialog = (resolucion = null) => {
    if (resolucion) {
      setSelectedResolucion(resolucion);
      setFormResolucion({ ...resolucion });
    } else {
      setSelectedResolucion(null);
      setFormResolucion({
        numero: '',
        fechaResolucion: '',
        fechaVencimiento: '',
        prefijoAsociado: '',
        rangoInicial: 1,
        rangoFinal: 50000,
        consecutivoActual: 1,
        activa: true
      });
    }
    setOpenResolucionDialog(true);
  };

  const handleCloseResolucionDialog = () => {
    setOpenResolucionDialog(false);
  };

  const handleSaveResolucion = () => {
    if (selectedResolucion) {
      // Editar existente
      setResoluciones(resoluciones.map(res => 
        res.id === selectedResolucion.id ? { ...res, ...formResolucion } : res
      ));
      setSnackbar({ open: true, message: 'Resolución actualizada correctamente', severity: 'success' });
    } else {
      // Crear nueva
      const newResolucion = {
        id: resoluciones.length + 1,
        ...formResolucion
      };
      setResoluciones([...resoluciones, newResolucion]);
      setSnackbar({ open: true, message: 'Resolución creada correctamente', severity: 'success' });
    }
    setOpenResolucionDialog(false);
  };

  const handleDeleteResolucion = (id) => {
    setResoluciones(resoluciones.filter(res => res.id !== id));
    setSnackbar({ open: true, message: 'Resolución eliminada correctamente', severity: 'success' });
  };

  // Handlers para backup y restauración
  const handleCreateBackup = () => {
    setSnackbar({ open: true, message: 'Backup de la base de datos creado correctamente', severity: 'success' });
  };

  const handleRestoreDatabase = () => {
    setSnackbar({ open: true, message: 'Base de datos restaurada correctamente', severity: 'success' });
  };

  // Cerrar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Componente de información general
  const InformacionGeneralTab = () => (
    <Grid container spacing={3}>
      {/* Configuración general */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Información General
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nombre de la Propiedad Horizontal"
                  defaultValue="Conjunto Residencial Ejemplo"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="NIT"
                  defaultValue="901.234.567-8"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dirección"
                  defaultValue="Calle 123 # 45-67"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Teléfono de contacto"
                  defaultValue="601 123 4567"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  defaultValue="contacto@ejemplo.com"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Configuración de facturación */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Configuración de Facturación
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Prefijo de factura"
                  defaultValue="PH-"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Próximo número"
                  type="number"
                  defaultValue="1001"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Días de vencimiento"
                  type="number"
                  defaultValue="15"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset" margin="normal">
                  <FormControlLabel 
                    control={<Switch defaultChecked />} 
                    label="Generar facturas automáticamente el primer día del mes" 
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset" margin="normal">
                  <FormControlLabel 
                    control={<Switch defaultChecked />} 
                    label="Enviar notificaciones por correo" 
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset" margin="normal">
                  <FormControlLabel 
                    control={<Switch />} 
                    label="Aplicar intereses de mora automáticamente" 
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Botones de acción */}
      <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          size="large"
        >
          Guardar Configuración
        </Button>
      </Grid>
    </Grid>
  );

  // Componente para la pestaña de Tipos de Transacción y Comprobantes
  const TiposTransaccionTab = () => (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Tipos de Transacción y Comprobantes
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenTipoTransaccionDialog()}
        >
          Nuevo Tipo
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Módulo</TableCell>
              <TableCell align="center">Consecutivo Actual</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tiposTransaccion.map((tipo) => (
              <TableRow key={tipo.id} hover>
                <TableCell>{tipo.codigo}</TableCell>
                <TableCell>{tipo.nombre}</TableCell>
                <TableCell>{tipo.modulo}</TableCell>
                <TableCell align="center">{tipo.consecutivoActual}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleOpenTipoTransaccionDialog(tipo)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteTipoTransaccion(tipo.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para crear/editar tipo de transacción */}
      <Dialog 
        open={openTipoTransaccionDialog} 
        onClose={handleCloseTipoTransaccionDialog} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          {selectedTipoTransaccion ? 'Editar Tipo de Transacción' : 'Nuevo Tipo de Transacción'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Código"
                fullWidth
                variant="outlined"
                required
                value={formTipoTransaccion.codigo}
                onChange={(e) => setFormTipoTransaccion({
                  ...formTipoTransaccion,
                  codigo: e.target.value
                })}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Nombre"
                fullWidth
                variant="outlined"
                required
                value={formTipoTransaccion.nombre}
                onChange={(e) => setFormTipoTransaccion({
                  ...formTipoTransaccion,
                  nombre: e.target.value
                })}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="modulo-label">Módulo</InputLabel>
                <Select
                  labelId="modulo-label"
                  label="Módulo"
                  value={formTipoTransaccion.modulo}
                  onChange={(e) => setFormTipoTransaccion({
                    ...formTipoTransaccion,
                    modulo: e.target.value
                  })}
                >
                  <MenuItem value="Compras">Compras</MenuItem>
                  <MenuItem value="Facturación">Facturación</MenuItem>
                  <MenuItem value="Tesorería">Tesorería</MenuItem>
                  <MenuItem value="Contabilidad">Contabilidad</MenuItem>
                  <MenuItem value="Inventario">Inventario</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Consecutivo Actual"
                fullWidth
                variant="outlined"
                type="number"
                required
                value={formTipoTransaccion.consecutivoActual}
                onChange={(e) => setFormTipoTransaccion({
                  ...formTipoTransaccion,
                  consecutivoActual: parseInt(e.target.value)
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTipoTransaccionDialog}>Cancelar</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSaveTipoTransaccion}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  // Componente para la pestaña de Resoluciones de Facturación
  const ResolucionesFacturacionTab = () => (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          Resoluciones de Facturación
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenResolucionDialog()}
        >
          Nueva Resolución
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Número Resolución</TableCell>
              <TableCell>Fecha Resolución</TableCell>
              <TableCell>Fecha Vencimiento</TableCell>
              <TableCell>Prefijo</TableCell>
              <TableCell align="center">Rango</TableCell>
              <TableCell align="center">Consecutivo Actual</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resoluciones.map((resolucion) => (
              <TableRow key={resolucion.id} hover>
                <TableCell>{resolucion.numero}</TableCell>
                <TableCell>{resolucion.fechaResolucion}</TableCell>
                <TableCell>{resolucion.fechaVencimiento}</TableCell>
                <TableCell>{resolucion.prefijoAsociado}</TableCell>
                <TableCell align="center">{`${resolucion.rangoInicial} - ${resolucion.rangoFinal}`}</TableCell>
                <TableCell align="center">{resolucion.consecutivoActual}</TableCell>
                <TableCell align="center">
                  {resolucion.activa ? 
                    <Chip label="Activa" color="success" size="small" /> : 
                    <Chip label="Inactiva" color="default" size="small" />
                  }
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Editar">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleOpenResolucionDialog(resolucion)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteResolucion(resolucion.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para crear/editar resolución */}
      <Dialog 
        open={openResolucionDialog} 
        onClose={handleCloseResolucionDialog} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          {selectedResolucion ? 'Editar Resolución de Facturación' : 'Nueva Resolución de Facturación'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Número de Resolución"
                fullWidth
                variant="outlined"
                required
                value={formResolucion.numero}
                onChange={(e) => setFormResolucion({
                  ...formResolucion,
                  numero: e.target.value
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha de Resolución"
                fullWidth
                variant="outlined"
                type="date"
                required
                value={formResolucion.fechaResolucion}
                onChange={(e) => setFormResolucion({
                  ...formResolucion,
                  fechaResolucion: e.target.value
                })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha de Vencimiento"
                fullWidth
                variant="outlined"
                type="date"
                required
                value={formResolucion.fechaVencimiento}
                onChange={(e) => setFormResolucion({
                  ...formResolucion,
                  fechaVencimiento: e.target.value
                })}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Prefijo Asociado"
                fullWidth
                variant="outlined"
                required
                value={formResolucion.prefijoAsociado}
                onChange={(e) => setFormResolucion({
                  ...formResolucion,
                  prefijoAsociado: e.target.value
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formResolucion.activa}
                    onChange={(e) => setFormResolucion({
                      ...formResolucion,
                      activa: e.target.checked
                    })}
                    color="primary"
                  />
                }
                label="Resolución Activa"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Rango Inicial"
                fullWidth
                variant="outlined"
                type="number"
                required
                value={formResolucion.rangoInicial}
                onChange={(e) => setFormResolucion({
                  ...formResolucion,
                  rangoInicial: parseInt(e.target.value)
                })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Rango Final"
                fullWidth
                variant="outlined"
                type="number"
                required
                value={formResolucion.rangoFinal}
                onChange={(e) => setFormResolucion({
                  ...formResolucion,
                  rangoFinal: parseInt(e.target.value)
                })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Consecutivo Actual"
                fullWidth
                variant="outlined"
                type="number"
                required
                value={formResolucion.consecutivoActual}
                onChange={(e) => setFormResolucion({
                  ...formResolucion,
                  consecutivoActual: parseInt(e.target.value)
                })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResolucionDialog}>Cancelar</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSaveResolucion}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  // Componente para la pestaña de Backup de Base de Datos
  const BackupTab = () => (
    <>
      <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center">
        <Typography variant="h6" gutterBottom>
          Gestión de Copias de Seguridad
        </Typography>
        
        <Card sx={{ maxWidth: 600, width: '100%', mt: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <BackupIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6">Backup de la Base de Datos</Typography>
                <Typography variant="body2" color="textSecondary">
                  Crea una copia de seguridad completa de todos los datos del sistema
                </Typography>
              </Box>
            </Box>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              startIcon={<BackupIcon />}
              onClick={handleCreateBackup}
              sx={{ mt: 2 }}
            >
              Crear Copia de Seguridad
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ maxWidth: 600, width: '100%', mt: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <RestoreIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6">Restaurar Base de Datos</Typography>
                <Typography variant="body2" color="textSecondary">
                  Restaura la información desde una copia de seguridad previa
                </Typography>
              </Box>
            </Box>
            <Button 
              variant="contained" 
              color="secondary" 
              fullWidth 
              startIcon={<RestoreIcon />}
              onClick={handleRestoreDatabase}
              sx={{ mt: 2 }}
            >
              Restaurar desde Copia de Seguridad
            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* Eliminamos el diálogo de selección duplicado */}
    </>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Configuración del Sistema
      </Typography>
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<SettingsIcon />} label="Información General" />
          <Tab icon={<LibraryBooksIcon />} label="Tipos de Transacción" />
          <Tab icon={<ReceiptIcon />} label="Resoluciones de Facturación" />
          <Tab icon={<BackupIcon />} label="Backup" />
        </Tabs>
        <Divider />
        
        <TabPanel value={tabValue} index={0}>
          <InformacionGeneralTab />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <TiposTransaccionTab />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <ResolucionesFacturacionTab />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <BackupTab />
        </TabPanel>
      </Paper>

      {/* Snackbar para notificaciones */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
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

export default ConfiguracionPage;
