const express = require('express');
const inventarioModels = require('./inventario.models');
const authMiddleware = require('../../core/authMiddleware');
const router = express.Router();

// Middleware para validar autenticación
router.use(authMiddleware.verificarToken);

// Ruta para inicializar tablas (tiene que estar antes de las demás rutas)
router.post('/inicializar', async (req, res) => {
  try {
    const resultado = await inventarioModels.inicializarTablas();
    res.status(200).json({ mensaje: 'Tablas de inventario inicializadas correctamente', resultado });
  } catch (error) {
    console.error('Error al inicializar tablas de inventario:', error);
    res.status(500).json({ error: error.message || 'Error al inicializar tablas de inventario' });
  }
});

// RUTAS PARA PRODUCTOS

// Obtener todos los productos con filtros y paginación
router.get('/productos', async (req, res) => {
  try {
    const data = await inventarioModels.getProductos(req.query);
    res.json(data);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: error.message || 'Error al obtener productos' });
  }
});

// Obtener un producto por ID
router.get('/productos/:id', async (req, res) => {
  try {
    const producto = await inventarioModels.getProductoById(req.params.id);
    
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    
    res.json(producto);
  } catch (error) {
    console.error(`Error al obtener producto con ID ${req.params.id}:`, error);
    res.status(500).json({ error: error.message || 'Error al obtener el producto' });
  }
});

// Crear un nuevo producto
router.post('/productos', async (req, res) => {
  try {
    const nuevoProducto = await inventarioModels.createProducto(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(400).json({ error: error.message || 'Error al crear el producto' });
  }
});

// Actualizar un producto existente
router.put('/productos/:id', async (req, res) => {
  try {
    const productoActualizado = await inventarioModels.updateProducto(req.params.id, req.body);
    res.json(productoActualizado);
  } catch (error) {
    console.error(`Error al actualizar producto con ID ${req.params.id}:`, error);
    res.status(400).json({ error: error.message || 'Error al actualizar el producto' });
  }
});

// Eliminar un producto
router.delete('/productos/:id', async (req, res) => {
  try {
    const resultado = await inventarioModels.deleteProducto(req.params.id);
    res.json(resultado);
  } catch (error) {
    console.error(`Error al eliminar producto con ID ${req.params.id}:`, error);
    res.status(500).json({ error: error.message || 'Error al eliminar el producto' });
  }
});

// Obtener productos con stock bajo
router.get('/productos/bajo-stock', async (req, res) => {
  try {
    const productos = await inventarioModels.getProductosBajoStock();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos con bajo stock:', error);
    res.status(500).json({ error: error.message || 'Error al obtener productos con bajo stock' });
  }
});

// Obtener historial de un producto
router.get('/productos/:id/historial', async (req, res) => {
  try {
    const historial = await inventarioModels.getHistorialProducto(req.params.id);
    res.json(historial);
  } catch (error) {
    console.error(`Error al obtener historial del producto con ID ${req.params.id}:`, error);
    res.status(500).json({ error: error.message || 'Error al obtener el historial del producto' });
  }
});

// RUTAS PARA CATEGORÍAS

// Obtener todas las categorías
router.get('/categorias', async (req, res) => {
  try {
    const categorias = await inventarioModels.getCategorias();
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: error.message || 'Error al obtener categorías' });
  }
});

// Obtener una categoría por ID
router.get('/categorias/:id', async (req, res) => {
  try {
    const categoria = await inventarioModels.getCategoriaById(req.params.id);
    
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    
    res.json(categoria);
  } catch (error) {
    console.error(`Error al obtener categoría con ID ${req.params.id}:`, error);
    res.status(500).json({ error: error.message || 'Error al obtener la categoría' });
  }
});

// Crear una nueva categoría
router.post('/categorias', async (req, res) => {
  try {
    const nuevaCategoria = await inventarioModels.createCategoria(req.body);
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(400).json({ error: error.message || 'Error al crear la categoría' });
  }
});

// Actualizar una categoría existente
router.put('/categorias/:id', async (req, res) => {
  try {
    const categoriaActualizada = await inventarioModels.updateCategoria(req.params.id, req.body);
    res.json(categoriaActualizada);
  } catch (error) {
    console.error(`Error al actualizar categoría con ID ${req.params.id}:`, error);
    res.status(400).json({ error: error.message || 'Error al actualizar la categoría' });
  }
});

// Eliminar una categoría
router.delete('/categorias/:id', async (req, res) => {
  try {
    const resultado = await inventarioModels.deleteCategoria(req.params.id);
    res.json(resultado);
  } catch (error) {
    console.error(`Error al eliminar categoría con ID ${req.params.id}:`, error);
    res.status(400).json({ error: error.message || 'Error al eliminar la categoría' });
  }
});

// RUTAS PARA LÍNEAS

// Obtener todas las líneas
router.get('/lineas', async (req, res) => {
  try {
    const lineas = await inventarioModels.getLineas();
    res.json(lineas);
  } catch (error) {
    console.error('Error al obtener líneas:', error);
    res.status(500).json({ error: error.message || 'Error al obtener líneas' });
  }
});

// Crear una nueva línea
router.post('/lineas', async (req, res) => {
  try {
    const nuevaLinea = await inventarioModels.createLinea(req.body);
    res.status(201).json(nuevaLinea);
  } catch (error) {
    console.error('Error al crear línea:', error);
    res.status(400).json({ error: error.message || 'Error al crear la línea' });
  }
});

// Actualizar una línea existente
router.put('/lineas/:id', async (req, res) => {
  try {
    const lineaActualizada = await inventarioModels.updateLinea(req.params.id, req.body);
    res.json(lineaActualizada);
  } catch (error) {
    console.error(`Error al actualizar línea con ID ${req.params.id}:`, error);
    res.status(400).json({ error: error.message || 'Error al actualizar la línea' });
  }
});

// Eliminar una línea
router.delete('/lineas/:id', async (req, res) => {
  try {
    const resultado = await inventarioModels.deleteLinea(req.params.id);
    res.json(resultado);
  } catch (error) {
    console.error(`Error al eliminar línea con ID ${req.params.id}:`, error);
    res.status(400).json({ error: error.message || 'Error al eliminar la línea' });
  }
});

// RUTAS PARA GRUPOS

// Obtener todos los grupos
router.get('/grupos', async (req, res) => {
  try {
    const grupos = await inventarioModels.getGrupos();
    res.json(grupos);
  } catch (error) {
    console.error('Error al obtener grupos:', error);
    res.status(500).json({ error: error.message || 'Error al obtener grupos' });
  }
});

// Crear un nuevo grupo
router.post('/grupos', async (req, res) => {
  try {
    const nuevoGrupo = await inventarioModels.createGrupo(req.body);
    res.status(201).json(nuevoGrupo);
  } catch (error) {
    console.error('Error al crear grupo:', error);
    res.status(400).json({ error: error.message || 'Error al crear el grupo' });
  }
});

// Actualizar un grupo existente
router.put('/grupos/:id', async (req, res) => {
  try {
    const grupoActualizado = await inventarioModels.updateGrupo(req.params.id, req.body);
    res.json(grupoActualizado);
  } catch (error) {
    console.error(`Error al actualizar grupo con ID ${req.params.id}:`, error);
    res.status(400).json({ error: error.message || 'Error al actualizar el grupo' });
  }
});

// Eliminar un grupo
router.delete('/grupos/:id', async (req, res) => {
  try {
    const resultado = await inventarioModels.deleteGrupo(req.params.id);
    res.json(resultado);
  } catch (error) {
    console.error(`Error al eliminar grupo con ID ${req.params.id}:`, error);
    res.status(400).json({ error: error.message || 'Error al eliminar el grupo' });
  }
});

// RUTAS PARA MARCAS

// Obtener todas las marcas
router.get('/marcas', async (req, res) => {
  try {
    const marcas = await inventarioModels.getMarcas();
    res.json(marcas);
  } catch (error) {
    console.error('Error al obtener marcas:', error);
    res.status(500).json({ error: error.message || 'Error al obtener marcas' });
  }
});

// Crear una nueva marca
router.post('/marcas', async (req, res) => {
  try {
    const nuevaMarca = await inventarioModels.createMarca(req.body);
    res.status(201).json(nuevaMarca);
  } catch (error) {
    console.error('Error al crear marca:', error);
    res.status(400).json({ error: error.message || 'Error al crear la marca' });
  }
});

// Actualizar una marca existente
router.put('/marcas/:id', async (req, res) => {
  try {
    const marcaActualizada = await inventarioModels.updateMarca(req.params.id, req.body);
    res.json(marcaActualizada);
  } catch (error) {
    console.error(`Error al actualizar marca con ID ${req.params.id}:`, error);
    res.status(400).json({ error: error.message || 'Error al actualizar la marca' });
  }
});

// Eliminar una marca
router.delete('/marcas/:id', async (req, res) => {
  try {
    const resultado = await inventarioModels.deleteMarca(req.params.id);
    res.json(resultado);
  } catch (error) {
    console.error(`Error al eliminar marca con ID ${req.params.id}:`, error);
    res.status(400).json({ error: error.message || 'Error al eliminar la marca' });
  }
});

// RUTAS PARA BODEGAS

// Obtener todas las bodegas
router.get('/bodegas', async (req, res) => {
  try {
    const bodegas = await inventarioModels.getBodegas();
    res.json(bodegas);
  } catch (error) {
    console.error('Error al obtener bodegas:', error);
    res.status(500).json({ error: error.message || 'Error al obtener bodegas' });
  }
});

// Obtener una bodega por ID
router.get('/bodegas/:id', async (req, res) => {
  try {
    const bodega = await inventarioModels.getBodegaById(req.params.id);
    
    if (!bodega) {
      return res.status(404).json({ error: 'Bodega no encontrada' });
    }
    
    res.json(bodega);
  } catch (error) {
    console.error(`Error al obtener bodega con ID ${req.params.id}:`, error);
    res.status(500).json({ error: error.message || 'Error al obtener la bodega' });
  }
});

// Crear una nueva bodega
router.post('/bodegas', async (req, res) => {
  try {
    const nuevaBodega = await inventarioModels.createBodega(req.body);
    res.status(201).json(nuevaBodega);
  } catch (error) {
    console.error('Error al crear bodega:', error);
    res.status(400).json({ error: error.message || 'Error al crear la bodega' });
  }
});

// Actualizar una bodega existente
router.put('/bodegas/:id', async (req, res) => {
  try {
    const bodegaActualizada = await inventarioModels.updateBodega(req.params.id, req.body);
    res.json(bodegaActualizada);
  } catch (error) {
    console.error(`Error al actualizar bodega con ID ${req.params.id}:`, error);
    res.status(400).json({ error: error.message || 'Error al actualizar la bodega' });
  }
});

// Eliminar una bodega
router.delete('/bodegas/:id', async (req, res) => {
  try {
    const resultado = await inventarioModels.deleteBodega(req.params.id);
    res.json(resultado);
  } catch (error) {
    console.error(`Error al eliminar bodega con ID ${req.params.id}:`, error);
    res.status(400).json({ error: error.message || 'Error al eliminar la bodega' });
  }
});

// RUTAS PARA TRASLADOS

// Obtener todos los traslados
router.get('/traslados', async (req, res) => {
  try {
    const traslados = await inventarioModels.getTraslados();
    res.json(traslados);
  } catch (error) {
    console.error('Error al obtener traslados:', error);
    res.status(500).json({ error: error.message || 'Error al obtener traslados' });
  }
});

// Obtener un traslado por ID
router.get('/traslados/:id', async (req, res) => {
  try {
    const traslado = await inventarioModels.getTrasladoById(req.params.id);
    
    if (!traslado) {
      return res.status(404).json({ error: 'Traslado no encontrado' });
    }
    
    res.json(traslado);
  } catch (error) {
    console.error(`Error al obtener traslado con ID ${req.params.id}:`, error);
    res.status(500).json({ error: error.message || 'Error al obtener el traslado' });
  }
});

// Crear un nuevo traslado
router.post('/traslados', async (req, res) => {
  try {
    const nuevoTraslado = await inventarioModels.createTraslado(req.body);
    res.status(201).json(nuevoTraslado);
  } catch (error) {
    console.error('Error al crear traslado:', error);
    res.status(400).json({ error: error.message || 'Error al crear el traslado' });
  }
});

// Eliminar un traslado (solo se permite eliminar traslados recientes)
router.delete('/traslados/:id', async (req, res) => {
  try {
    const resultado = await inventarioModels.deleteTraslado(req.params.id);
    res.json(resultado);
  } catch (error) {
    console.error(`Error al eliminar traslado con ID ${req.params.id}:`, error);
    res.status(400).json({ error: error.message || 'Error al eliminar el traslado' });
  }
});

// RUTAS PARA REPORTES

// Obtener reporte general de inventario
router.get('/reportes/inventario', async (req, res) => {
  try {
    const reporte = await inventarioModels.getReporteInventario(req.query);
    res.json(reporte);
  } catch (error) {
    console.error('Error al obtener reporte de inventario:', error);
    res.status(500).json({ error: error.message || 'Error al obtener reporte de inventario' });
  }
});

// Obtener estadísticas de inventario
router.get('/reportes/estadisticas', async (req, res) => {
  try {
    const estadisticas = await inventarioModels.getEstadisticasInventario();
    res.json(estadisticas);
  } catch (error) {
    console.error('Error al obtener estadísticas de inventario:', error);
    res.status(500).json({ error: error.message || 'Error al obtener estadísticas de inventario' });
  }
});

// Obtener valorización del inventario
router.get('/reportes/valorizacion', async (req, res) => {
  try {
    const valorizacion = await inventarioModels.getValorizacionInventario(req.query);
    res.json(valorizacion);
  } catch (error) {
    console.error('Error al obtener valorización del inventario:', error);
    res.status(500).json({ error: error.message || 'Error al obtener valorización del inventario' });
  }
});

module.exports = router;
