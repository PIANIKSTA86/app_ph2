import api from './api';

// Servicio para gestión de inventario
const inventarioService = {
  // PRODUCTOS
  getProductos: async (params = {}) => {
    try {
      const response = await api.get('/api/inventario/productos', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  getProductoById: async (id) => {
    try {
      const response = await api.get(`/api/inventario/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener producto ${id}:`, error);
      throw error;
    }
  },

  createProducto: async (data) => {
    try {
      const response = await api.post('/api/inventario/productos', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  updateProducto: async (id, data) => {
    try {
      const response = await api.put(`/api/inventario/productos/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar producto ${id}:`, error);
      throw error;
    }
  },

  deleteProducto: async (id) => {
    try {
      const response = await api.delete(`/api/inventario/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar producto ${id}:`, error);
      throw error;
    }
  },

  // CATEGORÍAS
  getCategorias: async () => {
    try {
      const response = await api.get('/api/inventario/categorias');
      return response.data;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  },

  createCategoria: async (data) => {
    try {
      const response = await api.post('/api/inventario/categorias', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error;
    }
  },

  updateCategoria: async (id, data) => {
    try {
      const response = await api.put(`/api/inventario/categorias/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar categoría ${id}:`, error);
      throw error;
    }
  },

  deleteCategoria: async (id) => {
    try {
      const response = await api.delete(`/api/inventario/categorias/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar categoría ${id}:`, error);
      throw error;
    }
  },

  // LÍNEAS
  getLineas: async () => {
    try {
      const response = await api.get('/api/inventario/lineas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener líneas:', error);
      throw error;
    }
  },

  createLinea: async (data) => {
    try {
      const response = await api.post('/api/inventario/lineas', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear línea:', error);
      throw error;
    }
  },

  updateLinea: async (id, data) => {
    try {
      const response = await api.put(`/api/inventario/lineas/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar línea ${id}:`, error);
      throw error;
    }
  },

  deleteLinea: async (id) => {
    try {
      const response = await api.delete(`/api/inventario/lineas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar línea ${id}:`, error);
      throw error;
    }
  },

  // GRUPOS
  getGrupos: async () => {
    try {
      const response = await api.get('/api/inventario/grupos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener grupos:', error);
      throw error;
    }
  },

  createGrupo: async (data) => {
    try {
      const response = await api.post('/api/inventario/grupos', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear grupo:', error);
      throw error;
    }
  },

  updateGrupo: async (id, data) => {
    try {
      const response = await api.put(`/api/inventario/grupos/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar grupo ${id}:`, error);
      throw error;
    }
  },

  deleteGrupo: async (id) => {
    try {
      const response = await api.delete(`/api/inventario/grupos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar grupo ${id}:`, error);
      throw error;
    }
  },

  // MARCAS
  getMarcas: async () => {
    try {
      const response = await api.get('/api/inventario/marcas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener marcas:', error);
      throw error;
    }
  },

  createMarca: async (data) => {
    try {
      const response = await api.post('/api/inventario/marcas', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear marca:', error);
      throw error;
    }
  },

  updateMarca: async (id, data) => {
    try {
      const response = await api.put(`/api/inventario/marcas/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar marca ${id}:`, error);
      throw error;
    }
  },

  deleteMarca: async (id) => {
    try {
      const response = await api.delete(`/api/inventario/marcas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar marca ${id}:`, error);
      throw error;
    }
  },

  // BODEGAS
  getBodegas: async () => {
    try {
      const response = await api.get('/api/inventario/bodegas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener bodegas:', error);
      throw error;
    }
  },

  createBodega: async (data) => {
    try {
      const response = await api.post('/api/inventario/bodegas', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear bodega:', error);
      throw error;
    }
  },

  updateBodega: async (id, data) => {
    try {
      const response = await api.put(`/api/inventario/bodegas/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar bodega ${id}:`, error);
      throw error;
    }
  },

  deleteBodega: async (id) => {
    try {
      const response = await api.delete(`/api/inventario/bodegas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar bodega ${id}:`, error);
      throw error;
    }
  },

  // TRASLADOS
  getTraslados: async () => {
    try {
      const response = await api.get('/api/inventario/traslados');
      return response.data;
    } catch (error) {
      console.error('Error al obtener traslados:', error);
      throw error;
    }
  },

  createTraslado: async (data) => {
    try {
      const response = await api.post('/api/inventario/traslados', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear traslado:', error);
      throw error;
    }
  },

  updateTraslado: async (id, data) => {
    try {
      const response = await api.put(`/api/inventario/traslados/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar traslado ${id}:`, error);
      throw error;
    }
  },

  deleteTraslado: async (id) => {
    try {
      const response = await api.delete(`/api/inventario/traslados/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar traslado ${id}:`, error);
      throw error;
    }
  },

  // REPORTES
  getReporteGeneral: async (params = {}) => {
    try {
      const response = await api.get('/api/inventario/reportes/general', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener reporte general:', error);
      throw error;
    }
  },

  getEstadisticas: async (params = {}) => {
    try {
      const response = await api.get('/api/inventario/reportes/estadisticas', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  },
  
  // MOVIMIENTOS DE INVENTARIO
  getMovimientos: async (params = {}) => {
    try {
      const response = await api.get('/api/inventario/movimientos', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener movimientos:', error);
      throw error;
    }
  },
  
  registrarMovimiento: async (data) => {
    try {
      const response = await api.post('/api/inventario/movimientos', data);
      return response.data;
    } catch (error) {
      console.error('Error al registrar movimiento:', error);
      throw error;
    }
  },

  // Inicialización de tablas
  inicializarTablas: async () => {
    try {
      const response = await api.post('/api/inventario/inicializar');
      return response.data;
    } catch (error) {
      console.error('Error al inicializar tablas de inventario:', error);
      throw error;
    }
  },
};

export default inventarioService;
