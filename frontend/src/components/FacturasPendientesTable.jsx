import { useEffect, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography,
  Box,
  Skeleton,
  Chip
} from '@mui/material';

/**
 * Componente que muestra la lista de facturas pendientes
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.facturas - Lista de facturas pendientes
 * @param {boolean} props.loading - Indicador de carga
 * @param {Function} props.onFacturaClick - Función para manejar el clic en una factura
 */
const FacturasPendientesTable = ({ facturas = [], loading = false, onFacturaClick }) => {
  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        {Array.from(new Array(4)).map((_, index) => (
          <Skeleton key={index} variant="rectangular" sx={{ my: 1, height: 30 }} />
        ))}
      </Box>
    );
  }

  if (!facturas.length) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
        No hay facturas pendientes.
      </Typography>
    );
  }

  // Función para formatear la fecha
  const formatFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-CO');
  };

  // Función para formatear montos
  const formatMonto = (monto) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(monto);
  };

  // Determinar si una factura está cerca de vencer
  const estaProximaAVencer = (fechaStr) => {
    const hoy = new Date();
    const fechaVencimiento = new Date(fechaStr);
    const diasDiferencia = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
    return diasDiferencia <= 5 && diasDiferencia >= 0;
  };

  // Determinar si una factura ya venció
  const estaVencida = (fechaStr) => {
    const hoy = new Date();
    const fechaVencimiento = new Date(fechaStr);
    return fechaVencimiento < hoy;
  };

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Residente</TableCell>
            <TableCell>Unidad</TableCell>
            <TableCell align="right">Monto</TableCell>
            <TableCell align="right">Vencimiento</TableCell>
            <TableCell align="center">Estado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {facturas.map((factura) => (
            <TableRow 
              key={factura.id}
              hover
              onClick={() => onFacturaClick && onFacturaClick(factura)}
              sx={{ cursor: onFacturaClick ? 'pointer' : 'default' }}
            >
              <TableCell>{factura.residente}</TableCell>
              <TableCell>{factura.unidad}</TableCell>
              <TableCell align="right">{formatMonto(factura.monto)}</TableCell>
              <TableCell align="right">{formatFecha(factura.fechaVencimiento)}</TableCell>
              <TableCell align="center">
                {estaVencida(factura.fechaVencimiento) ? (
                  <Chip label="Vencida" color="error" size="small" />
                ) : estaProximaAVencer(factura.fechaVencimiento) ? (
                  <Chip label="Próxima" color="warning" size="small" />
                ) : (
                  <Chip label="Pendiente" color="info" size="small" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FacturasPendientesTable;
