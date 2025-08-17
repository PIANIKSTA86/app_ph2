import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  TextField,
  MenuItem,
  IconButton,
  Toolbar,
  Tooltip,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import FacturacionService from '../services/facturacion.service';

const FacturacionPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [facturas, setFacturas] = useState([]);
  const [totalFacturas, setTotalFacturas] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filtros, setFiltros] = useState({
    estado: '',
    unidad: '',
    fechaDesde: '',
    fechaHasta: ''
  });
  
  // Opciones de estado para el filtro
  const estadoOpciones = [
    { valor: '', etiqueta: 'Todos' },
    { valor: 'pendiente', etiqueta: 'Pendiente' },
    { valor: 'pagada', etiqueta: 'Pagada' },
    { valor: 'vencida', etiqueta: 'Vencida' },
    { valor: 'anulada', etiqueta: 'Anulada' }
  ];

  // Cargar datos
  const cargarFacturas = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Preparar parámetros para la consulta
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...filtros
      };
      
      // Filtrar parámetros vacíos
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });
      
      // Intentar obtener datos reales, si no están disponibles usar datos de demostración
      try {
        const response = await FacturacionService.getFacturas(params);
        setFacturas(response.facturas);
        setTotalFacturas(response.total);
      } catch (err) {
        console.log('Usando datos de demostración para facturas');
        const demoData = FacturacionService.getDatosDemostracion(params);
        setFacturas(demoData.facturas);
        setTotalFacturas(demoData.total);
      }
    } catch (error) {
      console.error('Error al cargar facturas:', error);
      setError('Error al cargar las facturas. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    cargarFacturas();
  }, [page, rowsPerPage]);

  // Manejar cambio de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Manejar cambio de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Manejar cambio en filtros
  const handleFiltroChange = (event) => {
    const { name, value } = event.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  // Aplicar filtros
  const aplicarFiltros = () => {
    setPage(0);
    cargarFacturas();
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      estado: '',
      unidad: '',
      fechaDesde: '',
      fechaHasta: ''
    });
    setPage(0);
  };

  // Formatear fecha
  const formatFecha = (fechaStr) => {
    if (!fechaStr) return '';
    
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-CO');
  };

  // Formatear monto
  const formatMonto = (monto) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(monto);
  };

  // Obtener chip de estado
  const getEstadoChip = (estado) => {
    switch (estado) {
      case 'pendiente':
        return <Chip label="Pendiente" color="info" size="small" />;
      case 'pagada':
        return <Chip label="Pagada" color="success" size="small" />;
      case 'vencida':
        return <Chip label="Vencida" color="error" size="small" />;
      case 'anulada':
        return <Chip label="Anulada" color="default" size="small" />;
      default:
        return <Chip label={estado} size="small" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Facturación
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => console.log('Crear nueva factura')}
        >
          Nueva Factura
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Panel de filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtros
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              name="estado"
              label="Estado"
              value={filtros.estado}
              onChange={handleFiltroChange}
              margin="normal"
              size="small"
            >
              {estadoOpciones.map((opcion) => (
                <MenuItem key={opcion.valor} value={opcion.valor}>
                  {opcion.etiqueta}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              name="unidad"
              label="Unidad"
              value={filtros.unidad}
              onChange={handleFiltroChange}
              margin="normal"
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              name="fechaDesde"
              label="Fecha desde"
              type="date"
              value={filtros.fechaDesde}
              onChange={handleFiltroChange}
              InputLabelProps={{ shrink: true }}
              margin="normal"
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              name="fechaHasta"
              label="Fecha hasta"
              type="date"
              value={filtros.fechaHasta}
              onChange={handleFiltroChange}
              InputLabelProps={{ shrink: true }}
              margin="normal"
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} container justifyContent="flex-end" spacing={1}>
            <Grid item>
              <Button
                variant="outlined"
                onClick={limpiarFiltros}
              >
                Limpiar
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<FilterListIcon />}
                onClick={aplicarFiltros}
              >
                Filtrar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tabla de facturas */}
      <Paper>
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
          <Typography
            sx={{ flex: '1 1 100%' }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Listado de Facturas
          </Typography>
          
          <Tooltip title="Actualizar">
            <IconButton onClick={cargarFacturas}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
        
        <TableContainer>
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell>Número</TableCell>
                <TableCell>Residente</TableCell>
                <TableCell>Unidad</TableCell>
                <TableCell>Fecha Emisión</TableCell>
                <TableCell>Vencimiento</TableCell>
                <TableCell align="right">Monto</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : facturas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    No se encontraron facturas con los filtros aplicados.
                  </TableCell>
                </TableRow>
              ) : (
                facturas.map((factura) => (
                  <TableRow key={factura.id} hover>
                    <TableCell>{factura.numero}</TableCell>
                    <TableCell>{factura.residente}</TableCell>
                    <TableCell>{factura.unidad}</TableCell>
                    <TableCell>{formatFecha(factura.fechaEmision)}</TableCell>
                    <TableCell>{formatFecha(factura.fechaVencimiento)}</TableCell>
                    <TableCell align="right">{formatMonto(factura.monto)}</TableCell>
                    <TableCell>{getEstadoChip(factura.estado)}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ '& button': { m: 0.5 } }}>
                        <Tooltip title="Ver detalle">
                          <IconButton size="small" color="primary">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Editar">
                          <IconButton size="small" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Imprimir">
                          <IconButton size="small" color="primary">
                            <PrintIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        {factura.estado === 'pendiente' && (
                          <Tooltip title="Registrar pago">
                            <IconButton size="small" color="success">
                              <PaymentIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalFacturas}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>
    </Container>
  );
};

export default FacturacionPage;
