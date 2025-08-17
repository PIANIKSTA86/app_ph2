import api from './api';

const FacturacionService = {
  /**
   * Obtiene la lista de facturas con opciones de filtrado y paginación
   * @param {Object} params - Parámetros de filtrado y paginación
   * @returns {Promise} - Promise con los datos de las facturas
   */
  getFacturas: async (params = {}) => {
    try {
      const response = await api.get('/api/facturacion/facturas', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener facturas:', error);
      throw error;
    }
  },

  /**
   * Obtiene una factura por ID
   * @param {number} id - ID de la factura
   * @returns {Promise} - Promise con los datos de la factura
   */
  getFacturaById: async (id) => {
    try {
      const response = await api.get(`/api/facturacion/facturas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener factura ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea una nueva factura
   * @param {Object} factura - Datos de la factura
   * @returns {Promise} - Promise con la respuesta del servidor
   */
  createFactura: async (factura) => {
    try {
      const response = await api.post('/api/facturacion/facturas', factura);
      return response.data;
    } catch (error) {
      console.error('Error al crear factura:', error);
      throw error;
    }
  },

  /**
   * Actualiza una factura existente
   * @param {number} id - ID de la factura
   * @param {Object} factura - Datos actualizados
   * @returns {Promise} - Promise con la respuesta del servidor
   */
  updateFactura: async (id, factura) => {
    try {
      const response = await api.put(`/api/facturacion/facturas/${id}`, factura);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar factura ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina una factura
   * @param {number} id - ID de la factura
   * @returns {Promise} - Promise con la respuesta del servidor
   */
  deleteFactura: async (id) => {
    try {
      const response = await api.delete(`/api/facturacion/facturas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar factura ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Marca una factura como pagada
   * @param {number} id - ID de la factura
   * @param {Object} datosPago - Datos del pago
   * @returns {Promise} - Promise con la respuesta del servidor
   */
  pagarFactura: async (id, datosPago) => {
    try {
      const response = await api.post(`/api/facturacion/facturas/${id}/pagar`, datosPago);
      return response.data;
    } catch (error) {
      console.error(`Error al registrar pago de factura ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene los conceptos de facturación disponibles
   * @returns {Promise} - Promise con los datos de los conceptos
   */
  getConceptos: async () => {
    try {
      const response = await api.get('/api/facturacion/conceptos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener conceptos de facturación:', error);
      throw error;
    }
  },

  /**
   * Método para simular datos cuando el backend aún no tiene implementados ciertos endpoints
   * @param {Object} params - Parámetros de filtrado y paginación
   * @returns {Object} - Datos simulados de facturas
   */
  getDatosDemostracion: (params = {}) => {
    const estadoOpciones = ['pendiente', 'pagada', 'vencida', 'anulada'];
    
    const facturas = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      numero: `F-${2025}${String(i + 1).padStart(4, '0')}`,
      residente: `Residente ${i + 1}`,
      unidad: `${Math.floor(i / 5) + 1}${String(i % 5 + 1).padStart(2, '0')}`,
      concepto: 'Administración',
      fechaEmision: new Date(2025, 7, Math.floor(Math.random() * 15) + 1).toISOString().split('T')[0],
      fechaVencimiento: new Date(2025, 8, Math.floor(Math.random() * 15) + 1).toISOString().split('T')[0],
      monto: Math.floor(Math.random() * 500) * 1000 + 200000,
      estado: estadoOpciones[Math.floor(Math.random() * estadoOpciones.length)]
    }));
    
    // Filtrar por estado si se proporciona
    let facturasFiltradas = facturas;
    if (params.estado) {
      facturasFiltradas = facturas.filter(f => f.estado === params.estado);
    }
    
    // Filtrar por unidad si se proporciona
    if (params.unidad) {
      facturasFiltradas = facturasFiltradas.filter(f => f.unidad.includes(params.unidad));
    }
    
    // Ordenar por fecha de emisión descendente por defecto
    facturasFiltradas.sort((a, b) => new Date(b.fechaEmision) - new Date(a.fechaEmision));
    
    // Paginación
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFacturas = facturasFiltradas.slice(startIndex, endIndex);
    
    return {
      facturas: paginatedFacturas,
      total: facturasFiltradas.length,
      page,
      limit,
      totalPages: Math.ceil(facturasFiltradas.length / limit)
    };
  },
  
  /**
   * Obtiene los datos de demostración para conceptos de facturación
   * @returns {Array} - Conceptos de facturación simulados
   */
  getConceptosDemostracion: () => {
    return [
      { id: 1, nombre: 'Administración', descripcion: 'Cuota mensual de administración', tipo: 'fijo' },
      { id: 2, nombre: 'Parqueadero', descripcion: 'Cuota mensual de parqueadero', tipo: 'fijo' },
      { id: 3, nombre: 'Multa', descripcion: 'Multa por infracciones', tipo: 'variable' },
      { id: 4, nombre: 'Interés de mora', descripcion: 'Intereses por pagos vencidos', tipo: 'variable' },
      { id: 5, nombre: 'Cuota extraordinaria', descripcion: 'Cuota para gastos especiales', tipo: 'variable' }
    ];
  }
};

export default FacturacionService;
