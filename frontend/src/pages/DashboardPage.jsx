import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid,
  Button,
  Alert
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  MonetizationOn as MonetizationOnIcon,
  TrendingDown as TrendingDownIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  BookOutlined as ContabilidadIcon,
  Inventory as InventarioIcon,
  ShoppingCart as ComprasIcon,
  PeopleAlt as NominaIcon,
  AccountBalance as NIIFIcon,
  PhoneAndroid as AppMovilIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import DashboardService from '../services/dashboard.service';
import ResumenCard from '../components/ResumenCard';
import FacturasPendientesTable from '../components/FacturasPendientesTable';
import ActividadesRecientesList from '../components/ActividadesRecientesList';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    facturasPendientes: { count: 0, total: 0, facturas: [] },
    resumenFinanciero: { ingresos: 0, gastos: 0, saldo: 0 },
    carteraVencida: { total: 0, deudores: [] },
    actividades: []
  });
  
  // Formatear montos para mostrar en las tarjetas
  const formatMonto = (monto) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(monto);
  };
  
  // Cargar datos del dashboard
  const cargarDatosDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      // Intentamos obtener datos reales del backend
      // Si no est�n disponibles, usamos datos de demostraci�n
      try {
        const resumen = await DashboardService.getResumen();
        setDashboardData(resumen);
      } catch (err) {
        console.log('Usando datos de demostraci�n');
        const demoData = DashboardService.getDatosDemostracion();
        setDashboardData(demoData);
      }
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      setError('Error al cargar los datos del dashboard. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  // Manejadores de navegación
  const irAFacturacion = () => navigate('/facturacion');
  const irACartera = () => navigate('/cartera');
  const irAPresupuesto = () => navigate('/presupuesto');
  const irAContabilidad = () => navigate('/contabilidad');
  const irATesoreria = () => navigate('/tesoreria');
  const irAComprasProveedores = () => navigate('/compras-proveedores');
  const irAInventario = () => navigate('/inventario');
  const irANiifActivosFijos = () => navigate('/niif-activos-fijos');
  const irANomina = () => navigate('/nomina');
  const irAAppPropietarios = () => navigate('/app-propietarios');

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Dashboard
        </Typography>
        <Button 
          startIcon={<RefreshIcon />} 
          variant="outlined"
          onClick={cargarDatosDashboard}
          disabled={loading}
        >
          Actualizar
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Tarjetas de resumen */}
        <Grid item xs={12} sm={6} lg={3}>
          <ResumenCard
            title="Facturas Pendientes"
            value={dashboardData.facturasPendientes.count}
            color="primary"
            loading={loading}
            subtext={`Total: ${formatMonto(dashboardData.facturasPendientes.total)}`}
            actionText="Ver todas"
            onAction={irAFacturacion}
            icon={<AssignmentIcon fontSize="large" />}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <ResumenCard
            title="Ingresos del Mes"
            value={formatMonto(dashboardData.resumenFinanciero.ingresos)}
            color="success"
            loading={loading}
            icon={<MonetizationOnIcon fontSize="large" />}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <ResumenCard
            title="Gastos del Mes"
            value={formatMonto(dashboardData.resumenFinanciero.gastos)}
            color="warning"
            loading={loading}
            icon={<TrendingDownIcon fontSize="large" />}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <ResumenCard
            title="Cartera Vencida"
            value={formatMonto(dashboardData.carteraVencida.total)}
            color="error"
            loading={loading}
            actionText="Ver detalles"
            onAction={irACartera}
            icon={<WarningIcon fontSize="large" />}
          />
        </Grid>
        
        {/* Facturas pendientes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Facturas Pendientes
            </Typography>
            <FacturasPendientesTable 
              facturas={dashboardData.facturasPendientes.facturas} 
              loading={loading}
              onFacturaClick={(factura) => console.log('Factura seleccionada:', factura)}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                size="small" 
                color="primary"
                onClick={irAFacturacion}
              >
                Ver todas
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Actividad reciente */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Actividad Reciente
            </Typography>
            <ActividadesRecientesList 
              actividades={dashboardData.actividades}
              loading={loading}
              onActividadClick={(actividad) => console.log('Actividad seleccionada:', actividad)}
            />
          </Paper>
        </Grid>

        {/* Módulos adicionales */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Módulos Adicionales
          </Typography>
        </Grid>
        
        <Grid item xs={6} sm={4} md={2}>
          <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }} onClick={irAContabilidad}>
            <ContabilidadIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body2">Contabilidad</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }} onClick={irATesoreria}>
            <MonetizationOnIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body2">Tesorería</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }} onClick={irAComprasProveedores}>
            <ComprasIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body2">Compras</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }} onClick={irAInventario}>
            <InventarioIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body2">Inventario</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }} onClick={irANiifActivosFijos}>
            <NIIFIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body2">NIIF / Activos</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }} onClick={irANomina}>
            <NominaIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body2">Nómina</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 2, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              bgcolor: 'primary.light',
              color: 'white'
            }} 
            onClick={irAAppPropietarios}
          >
            <Box display="flex" alignItems="center">
              <AppMovilIcon sx={{ fontSize: 40, mr: 2 }} />
              <Box>
                <Typography variant="h6">App Móvil para Propietarios</Typography>
                <Typography variant="body2">Visualiza la experiencia de los propietarios en la app móvil</Typography>
              </Box>
            </Box>
            <Button variant="contained" color="primary" sx={{ bgcolor: 'white', color: 'primary.main' }}>
              Ver Demo
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
