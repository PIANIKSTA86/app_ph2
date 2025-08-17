import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  Box, 
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Typography,
  ListSubheader,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Payments as PaymentsIcon,
  AccountBalance as AccountBalanceIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  ExpandLess,
  ExpandMore,
  BookOutlined as ContabilidadIcon,
  MonetizationOn as TesoreriaIcon,
  ShoppingCart as ComprasIcon,
  Inventory as InventarioIcon,
  AssignmentOutlined as NIIFIcon,
  PeopleAlt as NominaIcon,
  PhoneAndroid as AppMovilIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

// Ancho del drawer
const drawerWidth = 240;

const MainLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [finanzasOpen, setFinanzasOpen] = useState(false);
  const [administracionOpen, setAdministracionOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleFinanzasClick = () => {
    setFinanzasOpen(!finanzasOpen);
  };

  const handleAdministracionClick = () => {
    setAdministracionOpen(!administracionOpen);
  };

  // Contenido del menú lateral
  const drawer = (
    <Box>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sx={{ width: 64, height: 64, mb: 1, bgcolor: 'primary.main' }}>
          {user?.nombre?.charAt(0) || 'U'}
        </Avatar>
        <Typography variant="h6" noWrap component="div">
          {user?.nombre || 'Usuario'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.rol || 'Rol no definido'}
        </Typography>
      </Box>
      <Divider />
      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            General
          </ListSubheader>
        }
      >
        <ListItem 
          button 
          component={Link} 
          to="/dashboard" 
          selected={location.pathname === '/dashboard'}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        {/* Menú de Finanzas */}
        <ListItem button onClick={handleFinanzasClick}>
          <ListItemIcon>
            <AccountBalanceIcon />
          </ListItemIcon>
          <ListItemText primary="Finanzas" />
          {finanzasOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={finanzasOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem 
              button 
              component={Link} 
              to="/facturacion" 
              selected={location.pathname === '/facturacion' || location.pathname.startsWith('/facturacion/')}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary="Facturación" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/cartera" 
              selected={location.pathname.startsWith('/cartera')}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <PaymentsIcon />
              </ListItemIcon>
              <ListItemText primary="Cartera" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/presupuesto" 
              selected={location.pathname.startsWith('/presupuesto')}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <AccountBalanceIcon />
              </ListItemIcon>
              <ListItemText primary="Presupuesto" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/contabilidad" 
              selected={location.pathname.startsWith('/contabilidad')}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <ContabilidadIcon />
              </ListItemIcon>
              <ListItemText primary="Contabilidad" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/tesoreria" 
              selected={location.pathname.startsWith('/tesoreria')}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <TesoreriaIcon />
              </ListItemIcon>
              <ListItemText primary="Tesorería" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/niif-activos-fijos" 
              selected={location.pathname.startsWith('/niif-activos-fijos')}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <NIIFIcon />
              </ListItemIcon>
              <ListItemText primary="NIIF / Activos Fijos" />
            </ListItem>
          </List>
        </Collapse>

        {/* Menú de Administración */}
        <ListItem button onClick={handleAdministracionClick}>
          <ListItemIcon>
            <InventarioIcon />
          </ListItemIcon>
          <ListItemText primary="Administración" />
          {administracionOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={administracionOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem 
              button 
              component={Link} 
              to="/compras-proveedores" 
              selected={location.pathname.startsWith('/compras-proveedores')}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <ComprasIcon />
              </ListItemIcon>
              <ListItemText primary="Compras y Proveedores" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/inventario" 
              selected={location.pathname.startsWith('/inventario')}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <InventarioIcon />
              </ListItemIcon>
              <ListItemText primary="Inventario" />
            </ListItem>
            
            <ListItem 
              button 
              component={Link} 
              to="/nomina" 
              selected={location.pathname.startsWith('/nomina')}
              sx={{ pl: 4 }}
            >
              <ListItemIcon>
                <NominaIcon />
              </ListItemIcon>
              <ListItemText primary="Nómina" />
            </ListItem>
          </List>
        </Collapse>

        <ListItem 
          button 
          component={Link} 
          to="/app-propietarios" 
          selected={location.pathname.startsWith('/app-propietarios')}
        >
          <ListItemIcon>
            <AppMovilIcon />
          </ListItemIcon>
          <ListItemText primary="App Propietarios" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button component={Link} to="/configuracion" selected={location.pathname === '/configuracion'}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Configuración" />
        </ListItem>
        <ListItem 
          button 
          onClick={() => {
            logout();
            window.location.href = '/login'; // Forzamos la navegación al logout
          }}
        >
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Sistema de Gestión PH
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="carpetas de navegación"
      >
        {/* Drawer para dispositivos móviles */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Mejor rendimiento en dispositivos móviles
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* Drawer permanente para escritorio */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
