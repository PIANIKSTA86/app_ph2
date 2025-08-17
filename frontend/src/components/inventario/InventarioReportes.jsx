import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Print as PrintIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';
import inventarioService from '../../services/inventario.service';

// Componente para visualizar reportes de inventario
const InventarioReportes = () => {
  // Estado para los datos del reporte
  const [reporteData, setReporteData] = useState(null);
  
  // Estado para los filtros
  const [filtros, setFiltros] = useState({
    categoriaId: '',
    bodegaId: '',
    ordenarPor: 'nombre',
    soloActivos: true
  });
  
  // Estados para datos auxiliares
  const [categorias, setCategorias] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  
  // Estado de carga
  const [loading, setLoading] = useState(false);
  
  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar categorías y bodegas para los filtros
        const categoriasData = await inventarioService.getCategorias();
        const bodegasData = await inventarioService.getBodegas();
        
        setCategorias(categoriasData || []);
        setBodegas(bodegasData || []);
        
        // Cargar reporte inicial
        await loadReporte();
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
      }
    };
    
    loadData();
  }, []);
  
  // Cargar reporte al cambiar filtros
  useEffect(() => {
    loadReporte();
  }, [filtros]);
  
  // Función para cargar el reporte según los filtros
  const loadReporte = async () => {
    try {
      setLoading(true);
      
      // Obtener el reporte de inventario con los filtros aplicados
      const data = await inventarioService.getReporteInventario(filtros);
      setReporteData(data);
    } catch (error) {
      console.error('Error al cargar reporte:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Manejar cambios en los filtros
  const handleFiltroChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(value);
  };
  
  // Calcular totales del reporte
  const calcularTotales = () => {
    if (!reporteData || !reporteData.items) return { cantidadTotal: 0, valorTotal: 0 };
    
    return reporteData.items.reduce((acc, item) => {
      return {
        cantidadTotal: acc.cantidadTotal + item.cantidad_disponible,
        valorTotal: acc.valorTotal + (item.cantidad_disponible * item.precio_compra)
      };
    }, { cantidadTotal: 0, valorTotal: 0 });
  };
  
  // Totales calculados
  const totales = calcularTotales();
  
  // Función para descargar el reporte (mock)
  const handleDownload = (formato) => {
    alert(`Descargando reporte en formato ${formato}...`);
    // Aquí se implementaría la descarga real
  };
  
  // Función para imprimir el reporte (mock)
  const handlePrint = () => {
    window.print();
  };

  return (
    <Box className="reporte-container">
      <Typography variant="h5" gutterBottom>
        Reporte General de Inventario
      </Typography>
      
      {/* Filtros del reporte */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtros
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="categoria-label">Categoría</InputLabel>
              <Select
                labelId="categoria-label"
                name="categoriaId"
                value={filtros.categoriaId}
                onChange={handleFiltroChange}
                label="Categoría"
              >
                <MenuItem value="">Todas</MenuItem>
                {categorias.map(categoria => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="bodega-label">Bodega</InputLabel>
              <Select
                labelId="bodega-label"
                name="bodegaId"
                value={filtros.bodegaId}
                onChange={handleFiltroChange}
                label="Bodega"
              >
                <MenuItem value="">Todas</MenuItem>
                {bodegas.map(bodega => (
                  <MenuItem key={bodega.id} value={bodega.id}>
                    {bodega.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="ordenar-label">Ordenar por</InputLabel>
              <Select
                labelId="ordenar-label"
                name="ordenarPor"
                value={filtros.ordenarPor}
                onChange={handleFiltroChange}
                label="Ordenar por"
              >
                <MenuItem value="nombre">Nombre</MenuItem>
                <MenuItem value="codigo">Código</MenuItem>
                <MenuItem value="cantidad_disponible">Cantidad</MenuItem>
                <MenuItem value="precio_compra">Precio de compra</MenuItem>
                <MenuItem value="precio_venta">Precio de venta</MenuItem>
                <MenuItem value="categoria">Categoría</MenuItem>
                <MenuItem value="bodega">Bodega</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FormControl>
              <Button
                variant="contained"
                onClick={loadReporte}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Actualizar'}
              </Button>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Resumen del reporte */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Items
              </Typography>
              <Typography variant="h3">
                {reporteData?.items?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Cantidad Total
              </Typography>
              <Typography variant="h3">
                {totales.cantidadTotal}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Valor Total del Inventario
              </Typography>
              <Typography variant="h3">
                {formatCurrency(totales.valorTotal)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Tabla del reporte */}
      <Box sx={{ position: 'relative' }}>
        {loading && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1
          }}>
            <CircularProgress />
          </Box>
        )}
        
        <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Button 
              variant="outlined" 
              startIcon={<DownloadIcon />}
              onClick={() => handleDownload('excel')}
              sx={{ mr: 1 }}
            >
              Excel
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<DownloadIcon />}
              onClick={() => handleDownload('pdf')}
              sx={{ mr: 1 }}
            >
              PDF
            </Button>
            <Button 
              variant="contained" 
              startIcon={<PrintIcon />}
              onClick={handlePrint}
            >
              Imprimir
            </Button>
          </Box>
          
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="reporte de inventario">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Código</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Categoría</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Bodega</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Cantidad</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Precio Compra</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Precio Venta</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Valor Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reporteData?.items && reporteData.items.length > 0 ? (
                  reporteData.items.map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>{item.codigo}</TableCell>
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell>{item.categoria?.nombre || '-'}</TableCell>
                      <TableCell>{item.bodega?.nombre || '-'}</TableCell>
                      <TableCell align="right">{item.cantidad_disponible}</TableCell>
                      <TableCell align="right">{formatCurrency(item.precio_compra)}</TableCell>
                      <TableCell align="right">{formatCurrency(item.precio_venta)}</TableCell>
                      <TableCell align="right">{formatCurrency(item.cantidad_disponible * item.precio_compra)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      {loading ? 'Cargando datos...' : 'No hay datos disponibles para mostrar'}
                    </TableCell>
                  </TableRow>
                )}
                
                {/* Fila de totales */}
                {reporteData?.items && reporteData.items.length > 0 && (
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell colSpan={4} sx={{ fontWeight: 'bold' }}>
                      TOTALES
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {totales.cantidadTotal}
                    </TableCell>
                    <TableCell colSpan={2} />
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      {formatCurrency(totales.valorTotal)}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      
      {/* Sección de resumen por categoría */}
      {reporteData?.resumenCategorias && reporteData.resumenCategorias.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Resumen por Categoría
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Categoría</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Cantidad de Productos</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Unidades Totales</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Valor Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reporteData.resumenCategorias.map((resumen) => (
                  <TableRow key={resumen.id}>
                    <TableCell>{resumen.nombre}</TableCell>
                    <TableCell align="right">{resumen.cantidad_productos}</TableCell>
                    <TableCell align="right">{resumen.unidades_totales}</TableCell>
                    <TableCell align="right">{formatCurrency(resumen.valor_total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      
      {/* Sección de resumen por bodega */}
      {reporteData?.resumenBodegas && reporteData.resumenBodegas.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Resumen por Bodega
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Bodega</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Cantidad de Productos</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Unidades Totales</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Valor Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reporteData.resumenBodegas.map((resumen) => (
                  <TableRow key={resumen.id}>
                    <TableCell>{resumen.nombre}</TableCell>
                    <TableCell align="right">{resumen.cantidad_productos}</TableCell>
                    <TableCell align="right">{resumen.unidades_totales}</TableCell>
                    <TableCell align="right">{formatCurrency(resumen.valor_total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default InventarioReportes;
