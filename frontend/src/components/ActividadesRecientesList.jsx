import { useEffect, useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Typography,
  Paper,
  Box,
  Skeleton,
  Divider
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  MoneyOff as MoneyOffIcon,
  Event as EventIcon
} from '@mui/icons-material';

/**
 * Componente que muestra una lista de actividades recientes
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.actividades - Lista de actividades recientes
 * @param {boolean} props.loading - Indicador de carga
 * @param {Function} props.onActividadClick - Función para manejar el clic en una actividad
 */
const ActividadesRecientesList = ({ actividades = [], loading = false, onActividadClick }) => {
  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        {Array.from(new Array(4)).map((_, index) => (
          <Box key={index} sx={{ display: 'flex', my: 2 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            <Box sx={{ width: '100%' }}>
              <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
              <Skeleton variant="text" sx={{ fontSize: '0.875rem' }} width="60%" />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (!actividades.length) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
        No hay actividades recientes.
      </Typography>
    );
  }

  // Función para formatear la fecha
  const formatFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const hoy = new Date();
    const ayer = new Date(hoy);
    ayer.setDate(ayer.getDate() - 1);
    
    // Si es hoy
    if (fecha.toDateString() === hoy.toDateString()) {
      return `Hoy ${fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Si es ayer
    if (fecha.toDateString() === ayer.toDateString()) {
      return `Ayer ${fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otro día
    return fecha.toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para formatear montos
  const formatMonto = (monto) => {
    if (!monto && monto !== 0) return '';
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(monto);
  };

  // Función para obtener el icono según el tipo de actividad
  const getIconForActivity = (tipo) => {
    switch (tipo.toLowerCase()) {
      case 'pago':
        return <PaymentIcon sx={{ color: 'success.main' }} />;
      case 'factura':
        return <ReceiptIcon sx={{ color: 'info.main' }} />;
      case 'gasto':
        return <MoneyOffIcon sx={{ color: 'error.main' }} />;
      case 'reunion':
        return <EventIcon sx={{ color: 'warning.main' }} />;
      default:
        return <EventIcon />;
    }
  };

  return (
    <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
      <List>
        {actividades.map((actividad, index) => (
          <Box key={actividad.tipo + index}>
            <ListItem 
              alignItems="flex-start"
              onClick={() => onActividadClick && onActividadClick(actividad)}
              sx={{ cursor: onActividadClick ? 'pointer' : 'default' }}
            >
              <ListItemAvatar>
                <Avatar>
                  {getIconForActivity(actividad.tipo)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={actividad.descripcion}
                secondary={
                  <>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {formatFecha(actividad.fecha)}
                    </Typography>
                    {actividad.monto && (
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ display: 'block' }}
                      >
                        {formatMonto(actividad.monto)}
                      </Typography>
                    )}
                  </>
                }
              />
            </ListItem>
            {index < actividades.length - 1 && <Divider variant="inset" component="li" />}
          </Box>
        ))}
      </List>
    </Paper>
  );
};

export default ActividadesRecientesList;
