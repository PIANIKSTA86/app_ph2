import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Skeleton,
  Button,
  CardActions
} from '@mui/material';

/**
 * Componente de tarjeta de resumen para el dashboard
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la tarjeta
 * @param {string|number} props.value - Valor principal a mostrar
 * @param {string} props.color - Color de fondo (primary, secondary, success, error, warning, info)
 * @param {boolean} props.loading - Indicador de carga
 * @param {string} props.subtext - Texto secundario opcional
 * @param {string} props.actionText - Texto para el botón de acción
 * @param {Function} props.onAction - Función para el botón de acción
 * @param {Object} props.icon - Icono para mostrar
 */
const ResumenCard = ({ 
  title, 
  value, 
  color = 'primary', 
  loading = false,
  subtext,
  actionText,
  onAction,
  icon
}) => {
  if (loading) {
    return (
      <Card
        sx={{
          height: 140,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <CardContent>
          <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 1 }} />
          <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        bgcolor: `${color}.light`,
        color: `${color}.contrastText`,
        height: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}
        >
          <Typography component="h2" variant="h6" gutterBottom>
            {title}
          </Typography>
          {icon && (
            <Box sx={{ opacity: 0.8 }}>
              {icon}
            </Box>
          )}
        </Box>
        <Typography component="p" variant="h3">
          {value}
        </Typography>
        {subtext && (
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
            {subtext}
          </Typography>
        )}
      </CardContent>
      {actionText && onAction && (
        <CardActions sx={{ mt: 'auto' }}>
          <Button 
            size="small" 
            sx={{ color: `${color}.contrastText`, opacity: 0.9 }} 
            onClick={onAction}
          >
            {actionText}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default ResumenCard;
