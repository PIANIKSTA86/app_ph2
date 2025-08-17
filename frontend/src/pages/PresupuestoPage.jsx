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
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PieChart as PieChartIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Datos de ejemplo para el presupuesto
const presupuestoData = [
  { 
    id: 1, 
    descripcion: 'Presupuesto Anual 2023', 
    fechaCreacion: '2023-01-01', 
    estado: 'Aprobado',
    total: 125000000,
    ejecutado: 98500000
  },
  { 
    id: 2, 
    descripcion: 'Presupuesto Trimestral Q1', 
    fechaCreacion: '2023-01-15', 
    estado: 'Aprobado',
    total: 30000000,
    ejecutado: 29800000
  },
  { 
    id: 3, 
    descripcion: 'Presupuesto Extraordinario - Reparaciones', 
    fechaCreacion: '2023-03-10', 
    estado: 'En revisión',
    total: 45000000,
    ejecutado: 0
  },
  { 
    id: 4, 
    descripcion: 'Presupuesto Trimestral Q2', 
    fechaCreacion: '2023-04-01', 
    estado: 'Borrador',
    total: 32000000,
    ejecutado: 0
  },
];

// Componente para la página de presupuesto
const PresupuestoPage = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const { user } = useAuth();

  // Simular carga de datos
  useEffect(() => {
    // En un caso real, aquí se haría la llamada a la API
    setTimeout(() => {
      setPresupuestos(presupuestoData);
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
  const totalPresupuesto = presupuestos.reduce((sum, item) => sum + item.total, 0);
  const totalEjecutado = presupuestos.reduce((sum, item) => sum + item.ejecutado, 0);
  const porcentajeEjecucion = totalPresupuesto > 0 ? (totalEjecutado / totalPresupuesto) * 100 : 0;

  // Función para obtener color según el estado
  const getStatusColor = (status) => {
    switch (status) {
      case 'Aprobado': return 'success';
      case 'En revisión': return 'warning';
      case 'Borrador': return 'default';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestión de Presupuestos
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
        >
          Nuevo Presupuesto
        </Button>
      </Box>

      {/* Tarjetas de resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Presupuestado
              </Typography>
              <Typography variant="h5" component="div">
                {formatCurrency(totalPresupuesto)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Ejecutado
              </Typography>
              <Typography variant="h5" component="div">
                {formatCurrency(totalEjecutado)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Porcentaje de Ejecución
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="h5" component="div" sx={{ mr: 1 }}>
                  {porcentajeEjecucion.toFixed(1)}%
                </Typography>
                <PieChartIcon color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de presupuestos */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="presupuestos">
            <TableHead>
              <TableRow>
                <TableCell>Descripción</TableCell>
                <TableCell>Fecha de Creación</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Ejecutado</TableCell>
                <TableCell align="right">% Ejecutado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {presupuestos.map((row) => {
                const porcentaje = row.total > 0 ? (row.ejecutado / row.total) * 100 : 0;
                
                return (
                  <TableRow hover key={row.id}>
                    <TableCell>{row.descripcion}</TableCell>
                    <TableCell>{row.fechaCreacion}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.estado} 
                        color={getStatusColor(row.estado)}
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="right">{formatCurrency(row.total)}</TableCell>
                    <TableCell align="right">{formatCurrency(row.ejecutado)}</TableCell>
                    <TableCell align="right">{porcentaje.toFixed(1)}%</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default PresupuestoPage;
