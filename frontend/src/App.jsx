import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './components/MainLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import HomePage from './pages/HomePage'
import FacturacionPage from './pages/FacturacionPage'
import PresupuestoPage from './pages/PresupuestoPage'
import CarteraPage from './pages/CarteraPage'
import ConfiguracionPage from './pages/ConfiguracionPage'
import ContabilidadPage from './pages/ContabilidadPage'
import TesoreriaPage from './pages/TesoreriaPage'
import ComprasProveedoresPage from './pages/ComprasProveedoresPage'
import InventarioPageNew from './pages/InventarioPageNew'
import NIIFActivosFijosPage from './pages/NIIFActivosFijosPage'
import NominaPage from './pages/NominaPage'
import AppMovilPropietariosPage from './pages/AppMovilPropietariosPage'
import './App.css'

// Crear tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Rutas protegidas dentro del layout principal */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/facturacion" element={<FacturacionPage />} />
                <Route path="/presupuesto" element={<PresupuestoPage />} />
                <Route path="/cartera" element={<CarteraPage />} />
                <Route path="/contabilidad" element={<ContabilidadPage />} />
                <Route path="/tesoreria" element={<TesoreriaPage />} />
                <Route path="/compras-proveedores" element={<ComprasProveedoresPage />} />
                <Route path="/inventario" element={<InventarioPageNew />} />
                <Route path="/niif-activos-fijos" element={<NIIFActivosFijosPage />} />
                <Route path="/nomina" element={<NominaPage />} />
                <Route path="/app-propietarios" element={<AppMovilPropietariosPage />} />
                <Route path="/configuracion" element={<ConfiguracionPage />} />
              </Route>
            </Route>
            
            {/* Página principal */}
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
