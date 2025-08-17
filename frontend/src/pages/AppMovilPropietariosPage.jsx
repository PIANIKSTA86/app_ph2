import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Grid, 
  Box, 
  Button, 
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Avatar,
  TextField,
  IconButton,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  Badge,
  Alert,
  Tooltip,
  BottomNavigation,
  BottomNavigationAction
} from '@mui/material';
import {
  Home as HomeIcon,
  Notifications as NotificationsIcon,
  Payments as PaymentsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Payment as PaymentIcon,
  Announcement as AnnouncementIcon,
  Assignment as AssignmentIcon,
  EventNote as EventNoteIcon,
  Comment as CommentIcon,
  Receipt as ReceiptIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Send as SendIcon,
  DocumentScanner as DocumentScannerIcon,
  Forum as ForumIcon
} from '@mui/icons-material';

// Datos de ejemplo para el usuario propietario
const propietarioData = {
  id: 1,
  nombre: "Carlos Martínez",
  correo: "carlos.martinez@gmail.com",
  telefono: "310-456-7890",
  unidad: "Torre A - Apto 501",
  fechaRegistro: "2023-05-15",
  estado: "Activo",
  fotoPerfil: "https://randomuser.me/api/portraits/men/75.jpg",
  saldoActual: -250000
};

// Datos de ejemplo para las facturas
const facturasData = [
  {
    id: 1,
    periodo: "Agosto 2025",
    fechaEmision: "2025-08-01",
    fechaVencimiento: "2025-08-15",
    valor: 250000,
    estado: "Pendiente",
    conceptos: [
      { concepto: "Cuota administración", valor: 230000 },
      { concepto: "Parqueadero adicional", valor: 20000 }
    ]
  },
  {
    id: 2,
    periodo: "Julio 2025",
    fechaEmision: "2025-07-01",
    fechaVencimiento: "2025-07-15",
    valor: 250000,
    estado: "Pagada",
    fechaPago: "2025-07-10",
    conceptos: [
      { concepto: "Cuota administración", valor: 230000 },
      { concepto: "Parqueadero adicional", valor: 20000 }
    ]
  },
  {
    id: 3,
    periodo: "Junio 2025",
    fechaEmision: "2025-06-01",
    fechaVencimiento: "2025-06-15",
    valor: 250000,
    estado: "Pagada",
    fechaPago: "2025-06-14",
    conceptos: [
      { concepto: "Cuota administración", valor: 230000 },
      { concepto: "Parqueadero adicional", valor: 20000 }
    ]
  }
];

// Datos de ejemplo para los anuncios
const anunciosData = [
  {
    id: 1,
    titulo: "Mantenimiento de ascensores",
    fecha: "2025-08-15",
    contenido: "Se realizará mantenimiento a los ascensores de la Torre A el día 20 de agosto de 8:00 AM a 12:00 PM. Por favor utilizar las escaleras durante ese período.",
    tipo: "Mantenimiento",
    importante: true
  },
  {
    id: 2,
    titulo: "Reunión de Asamblea Extraordinaria",
    fecha: "2025-08-10",
    contenido: "Se convoca a Asamblea Extraordinaria para el día 30 de agosto a las 7:00 PM en el salón comunal para tratar temas relacionados con la renovación de áreas comunes.",
    tipo: "Asamblea",
    importante: true
  },
  {
    id: 3,
    titulo: "Nuevos horarios de gimnasio",
    fecha: "2025-08-05",
    contenido: "A partir del 1 de septiembre, el gimnasio estará disponible desde las 5:00 AM hasta las 10:00 PM todos los días.",
    tipo: "Informativo",
    importante: false
  },
  {
    id: 4,
    titulo: "Fumigación áreas comunes",
    fecha: "2025-08-01",
    contenido: "El próximo sábado 25 de agosto se realizará fumigación en todas las áreas comunes. Se recomienda no transitar por zonas recién fumigadas durante 2 horas.",
    tipo: "Mantenimiento",
    importante: true
  }
];

// Datos de ejemplo para reservas
const reservasData = [
  {
    id: 1,
    espacio: "Salón Comunal",
    fecha: "2025-08-25",
    horaInicio: "18:00",
    horaFin: "22:00",
    estado: "Aprobada",
    motivo: "Fiesta de cumpleaños"
  },
  {
    id: 2,
    espacio: "BBQ",
    fecha: "2025-09-05",
    horaInicio: "12:00",
    horaFin: "16:00",
    estado: "Pendiente",
    motivo: "Almuerzo familiar"
  }
];

// Datos de ejemplo para PQRS
const pqrsData = [
  {
    id: 1,
    tipo: "Queja",
    asunto: "Ruido excesivo en el apartamento vecino",
    fecha: "2025-08-10",
    estado: "En proceso",
    respuesta: null
  },
  {
    id: 2,
    tipo: "Solicitud",
    asunto: "Permiso para instalación de aire acondicionado",
    fecha: "2025-07-25",
    estado: "Resuelta",
    respuesta: "Permiso aprobado con condiciones específicas. Por favor revisar documento adjunto."
  }
];

// Componente principal de la App Móvil para propietarios
const AppMovilPropietarios = () => {
  const [propietario, setPropietario] = useState(null);
  const [facturas, setFacturas] = useState([]);
  const [anuncios, setAnuncios] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [pqrs, setPqrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [openFacturaDialog, setOpenFacturaDialog] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [openAnuncioDialog, setOpenAnuncioDialog] = useState(false);
  const [selectedAnuncio, setSelectedAnuncio] = useState(null);
  const [openPQRSDialog, setOpenPQRSDialog] = useState(false);

  // Simular carga de datos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulando una llamada API con timeout
      setTimeout(() => {
        setPropietario(propietarioData);
        setFacturas(facturasData);
        setAnuncios(anunciosData);
        setReservas(reservasData);
        setPqrs(pqrsData);
        setLoading(false);
      }, 800);
    };

    fetchData();
  }, []);

  // Función para formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Manejar cambio de pestaña en navegación inferior
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Manejar apertura de diálogo de factura
  const handleOpenFacturaDialog = (factura) => {
    setSelectedFactura(factura);
    setOpenFacturaDialog(true);
  };

  // Manejar cierre de diálogo de factura
  const handleCloseFacturaDialog = () => {
    setOpenFacturaDialog(false);
  };

  // Manejar apertura de diálogo de anuncio
  const handleOpenAnuncioDialog = (anuncio) => {
    setSelectedAnuncio(anuncio);
    setOpenAnuncioDialog(true);
  };

  // Manejar cierre de diálogo de anuncio
  const handleCloseAnuncioDialog = () => {
    setOpenAnuncioDialog(false);
  };

  // Manejar apertura de diálogo PQRS
  const handleOpenPQRSDialog = () => {
    setOpenPQRSDialog(true);
  };

  // Manejar cierre de diálogo PQRS
  const handleClosePQRSDialog = () => {
    setOpenPQRSDialog(false);
  };

  // Contar facturas pendientes
  const facturasPendientes = facturas.filter(f => f.estado === 'Pendiente').length;

  // Componente de la pestaña Inicio
  const HomeTab = () => (
    <>
      {/* Tarjeta de perfil del propietario */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center">
            <Avatar 
              src={propietario?.fotoPerfil}
              sx={{ width: 70, height: 70, mr: 2 }}
            />
            <Box>
              <Typography variant="h6" component="div">
                {propietario?.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {propietario?.unidad}
              </Typography>
              <Chip 
                label={
                  propietario?.saldoActual >= 0 ? "Al día" : "Saldo pendiente"
                } 
                color={propietario?.saldoActual >= 0 ? "success" : "warning"} 
                size="small" 
                sx={{ mt: 1 }} 
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Alerta si hay saldo pendiente */}
      {propietario?.saldoActual < 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Tienes un saldo pendiente de {formatCurrency(Math.abs(propietario.saldoActual))}
        </Alert>
      )}

      {/* Sección de Anuncios */}
      <Typography variant="h6" gutterBottom>
        Anuncios Recientes
      </Typography>
      <Paper variant="outlined" sx={{ mb: 3 }}>
        <List>
          {anuncios.slice(0, 3).map((anuncio) => (
            <React.Fragment key={anuncio.id}>
              <ListItem 
                button 
                onClick={() => handleOpenAnuncioDialog(anuncio)}
                secondaryAction={
                  anuncio.importante && (
                    <Tooltip title="Importante">
                      <IconButton edge="end" aria-label="importante" size="small">
                        <AnnouncementIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  )
                }
              >
                <ListItemIcon>
                  {anuncio.tipo === 'Mantenimiento' ? (
                    <AssignmentIcon color="primary" />
                  ) : anuncio.tipo === 'Asamblea' ? (
                    <EventNoteIcon color="secondary" />
                  ) : (
                    <AnnouncementIcon color="info" />
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={anuncio.titulo} 
                  secondary={anuncio.fecha}
                />
              </ListItem>
              {anuncios.indexOf(anuncio) < anuncios.slice(0, 3).length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Sección de Pagos Pendientes */}
      <Typography variant="h6" gutterBottom>
        Pagos Pendientes
      </Typography>
      <Paper variant="outlined" sx={{ mb: 3 }}>
        {facturas.filter(f => f.estado === 'Pendiente').length > 0 ? (
          <List>
            {facturas.filter(f => f.estado === 'Pendiente').map((factura) => (
              <React.Fragment key={factura.id}>
                <ListItem
                  button
                  onClick={() => handleOpenFacturaDialog(factura)}
                >
                  <ListItemIcon>
                    <ReceiptIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Administración ${factura.periodo}`}
                    secondary={`Vence: ${factura.fechaVencimiento}`}
                  />
                  <Typography variant="body1" fontWeight="bold" color="error">
                    {formatCurrency(factura.valor)}
                  </Typography>
                </ListItem>
                {facturas.filter(f => f.estado === 'Pendiente').indexOf(factura) < 
                 facturas.filter(f => f.estado === 'Pendiente').length - 1 && 
                 <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box p={2} textAlign="center">
            <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
            <Typography>¡No tienes pagos pendientes!</Typography>
          </Box>
        )}
      </Paper>

      {/* Sección de Próximas Reservas */}
      <Typography variant="h6" gutterBottom>
        Mis Reservas
      </Typography>
      <Paper variant="outlined">
        {reservas.length > 0 ? (
          <List>
            {reservas.map((reserva) => (
              <React.Fragment key={reserva.id}>
                <ListItem>
                  <ListItemIcon>
                    <EventNoteIcon color={reserva.estado === 'Aprobada' ? "success" : "warning"} />
                  </ListItemIcon>
                  <ListItemText
                    primary={reserva.espacio}
                    secondary={`${reserva.fecha} | ${reserva.horaInicio} - ${reserva.horaFin}`}
                  />
                  <Chip 
                    label={reserva.estado}
                    color={reserva.estado === 'Aprobada' ? "success" : "warning"}
                    size="small"
                  />
                </ListItem>
                {reservas.indexOf(reserva) < reservas.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box p={2} textAlign="center">
            <Typography>No tienes reservas activas</Typography>
          </Box>
        )}
      </Paper>
    </>
  );

  // Componente de la pestaña Pagos
  const PagosTab = () => (
    <>
      <Typography variant="h5" gutterBottom>
        Mis Pagos
      </Typography>

      {/* Resumen de estado financiero */}
      <Card sx={{ mb: 3, bgcolor: propietario?.saldoActual >= 0 ? '#e8f5e9' : '#fff8e1' }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Estado de Cuenta
          </Typography>
          <Typography variant="h4" component="div" color={propietario?.saldoActual >= 0 ? "success.main" : "warning.main"}>
            {formatCurrency(propietario?.saldoActual >= 0 ? propietario?.saldoActual : Math.abs(propietario?.saldoActual))}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {propietario?.saldoActual >= 0 ? "Saldo a favor" : "Saldo pendiente"}
          </Typography>
        </CardContent>
        {propietario?.saldoActual < 0 && (
          <CardActions>
            <Button startIcon={<PaymentIcon />} color="primary" fullWidth>
              Pagar Ahora
            </Button>
          </CardActions>
        )}
      </Card>

      {/* Lista de facturas */}
      <Typography variant="h6" gutterBottom>
        Historial de Facturas
      </Typography>
      <Paper variant="outlined">
        <List>
          {facturas.map((factura) => (
            <React.Fragment key={factura.id}>
              <ListItem
                button
                onClick={() => handleOpenFacturaDialog(factura)}
              >
                <ListItemIcon>
                  {factura.estado === 'Pagada' ? (
                    <CheckCircleIcon color="success" />
                  ) : (
                    <ReceiptIcon color="warning" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={`Administración ${factura.periodo}`}
                  secondary={factura.estado === 'Pagada' ? 
                    `Pagada: ${factura.fechaPago}` : 
                    `Vence: ${factura.fechaVencimiento}`}
                />
                <Box display="flex" flexDirection="column" alignItems="flex-end">
                  <Typography variant="body1" fontWeight="medium">
                    {formatCurrency(factura.valor)}
                  </Typography>
                  <Chip 
                    label={factura.estado}
                    color={factura.estado === 'Pagada' ? "success" : "warning"}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </ListItem>
              {facturas.indexOf(factura) < facturas.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </>
  );

  // Componente de la pestaña Anuncios
  const AnunciosTab = () => (
    <>
      <Typography variant="h5" gutterBottom>
        Comunicados
      </Typography>
      <Paper variant="outlined">
        <List>
          {anuncios.map((anuncio) => (
            <React.Fragment key={anuncio.id}>
              <ListItem 
                button 
                onClick={() => handleOpenAnuncioDialog(anuncio)}
                alignItems="flex-start"
              >
                <ListItemIcon>
                  {anuncio.tipo === 'Mantenimiento' ? (
                    <AssignmentIcon color="primary" />
                  ) : anuncio.tipo === 'Asamblea' ? (
                    <EventNoteIcon color="secondary" />
                  ) : (
                    <AnnouncementIcon color="info" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center">
                      <Typography variant="subtitle1" component="span">
                        {anuncio.titulo}
                      </Typography>
                      {anuncio.importante && (
                        <Chip 
                          label="Importante" 
                          color="error" 
                          size="small" 
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: 'block' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {anuncio.fecha}
                      </Typography>
                      <Typography
                        sx={{ display: 'block' }}
                        component="span"
                        variant="body2"
                      >
                        {anuncio.contenido.substring(0, 80)}...
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {anuncios.indexOf(anuncio) < anuncios.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </>
  );

  // Componente de la pestaña Servicios
  const ServiciosTab = () => (
    <>
      <Typography variant="h5" gutterBottom>
        Servicios
      </Typography>

      {/* Sección de Reservas */}
      <Typography variant="h6" gutterBottom>
        Reservas
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Card sx={{ height: '100%' }}>
            <CardMedia
              component="img"
              height="120"
              image="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60"
              alt="Salón Comunal"
            />
            <CardContent>
              <Typography variant="h6" component="div">
                Salón Comunal
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Capacidad para 40 personas
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" fullWidth>
                Reservar
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{ height: '100%' }}>
            <CardMedia
              component="img"
              height="120"
              image="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60"
              alt="BBQ"
            />
            <CardContent>
              <Typography variant="h6" component="div">
                BBQ
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Zona de parrilla
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" fullWidth>
                Reservar
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Sección de PQRS */}
      <Typography variant="h6" gutterBottom>
        PQRS
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="body1" paragraph>
            ¿Tienes una petición, queja, reclamo o sugerencia?
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<CommentIcon />}
            onClick={handleOpenPQRSDialog}
          >
            Crear PQRS
          </Button>
        </CardContent>
      </Card>

      {/* Historial de PQRS */}
      <Typography variant="subtitle1" gutterBottom>
        Historial de PQRS
      </Typography>
      <Paper variant="outlined">
        <List>
          {pqrs.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem>
                <ListItemIcon>
                  <DocumentScannerIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={item.asunto}
                  secondary={`${item.tipo} | ${item.fecha}`}
                />
                <Chip 
                  label={item.estado}
                  color={item.estado === 'Resuelta' ? "success" : "primary"}
                  size="small"
                />
              </ListItem>
              {pqrs.indexOf(item) < pqrs.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </>
  );

  // Componente de la pestaña Perfil
  const PerfilTab = () => (
    <>
      <Typography variant="h5" gutterBottom>
        Mi Perfil
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar 
            src={propietario?.fotoPerfil}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h6">{propietario?.nombre}</Typography>
          <Typography color="text.secondary" gutterBottom>
            {propietario?.unidad}
          </Typography>
          <Button variant="outlined" size="small" sx={{ mt: 1 }}>
            Cambiar foto
          </Button>
        </Box>
      </Card>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Información de contacto
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              value={propietario?.correo}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Teléfono"
              fullWidth
              variant="outlined"
              value={propietario?.telefono}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<EditIcon />}
            >
              Editar información
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Seguridad
        </Typography>
        <Button 
          variant="outlined" 
          color="primary"
          fullWidth
          sx={{ mb: 2 }}
        >
          Cambiar contraseña
        </Button>
        <Button 
          variant="outlined" 
          color="error"
          fullWidth
        >
          Cerrar sesión
        </Button>
      </Paper>
    </>
  );

  // Renderizar el componente de la pestaña activa
  const renderActiveTab = () => {
    switch (activeTab) {
      case 0:
        return <HomeTab />;
      case 1:
        return <PagosTab />;
      case 2:
        return <AnunciosTab />;
      case 3:
        return <ServiciosTab />;
      case 4:
        return <PerfilTab />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          App Móvil para Propietarios
        </Typography>
      </Box>

      {/* Simulación de la app móvil */}
      <Box display="flex" justifyContent="center">
        <Paper
          elevation={3}
          sx={{
            width: 360,
            height: 640,
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Barra de status */}
          <Box 
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white', 
              p: 1, 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography variant="body2">9:41 AM</Typography>
            <Box>
              <WifiIcon fontSize="small" />
              <BatteryFullIcon fontSize="small" />
            </Box>
          </Box>

          {/* Contenido principal */}
          <Box 
            sx={{ 
              flex: 1, 
              overflow: 'auto', 
              bgcolor: '#f5f5f5', 
              p: 2 
            }}
          >
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography>Cargando...</Typography>
              </Box>
            ) : (
              renderActiveTab()
            )}
          </Box>

          {/* Navegación inferior */}
          <BottomNavigation
            value={activeTab}
            onChange={handleTabChange}
            sx={{ bgcolor: 'background.paper' }}
          >
            <BottomNavigationAction 
              label="Inicio" 
              icon={<HomeIcon />} 
            />
            <BottomNavigationAction 
              label="Pagos" 
              icon={
                facturasPendientes > 0 ? (
                  <Badge badgeContent={facturasPendientes} color="error">
                    <PaymentsIcon />
                  </Badge>
                ) : (
                  <PaymentsIcon />
                )
              } 
            />
            <BottomNavigationAction 
              label="Anuncios" 
              icon={<AnnouncementIcon />} 
            />
            <BottomNavigationAction 
              label="Servicios" 
              icon={<ForumIcon />} 
            />
            <BottomNavigationAction 
              label="Perfil" 
              icon={<PersonIcon />} 
            />
          </BottomNavigation>
        </Paper>
      </Box>

      {/* Diálogo para ver detalles de factura */}
      <Dialog open={openFacturaDialog} onClose={handleCloseFacturaDialog} maxWidth="xs" fullWidth>
        {selectedFactura && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              Factura {selectedFactura.periodo}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Box sx={{ bgcolor: '#f5f5f5', p: 1.5, borderRadius: 1 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Fecha emisión:
                      </Typography>
                      <Typography variant="body1">
                        {selectedFactura.fechaEmision}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Fecha vencimiento:
                      </Typography>
                      <Typography variant="body1">
                        {selectedFactura.fechaVencimiento}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Estado:
                      </Typography>
                      <Chip 
                        label={selectedFactura.estado}
                        color={selectedFactura.estado === 'Pagada' ? "success" : "warning"}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                      {selectedFactura.fechaPago && (
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          Pagado el: {selectedFactura.fechaPago}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Box>

                <Typography variant="subtitle1">Conceptos:</Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Concepto</TableCell>
                        <TableCell align="right">Valor</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedFactura.conceptos.map((concepto, index) => (
                        <TableRow key={index}>
                          <TableCell>{concepto.concepto}</TableCell>
                          <TableCell align="right">{formatCurrency(concepto.valor)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          {formatCurrency(selectedFactura.valor)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            </DialogContent>
            <DialogActions>
              {selectedFactura.estado === 'Pendiente' && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleCloseFacturaDialog}
                  startIcon={<PaymentIcon />}
                >
                  Pagar Ahora
                </Button>
              )}
              <Button onClick={handleCloseFacturaDialog} color="primary">
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Diálogo para ver detalles de anuncio */}
      <Dialog open={openAnuncioDialog} onClose={handleCloseAnuncioDialog} maxWidth="sm" fullWidth>
        {selectedAnuncio && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h6">{selectedAnuncio.titulo}</Typography>
                {selectedAnuncio.importante && (
                  <Chip 
                    label="Importante" 
                    color="error" 
                    size="small" 
                  />
                )}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {selectedAnuncio.fecha} • {selectedAnuncio.tipo}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body1" paragraph>
                {selectedAnuncio.contenido}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAnuncioDialog} color="primary">
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Diálogo para crear PQRS */}
      <Dialog open={openPQRSDialog} onClose={handleClosePQRSDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Crear nueva PQRS</DialogTitle>
        <DialogContent>
          <DialogContentText paragraph sx={{ mb: 2 }}>
            Completa el formulario para enviar tu petición, queja, reclamo o sugerencia.
          </DialogContentText>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel>Tipo</InputLabel>
                <Select
                  label="Tipo"
                  defaultValue="Petición"
                >
                  <MenuItem value="Petición">Petición</MenuItem>
                  <MenuItem value="Queja">Queja</MenuItem>
                  <MenuItem value="Reclamo">Reclamo</MenuItem>
                  <MenuItem value="Sugerencia">Sugerencia</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Asunto"
                fullWidth
                variant="outlined"
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="outlined" 
                component="label" 
                startIcon={<AttachFileIcon />}
                fullWidth
              >
                Adjuntar Archivo
                <input
                  type="file"
                  hidden
                />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePQRSDialog}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleClosePQRSDialog}
            startIcon={<SendIcon />}
          >
            Enviar PQRS
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Iconos adicionales para la barra de status
const WifiIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24">
    <path fill="white" d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
  </svg>
);

const BatteryFullIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="white" d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
  </svg>
);

export default AppMovilPropietarios;
