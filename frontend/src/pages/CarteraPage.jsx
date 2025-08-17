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
  TextField
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';

// Datos de ejemplo para cartera
const carteraData = [
  { 
    id: 1, 
    apartamento: 'Apto 101', 
    propietario: 'Juan Pérez',
    saldo: 550000, 
    fechaUltimoPago: '2023-04-15',
    estado: 'Al día'
  },
  { 
    id: 2, 
    apartamento: 'Apto 202', 
    propietario: 'María López',
    saldo: 1250000, 
    fechaUltimoPago: '2023-02-10',
    estado: 'En mora'
  },
  { 
    id: 3, 
    apartamento: 'Apto 303', 
    propietario: 'Carlos Rodríguez',
    saldo: 0, 
    fechaUltimoPago: '2023-04-28',
    estado: 'Al día'
  },
  { 
    id: 4, 
    apartamento: 'Apto 404', 
    propietario: 'Ana Martínez',
    saldo: 850000, 
    fechaUltimoPago: '2023-03-01',
    estado: 'En mora'
  },
  { 
    id: 5, 
    apartamento: 'Apto 505', 
    propietario: 'Roberto Gómez',
    saldo: 125000, 
    fechaUltimoPago: '2023-04-10',
    estado: 'Al día'
  },
];

// Componente para la página de cartera
const CarteraPage = () => {
  const [cartera, setCartera] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Simular carga de datos
  useEffect(() => {
    // En un caso real, aquí se haría la llamada a la API
    setTimeout(() => {
      setCartera(carteraData);
    }, 500);
  }, []);

  // Función para formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Calcular totales
  const totalCartera = cartera.reduce((sum, item) => sum + item.saldo, 0);
  const totalEnMora = cartera
    .filter(item => item.estado === 'En mora')
    .reduce((sum, item) => sum + item.saldo, 0);
  const porcentajeCarteraVencida = totalCartera > 0 ? (totalEnMora / totalCartera) * 100 : 0;

  // Filtrado por búsqueda
  const filteredCartera = cartera.filter(item => 
    item.apartamento.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.propietario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Cartera
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
        >
          Nuevo Movimiento
        </Button>
      </Box>

      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Cartera
              </Typography>
              <Typography variant="h5" component="div">
                {formatCurrency(totalCartera)}
              </Typography>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Total de saldos pendientes
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total en Mora
              </Typography>
              <Typography variant="h5" component="div" color="error">
                {formatCurrency(totalEnMora)}
              </Typography>
              <Box display="flex" alignItems="center">
                <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Saldos en estado de mora
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                % Cartera Vencida
              </Typography>
              <Typography variant="h5" component="div" color={porcentajeCarteraVencida > 20 ? "error" : "primary"}>
                {porcentajeCarteraVencida.toFixed(1)}%
              </Typography>
              <Typography variant="body2">
                Del total de la cartera
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Buscador */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Buscar por apartamento o propietario"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* Tabla de cartera */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="cartera">
            <TableHead>
              <TableRow>
                <TableCell>Apartamento</TableCell>
                <TableCell>Propietario</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Saldo</TableCell>
                <TableCell>Último Pago</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCartera.map((row) => (
                <TableRow hover key={row.id}>
                  <TableCell>{row.apartamento}</TableCell>
                  <TableCell>{row.propietario}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.estado} 
                      color={row.estado === 'Al día' ? 'success' : 'error'}
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="right">{formatCurrency(row.saldo)}</TableCell>
                  <TableCell>{row.fechaUltimoPago}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="info">
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CarteraPage;
