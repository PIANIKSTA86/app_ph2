import api from './api';

const DashboardService = {
  /**
   * Obtiene un resumen de los indicadores para el dashboard
   * @returns {Promise} - Promise con los datos del resumen
   */
  getResumen: async () => {
    try {
      const response = await api.get('/api/dashboard/resumen');
      return response.data;
    } catch (error) {
      console.error('Error al obtener resumen del dashboard:', error);
      throw error;
    }
  },

  /**
   * Obtiene la lista de facturas pendientes
   * @param {Object} params - Parámetros de filtrado
   * @returns {Promise} - Promise con los datos de las facturas
   */
  getFacturasPendientes: async (params = {}) => {
    try {
      const response = await api.get('/api/facturacion/facturas/pendientes', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener facturas pendientes:', error);
      throw error;
    }
  },

  /**
   * Obtiene el resumen de ingresos y gastos mensuales
   * @param {Object} params - Parámetros de filtrado (mes, año)
   * @returns {Promise} - Promise con los datos financieros
   */
  getResumenFinanciero: async (params = {}) => {
    try {
      const response = await api.get('/api/dashboard/financiero', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener resumen financiero:', error);
      throw error;
    }
  },

  /**
   * Obtiene la cartera vencida
   * @param {Object} params - Parámetros de filtrado
   * @returns {Promise} - Promise con los datos de cartera vencida
   */
  getCarteraVencida: async (params = {}) => {
    try {
      const response = await api.get('/api/cartera/vencida', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener cartera vencida:', error);
      throw error;
    }
  },

  /**
   * Obtiene las actividades recientes
   * @param {number} limit - Número de actividades a obtener
   * @returns {Promise} - Promise con los datos de las actividades
   */
  getActividadesRecientes: async (limit = 10) => {
    try {
      const response = await api.get('/api/dashboard/actividades', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error al obtener actividades recientes:', error);
      throw error;
    }
  },

  /**
   * Método para simular datos cuando el backend aún no tiene implementados ciertos endpoints
   * @returns {Object} - Datos simulados para el dashboard
   */
  getDatosDemostracion: () => {
    return {
      facturasPendientes: {
        count: 12,
        total: 4500,
        facturas: [
          { id: 1, residente: 'Juan Pérez', unidad: '101', monto: 350, fechaVencimiento: '2025-08-20' },
          { id: 2, residente: 'María López', unidad: '203', monto: 420, fechaVencimiento: '2025-08-18' },
          { id: 3, residente: 'Carlos Gómez', unidad: '305', monto: 380, fechaVencimiento: '2025-08-25' },
        ]
      },
      resumenFinanciero: {
        ingresos: 4500,
        gastos: 3200,
        saldo: 1300,
        detalleIngresos: [
          { categoria: 'Administración', monto: 3800 },
          { categoria: 'Parqueaderos', monto: 500 },
          { categoria: 'Intereses', monto: 200 },
        ],
        detalleGastos: [
          { categoria: 'Personal', monto: 1500 },
          { categoria: 'Servicios', monto: 1200 },
          { categoria: 'Mantenimiento', monto: 500 },
        ]
      },
      carteraVencida: {
        total: 1800,
        deudores: [
          { residente: 'Pedro Rodríguez', unidad: '402', monto: 780, diasVencimiento: 45 },
          { residente: 'Ana Martínez', unidad: '504', monto: 520, diasVencimiento: 30 },
          { residente: 'Luis Torres', unidad: '201', monto: 500, diasVencimiento: 15 },
        ]
      },
      actividades: [
        { tipo: 'pago', descripcion: 'Pago recibido de Juan Pérez - Apto 101', fecha: '2025-08-14T09:30:00', monto: 350 },
        { tipo: 'factura', descripcion: 'Factura generada para el periodo Agosto 2025', fecha: '2025-08-10T08:15:00' },
        { tipo: 'gasto', descripcion: 'Pago servicio de vigilancia', fecha: '2025-08-05T14:20:00', monto: 1200 },
        { tipo: 'reunion', descripcion: 'Reunión de consejo programada', fecha: '2025-08-20T17:00:00' }
      ]
    };
  }
};

export default DashboardService;
