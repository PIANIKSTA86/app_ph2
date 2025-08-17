const { sequelize, Sequelize } = require('../../core/db');
const { DataTypes, QueryTypes } = Sequelize;

// Modelos para gestión de inventarios
const inventarioModels = {
  // Inicialización de tablas
  inicializarTablas: async () => {
    try {
      // Crear tabla de categorías si no existe
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS categorias (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL UNIQUE,
          descripcion TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Crear tabla de líneas si no existe
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS lineas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL UNIQUE,
          descripcion TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Crear tabla de grupos si no existe
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS grupos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL UNIQUE,
          descripcion TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Crear tabla de marcas si no existe
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS marcas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL UNIQUE,
          descripcion TEXT,
          fabricante TEXT,
          website TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Crear tabla de bodegas si no existe
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS bodegas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL UNIQUE,
          ubicacion TEXT,
          responsable TEXT,
          descripcion TEXT,
          activa INTEGER DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Crear tabla de productos si no existe
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS productos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          codigo TEXT NOT NULL UNIQUE,
          codigo_barras TEXT UNIQUE,
          nombre TEXT NOT NULL,
          descripcion TEXT,
          precio_compra NUMERIC(15,2) NOT NULL DEFAULT 0,
          precio_venta NUMERIC(15,2) NOT NULL DEFAULT 0,
          stock_minimo INTEGER NOT NULL DEFAULT 5,
          unidad_medida TEXT NOT NULL DEFAULT 'unidad',
          peso NUMERIC(10,2),
          dimensiones TEXT,
          impuesto NUMERIC(5,2) NOT NULL DEFAULT 19,
          activo INTEGER NOT NULL DEFAULT 1,
          categoria_id INTEGER,
          linea_id INTEGER,
          grupo_id INTEGER,
          marca_id INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (categoria_id) REFERENCES categorias(id),
          FOREIGN KEY (linea_id) REFERENCES lineas(id),
          FOREIGN KEY (grupo_id) REFERENCES grupos(id),
          FOREIGN KEY (marca_id) REFERENCES marcas(id)
        )
      `);
      
      // Crear tabla de stock si no existe
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS stock (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          producto_id INTEGER NOT NULL,
          bodega_id INTEGER NOT NULL,
          cantidad INTEGER NOT NULL DEFAULT 0,
          ubicacion_bodega TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(producto_id, bodega_id),
          FOREIGN KEY (producto_id) REFERENCES productos(id),
          FOREIGN KEY (bodega_id) REFERENCES bodegas(id)
        )
      `);
      
      // Crear tabla de traslados si no existe
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS traslados (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          bodega_origen_id INTEGER NOT NULL,
          bodega_destino_id INTEGER NOT NULL,
          fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          observacion TEXT,
          usuario TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (bodega_origen_id) REFERENCES bodegas(id),
          FOREIGN KEY (bodega_destino_id) REFERENCES bodegas(id)
        )
      `);
      
      // Crear tabla de detalles de traslado si no existe
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS traslado_detalles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          traslado_id INTEGER NOT NULL,
          producto_id INTEGER NOT NULL,
          cantidad INTEGER NOT NULL,
          observacion TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (traslado_id) REFERENCES traslados(id),
          FOREIGN KEY (producto_id) REFERENCES productos(id)
        )
      `);
      
      // Crear tabla de historial de movimientos si no existe
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS movimientos_historial (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          producto_id INTEGER NOT NULL,
          bodega_id INTEGER NOT NULL,
          tipo_movimiento TEXT NOT NULL,
          cantidad INTEGER NOT NULL,
          fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          documento_referencia TEXT,
          usuario TEXT,
          observacion TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (producto_id) REFERENCES productos(id),
          FOREIGN KEY (bodega_id) REFERENCES bodegas(id)
        )
      `);
      
      console.log('Tablas de inventario creadas correctamente');
      return { success: true, message: 'Tablas creadas correctamente' };
    } catch (error) {
      console.error('Error al crear tablas de inventario:', error);
      throw error;
    }
  },
  // PRODUCTOS
  
  // Obtener todos los productos con filtrado y paginación
  getProductos: async (params = {}) => {
    try {
      const {
        searchTerm = '',
        page = 0,
        rowsPerPage = 10,
        sortField = 'nombre',
        sortDirection = 'asc',
        categoriaId,
        lineaId,
        grupoId,
        marcaId,
        bodegaId,
        soloActivos
      } = params;
      
      // Construir consulta base
      let query = `
        SELECT p.*, 
               c.nombre as categoria_nombre, 
               b.nombre as bodega_nombre
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN bodegas b ON p.bodega_id = b.id
        WHERE 1=1
      `;
      
      // Agregar condiciones de filtrado
      const queryParams = [];
      
      if (searchTerm) {
        query += ` AND (p.codigo LIKE ? OR p.nombre LIKE ?)`;
        const searchParam = `%${searchTerm}%`;
        queryParams.push(searchParam, searchParam);
      }
      
      if (categoriaId) {
        query += ` AND p.categoria_id = ?`;
        queryParams.push(categoriaId);
      }
      
      if (lineaId) {
        query += ` AND p.linea_id = ?`;
        queryParams.push(lineaId);
      }
      
      if (grupoId) {
        query += ` AND p.grupo_id = ?`;
        queryParams.push(grupoId);
      }
      
      if (marcaId) {
        query += ` AND p.marca_id = ?`;
        queryParams.push(marcaId);
      }
      
      if (bodegaId) {
        query += ` AND p.bodega_id = ?`;
        queryParams.push(bodegaId);
      }
      
      if (soloActivos) {
        query += ` AND p.activo = 1`;
      }
      
      // Consulta para contar total de registros
      const countQuery = `SELECT COUNT(*) as total FROM (${query}) as subquery`;
      const countResult = await db.query(countQuery, queryParams);
      const total = countResult[0].total;
      
      // Agregar ordenamiento y paginación
      query += ` ORDER BY ${sortField} ${sortDirection}`;
      query += ` LIMIT ? OFFSET ?`;
      queryParams.push(Number(rowsPerPage), Number(page) * Number(rowsPerPage));
      
      const productos = await db.query(query, queryParams);
      
      // Devolver resultados y total
      return {
        productos,
        total
      };
    } catch (error) {
      console.error('Error en getProductos:', error);
      throw error;
    }
  },

  // Obtener un producto por ID
  getProductoById: async (id) => {
    try {
      const query = `
        SELECT p.*, 
               c.nombre as categoria_nombre, 
               l.nombre as linea_nombre,
               g.nombre as grupo_nombre,
               m.nombre as marca_nombre,
               b.nombre as bodega_nombre
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN lineas l ON p.linea_id = l.id
        LEFT JOIN grupos g ON p.grupo_id = g.id
        LEFT JOIN marcas m ON p.marca_id = m.id
        LEFT JOIN bodegas b ON p.bodega_id = b.id
        WHERE p.id = ?
      `;
      
      const productos = await db.query(query, [id]);
      
      if (productos.length === 0) {
        return null;
      }
      
      return productos[0];
    } catch (error) {
      console.error(`Error en getProductoById: ${error}`);
      throw error;
    }
  },

  // Crear un nuevo producto
  createProducto: async (productoData) => {
    try {
      const {
        codigo,
        nombre,
        descripcion,
        precio_compra,
        precio_venta,
        cantidad_disponible,
        cantidad_minima,
        categoria_id,
        linea_id,
        grupo_id,
        marca_id,
        bodega_id,
        activo = true
      } = productoData;
      
      // Validar que el código no exista
      const codigoExistente = await db.query('SELECT id FROM productos WHERE codigo = ?', [codigo]);
      if (codigoExistente.length > 0) {
        throw new Error('Ya existe un producto con ese código');
      }
      
      // Insertar producto
      const query = `
        INSERT INTO productos (
          codigo, nombre, descripcion, precio_compra, precio_venta, 
          cantidad_disponible, cantidad_minima, categoria_id, linea_id, 
          grupo_id, marca_id, bodega_id, activo, fecha_creacion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      
      const result = await db.query(query, [
        codigo, nombre, descripcion, precio_compra, precio_venta,
        cantidad_disponible, cantidad_minima, categoria_id, linea_id,
        grupo_id, marca_id, bodega_id, activo ? 1 : 0
      ]);
      
      // Registrar movimiento de inventario inicial
      if (cantidad_disponible > 0) {
        await inventarioModels.registrarMovimiento({
          producto_id: result.insertId,
          tipo: 'ENTRADA',
          cantidad: cantidad_disponible,
          motivo: 'INICIAL',
          bodega_id
        });
      }
      
      return { id: result.insertId, ...productoData };
    } catch (error) {
      console.error('Error en createProducto:', error);
      throw error;
    }
  },

  // Actualizar un producto existente
  updateProducto: async (id, productoData) => {
    try {
      const {
        codigo,
        nombre,
        descripcion,
        precio_compra,
        precio_venta,
        cantidad_disponible,
        cantidad_minima,
        categoria_id,
        linea_id,
        grupo_id,
        marca_id,
        bodega_id,
        activo
      } = productoData;
      
      // Validar que el código no exista en otro producto
      const codigoExistente = await db.query('SELECT id FROM productos WHERE codigo = ? AND id != ?', [codigo, id]);
      if (codigoExistente.length > 0) {
        throw new Error('Ya existe otro producto con ese código');
      }
      
      // Obtener producto actual para comparar cantidades
      const productoActual = await inventarioModels.getProductoById(id);
      if (!productoActual) {
        throw new Error('El producto no existe');
      }
      
      // Actualizar producto
      const query = `
        UPDATE productos SET
          codigo = ?,
          nombre = ?,
          descripcion = ?,
          precio_compra = ?,
          precio_venta = ?,
          cantidad_disponible = ?,
          cantidad_minima = ?,
          categoria_id = ?,
          linea_id = ?,
          grupo_id = ?,
          marca_id = ?,
          bodega_id = ?,
          activo = ?,
          fecha_actualizacion = NOW()
        WHERE id = ?
      `;
      
      await db.query(query, [
        codigo, nombre, descripcion, precio_compra, precio_venta,
        cantidad_disponible, cantidad_minima, categoria_id, linea_id,
        grupo_id, marca_id, bodega_id, activo ? 1 : 0, id
      ]);
      
      // Registrar movimiento si cambió la cantidad disponible
      if (cantidad_disponible !== productoActual.cantidad_disponible) {
        const diferencia = cantidad_disponible - productoActual.cantidad_disponible;
        const tipo = diferencia > 0 ? 'ENTRADA' : 'SALIDA';
        
        await inventarioModels.registrarMovimiento({
          producto_id: id,
          tipo,
          cantidad: Math.abs(diferencia),
          motivo: 'AJUSTE',
          bodega_id
        });
      }
      
      return { id, ...productoData };
    } catch (error) {
      console.error(`Error en updateProducto: ${error}`);
      throw error;
    }
  },

  // Eliminar un producto
  deleteProducto: async (id) => {
    try {
      // Verificar si tiene movimientos
      const movimientos = await db.query('SELECT id FROM movimientos_inventario WHERE producto_id = ? LIMIT 1', [id]);
      
      if (movimientos.length > 0) {
        // Si tiene movimientos, solo marcarlo como inactivo
        await db.query('UPDATE productos SET activo = 0, fecha_actualizacion = NOW() WHERE id = ?', [id]);
        return { id, deleted: false, message: 'El producto tiene movimientos. Se ha marcado como inactivo.' };
      } else {
        // Si no tiene movimientos, eliminarlo
        await db.query('DELETE FROM productos WHERE id = ?', [id]);
        return { id, deleted: true };
      }
    } catch (error) {
      console.error(`Error en deleteProducto: ${error}`);
      throw error;
    }
  },

  // Obtener productos con stock bajo
  getProductosBajoStock: async () => {
    try {
      const query = `
        SELECT p.*, 
               c.nombre as categoria_nombre, 
               b.nombre as bodega_nombre
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN bodegas b ON p.bodega_id = b.id
        WHERE p.cantidad_disponible <= p.cantidad_minima 
          AND p.activo = 1
        ORDER BY (p.cantidad_disponible = 0) DESC, 
                 (p.cantidad_disponible / p.cantidad_minima) ASC
      `;
      
      return await db.query(query);
    } catch (error) {
      console.error('Error en getProductosBajoStock:', error);
      throw error;
    }
  },

  // CATEGORÍAS
  
  // Obtener todas las categorías
  getCategorias: async () => {
    try {
      return await db.query('SELECT * FROM categorias ORDER BY nombre');
    } catch (error) {
      console.error('Error en getCategorias:', error);
      throw error;
    }
  },

  // Obtener una categoría por ID
  getCategoriaById: async (id) => {
    try {
      const categorias = await db.query('SELECT * FROM categorias WHERE id = ?', [id]);
      return categorias.length > 0 ? categorias[0] : null;
    } catch (error) {
      console.error(`Error en getCategoriaById: ${error}`);
      throw error;
    }
  },

  // Crear una nueva categoría
  createCategoria: async (categoriaData) => {
    try {
      const { nombre, descripcion, activo = true } = categoriaData;
      
      const result = await db.query(
        'INSERT INTO categorias (nombre, descripcion, activo, fecha_creacion) VALUES (?, ?, ?, NOW())',
        [nombre, descripcion, activo ? 1 : 0]
      );
      
      return { id: result.insertId, ...categoriaData };
    } catch (error) {
      console.error('Error en createCategoria:', error);
      throw error;
    }
  },

  // Actualizar una categoría existente
  updateCategoria: async (id, categoriaData) => {
    try {
      const { nombre, descripcion, activo } = categoriaData;
      
      await db.query(
        'UPDATE categorias SET nombre = ?, descripcion = ?, activo = ?, fecha_actualizacion = NOW() WHERE id = ?',
        [nombre, descripcion, activo ? 1 : 0, id]
      );
      
      return { id, ...categoriaData };
    } catch (error) {
      console.error(`Error en updateCategoria: ${error}`);
      throw error;
    }
  },

  // Eliminar una categoría
  deleteCategoria: async (id) => {
    try {
      // Verificar si hay productos asociados
      const productos = await db.query('SELECT id FROM productos WHERE categoria_id = ? LIMIT 1', [id]);
      
      if (productos.length > 0) {
        throw new Error('No se puede eliminar la categoría porque tiene productos asociados');
      }
      
      await db.query('DELETE FROM categorias WHERE id = ?', [id]);
      return { id, deleted: true };
    } catch (error) {
      console.error(`Error en deleteCategoria: ${error}`);
      throw error;
    }
  },

  // LÍNEAS
  
  // Obtener todas las líneas
  getLineas: async () => {
    try {
      return await db.query('SELECT * FROM lineas ORDER BY nombre');
    } catch (error) {
      console.error('Error en getLineas:', error);
      throw error;
    }
  },

  // Crear una nueva línea
  createLinea: async (lineaData) => {
    try {
      const { nombre, descripcion, activo = true } = lineaData;
      
      const result = await db.query(
        'INSERT INTO lineas (nombre, descripcion, activo, fecha_creacion) VALUES (?, ?, ?, NOW())',
        [nombre, descripcion, activo ? 1 : 0]
      );
      
      return { id: result.insertId, ...lineaData };
    } catch (error) {
      console.error('Error en createLinea:', error);
      throw error;
    }
  },

  // Actualizar una línea existente
  updateLinea: async (id, lineaData) => {
    try {
      const { nombre, descripcion, activo } = lineaData;
      
      await db.query(
        'UPDATE lineas SET nombre = ?, descripcion = ?, activo = ?, fecha_actualizacion = NOW() WHERE id = ?',
        [nombre, descripcion, activo ? 1 : 0, id]
      );
      
      return { id, ...lineaData };
    } catch (error) {
      console.error(`Error en updateLinea: ${error}`);
      throw error;
    }
  },

  // Eliminar una línea
  deleteLinea: async (id) => {
    try {
      // Verificar si hay productos asociados
      const productos = await db.query('SELECT id FROM productos WHERE linea_id = ? LIMIT 1', [id]);
      
      if (productos.length > 0) {
        throw new Error('No se puede eliminar la línea porque tiene productos asociados');
      }
      
      await db.query('DELETE FROM lineas WHERE id = ?', [id]);
      return { id, deleted: true };
    } catch (error) {
      console.error(`Error en deleteLinea: ${error}`);
      throw error;
    }
  },

  // GRUPOS
  
  // Obtener todos los grupos
  getGrupos: async () => {
    try {
      return await db.query('SELECT * FROM grupos ORDER BY nombre');
    } catch (error) {
      console.error('Error en getGrupos:', error);
      throw error;
    }
  },

  // Crear un nuevo grupo
  createGrupo: async (grupoData) => {
    try {
      const { nombre, descripcion, activo = true } = grupoData;
      
      const result = await db.query(
        'INSERT INTO grupos (nombre, descripcion, activo, fecha_creacion) VALUES (?, ?, ?, NOW())',
        [nombre, descripcion, activo ? 1 : 0]
      );
      
      return { id: result.insertId, ...grupoData };
    } catch (error) {
      console.error('Error en createGrupo:', error);
      throw error;
    }
  },

  // Actualizar un grupo existente
  updateGrupo: async (id, grupoData) => {
    try {
      const { nombre, descripcion, activo } = grupoData;
      
      await db.query(
        'UPDATE grupos SET nombre = ?, descripcion = ?, activo = ?, fecha_actualizacion = NOW() WHERE id = ?',
        [nombre, descripcion, activo ? 1 : 0, id]
      );
      
      return { id, ...grupoData };
    } catch (error) {
      console.error(`Error en updateGrupo: ${error}`);
      throw error;
    }
  },

  // Eliminar un grupo
  deleteGrupo: async (id) => {
    try {
      // Verificar si hay productos asociados
      const productos = await db.query('SELECT id FROM productos WHERE grupo_id = ? LIMIT 1', [id]);
      
      if (productos.length > 0) {
        throw new Error('No se puede eliminar el grupo porque tiene productos asociados');
      }
      
      await db.query('DELETE FROM grupos WHERE id = ?', [id]);
      return { id, deleted: true };
    } catch (error) {
      console.error(`Error en deleteGrupo: ${error}`);
      throw error;
    }
  },

  // MARCAS
  
  // Obtener todas las marcas
  getMarcas: async () => {
    try {
      return await db.query('SELECT * FROM marcas ORDER BY nombre');
    } catch (error) {
      console.error('Error en getMarcas:', error);
      throw error;
    }
  },

  // Crear una nueva marca
  createMarca: async (marcaData) => {
    try {
      const { nombre, descripcion, activo = true } = marcaData;
      
      const result = await db.query(
        'INSERT INTO marcas (nombre, descripcion, activo, fecha_creacion) VALUES (?, ?, ?, NOW())',
        [nombre, descripcion || null, activo ? 1 : 0]
      );
      
      return { id: result.insertId, ...marcaData };
    } catch (error) {
      console.error('Error en createMarca:', error);
      throw error;
    }
  },

  // Actualizar una marca existente
  updateMarca: async (id, marcaData) => {
    try {
      const { nombre, descripcion, activo } = marcaData;
      
      await db.query(
        'UPDATE marcas SET nombre = ?, descripcion = ?, activo = ?, fecha_actualizacion = NOW() WHERE id = ?',
        [nombre, descripcion || null, activo ? 1 : 0, id]
      );
      
      return { id, ...marcaData };
    } catch (error) {
      console.error(`Error en updateMarca: ${error}`);
      throw error;
    }
  },

  // Eliminar una marca
  deleteMarca: async (id) => {
    try {
      // Verificar si hay productos asociados
      const productos = await db.query('SELECT id FROM productos WHERE marca_id = ? LIMIT 1', [id]);
      
      if (productos.length > 0) {
        throw new Error('No se puede eliminar la marca porque tiene productos asociados');
      }
      
      await db.query('DELETE FROM marcas WHERE id = ?', [id]);
      return { id, deleted: true };
    } catch (error) {
      console.error(`Error en deleteMarca: ${error}`);
      throw error;
    }
  },

  // BODEGAS
  
  // Obtener todas las bodegas
  getBodegas: async () => {
    try {
      return await db.query('SELECT * FROM bodegas ORDER BY nombre');
    } catch (error) {
      console.error('Error en getBodegas:', error);
      throw error;
    }
  },

  // Obtener una bodega por ID
  getBodegaById: async (id) => {
    try {
      const bodegas = await db.query('SELECT * FROM bodegas WHERE id = ?', [id]);
      return bodegas.length > 0 ? bodegas[0] : null;
    } catch (error) {
      console.error(`Error en getBodegaById: ${error}`);
      throw error;
    }
  },

  // Crear una nueva bodega
  createBodega: async (bodegaData) => {
    try {
      const { nombre, descripcion, activo = true } = bodegaData;
      
      const result = await db.query(
        'INSERT INTO bodegas (nombre, descripcion, activo, fecha_creacion) VALUES (?, ?, ?, NOW())',
        [nombre, descripcion, activo ? 1 : 0]
      );
      
      return { id: result.insertId, ...bodegaData };
    } catch (error) {
      console.error('Error en createBodega:', error);
      throw error;
    }
  },

  // Actualizar una bodega existente
  updateBodega: async (id, bodegaData) => {
    try {
      const { nombre, descripcion, activo } = bodegaData;
      
      await db.query(
        'UPDATE bodegas SET nombre = ?, descripcion = ?, activo = ?, fecha_actualizacion = NOW() WHERE id = ?',
        [nombre, descripcion, activo ? 1 : 0, id]
      );
      
      return { id, ...bodegaData };
    } catch (error) {
      console.error(`Error en updateBodega: ${error}`);
      throw error;
    }
  },

  // Eliminar una bodega
  deleteBodega: async (id) => {
    try {
      // Verificar si hay productos asociados
      const productos = await db.query('SELECT id FROM productos WHERE bodega_id = ? LIMIT 1', [id]);
      
      if (productos.length > 0) {
        throw new Error('No se puede eliminar la bodega porque tiene productos asociados');
      }
      
      await db.query('DELETE FROM bodegas WHERE id = ?', [id]);
      return { id, deleted: true };
    } catch (error) {
      console.error(`Error en deleteBodega: ${error}`);
      throw error;
    }
  },

  // TRASLADOS ENTRE BODEGAS
  
  // Obtener todos los traslados
  getTraslados: async () => {
    try {
      const query = `
        SELECT t.*,
               p.codigo as producto_codigo, 
               p.nombre as producto_nombre,
               bo.nombre as bodega_origen_nombre,
               bd.nombre as bodega_destino_nombre
        FROM traslados t
        LEFT JOIN productos p ON t.producto_id = p.id
        LEFT JOIN bodegas bo ON t.bodega_origen_id = bo.id
        LEFT JOIN bodegas bd ON t.bodega_destino_id = bd.id
        ORDER BY t.fecha DESC
      `;
      
      return await db.query(query);
    } catch (error) {
      console.error('Error en getTraslados:', error);
      throw error;
    }
  },

  // Obtener un traslado por ID
  getTrasladoById: async (id) => {
    try {
      const query = `
        SELECT t.*,
               p.codigo as producto_codigo, 
               p.nombre as producto_nombre,
               bo.nombre as bodega_origen_nombre,
               bd.nombre as bodega_destino_nombre
        FROM traslados t
        LEFT JOIN productos p ON t.producto_id = p.id
        LEFT JOIN bodegas bo ON t.bodega_origen_id = bo.id
        LEFT JOIN bodegas bd ON t.bodega_destino_id = bd.id
        WHERE t.id = ?
      `;
      
      const traslados = await db.query(query, [id]);
      return traslados.length > 0 ? traslados[0] : null;
    } catch (error) {
      console.error(`Error en getTrasladoById: ${error}`);
      throw error;
    }
  },

  // Crear un nuevo traslado
  createTraslado: async (trasladoData) => {
    try {
      const {
        producto_id,
        bodega_origen_id,
        bodega_destino_id,
        cantidad,
        notas,
        fecha = new Date()
      } = trasladoData;
      
      // Validar bodegas diferentes
      if (bodega_origen_id === bodega_destino_id) {
        throw new Error('La bodega de origen y destino no pueden ser iguales');
      }
      
      // Validar cantidad disponible
      const producto = await db.query('SELECT * FROM productos WHERE id = ? AND bodega_id = ?', [producto_id, bodega_origen_id]);
      
      if (producto.length === 0) {
        throw new Error('El producto no existe en la bodega de origen');
      }
      
      if (producto[0].cantidad_disponible < cantidad) {
        throw new Error('No hay suficiente cantidad disponible para el traslado');
      }
      
      // Iniciar transacción
      await db.beginTransaction();
      
      try {
        // Insertar traslado
        const insertResult = await db.query(
          'INSERT INTO traslados (producto_id, bodega_origen_id, bodega_destino_id, cantidad, notas, fecha) VALUES (?, ?, ?, ?, ?, ?)',
          [producto_id, bodega_origen_id, bodega_destino_id, cantidad, notas, fecha]
        );
        
        const trasladoId = insertResult.insertId;
        
        // Verificar si el producto existe en la bodega destino
        const productoEnDestino = await db.query(
          'SELECT * FROM productos WHERE codigo = ? AND bodega_id = ?',
          [producto[0].codigo, bodega_destino_id]
        );
        
        if (productoEnDestino.length > 0) {
          // Actualizar cantidad en producto existente en bodega destino
          await db.query(
            'UPDATE productos SET cantidad_disponible = cantidad_disponible + ? WHERE id = ?',
            [cantidad, productoEnDestino[0].id]
          );
          
          // Registrar movimiento en bodega destino
          await inventarioModels.registrarMovimiento({
            producto_id: productoEnDestino[0].id,
            tipo: 'ENTRADA',
            cantidad,
            motivo: 'TRASLADO',
            bodega_id: bodega_destino_id,
            referencia_id: trasladoId,
            referencia_tipo: 'TRASLADO'
          });
        } else {
          // Crear nuevo producto en bodega destino
          const nuevoProductoData = {
            ...producto[0],
            bodega_id: bodega_destino_id,
            cantidad_disponible: cantidad
          };
          
          delete nuevoProductoData.id;
          
          const columnas = Object.keys(nuevoProductoData).join(', ');
          const placeholders = Object.keys(nuevoProductoData).map(() => '?').join(', ');
          
          const insertProductoResult = await db.query(
            `INSERT INTO productos (${columnas}) VALUES (${placeholders})`,
            Object.values(nuevoProductoData)
          );
          
          // Registrar movimiento en nueva bodega
          await inventarioModels.registrarMovimiento({
            producto_id: insertProductoResult.insertId,
            tipo: 'ENTRADA',
            cantidad,
            motivo: 'TRASLADO',
            bodega_id: bodega_destino_id,
            referencia_id: trasladoId,
            referencia_tipo: 'TRASLADO'
          });
        }
        
        // Actualizar cantidad en bodega origen
        await db.query(
          'UPDATE productos SET cantidad_disponible = cantidad_disponible - ? WHERE id = ?',
          [cantidad, producto_id]
        );
        
        // Registrar movimiento en bodega origen
        await inventarioModels.registrarMovimiento({
          producto_id,
          tipo: 'SALIDA',
          cantidad,
          motivo: 'TRASLADO',
          bodega_id: bodega_origen_id,
          referencia_id: trasladoId,
          referencia_tipo: 'TRASLADO'
        });
        
        await db.commit();
        
        return {
          id: trasladoId,
          ...trasladoData
        };
      } catch (error) {
        await db.rollback();
        throw error;
      }
    } catch (error) {
      console.error('Error en createTraslado:', error);
      throw error;
    }
  },

  // Eliminar un traslado (solo se permite eliminar traslados recientes)
  deleteTraslado: async (id) => {
    try {
      // Obtener el traslado
      const traslado = await inventarioModels.getTrasladoById(id);
      
      if (!traslado) {
        throw new Error('El traslado no existe');
      }
      
      // Verificar antigüedad (solo permitir eliminar traslados recientes, menos de 24 horas)
      const trasladoDate = new Date(traslado.fecha);
      const now = new Date();
      const hoursAgo = (now - trasladoDate) / (1000 * 60 * 60);
      
      if (hoursAgo > 24) {
        throw new Error('No se pueden eliminar traslados con más de 24 horas de antigüedad');
      }
      
      // Iniciar transacción
      await db.beginTransaction();
      
      try {
        // Buscar producto en bodega origen
        const productoOrigen = await db.query(
          'SELECT * FROM productos WHERE id = ? AND bodega_id = ?',
          [traslado.producto_id, traslado.bodega_origen_id]
        );
        
        // Buscar producto en bodega destino por código
        const codigoProducto = await db.query(
          'SELECT codigo FROM productos WHERE id = ?',
          [traslado.producto_id]
        );
        
        const productoDestino = await db.query(
          'SELECT * FROM productos WHERE codigo = ? AND bodega_id = ?',
          [codigoProducto[0].codigo, traslado.bodega_destino_id]
        );
        
        if (productoDestino.length === 0) {
          throw new Error('El producto no existe en la bodega destino');
        }
        
        if (productoDestino[0].cantidad_disponible < traslado.cantidad) {
          throw new Error('No hay suficiente cantidad disponible en bodega destino para revertir el traslado');
        }
        
        // Actualizar cantidad en bodega origen (sumar)
        if (productoOrigen.length > 0) {
          await db.query(
            'UPDATE productos SET cantidad_disponible = cantidad_disponible + ? WHERE id = ?',
            [traslado.cantidad, productoOrigen[0].id]
          );
          
          // Registrar movimiento en bodega origen
          await inventarioModels.registrarMovimiento({
            producto_id: productoOrigen[0].id,
            tipo: 'ENTRADA',
            cantidad: traslado.cantidad,
            motivo: 'REVERSO_TRASLADO',
            bodega_id: traslado.bodega_origen_id,
            referencia_id: traslado.id,
            referencia_tipo: 'TRASLADO'
          });
        } else {
          // Si el producto ya no existe en bodega origen, crearlo nuevamente
          const nuevoProductoData = {
            ...productoDestino[0],
            bodega_id: traslado.bodega_origen_id,
            cantidad_disponible: traslado.cantidad
          };
          
          delete nuevoProductoData.id;
          
          const columnas = Object.keys(nuevoProductoData).join(', ');
          const placeholders = Object.keys(nuevoProductoData).map(() => '?').join(', ');
          
          const insertProductoResult = await db.query(
            `INSERT INTO productos (${columnas}) VALUES (${placeholders})`,
            Object.values(nuevoProductoData)
          );
          
          // Registrar movimiento en bodega origen
          await inventarioModels.registrarMovimiento({
            producto_id: insertProductoResult.insertId,
            tipo: 'ENTRADA',
            cantidad: traslado.cantidad,
            motivo: 'REVERSO_TRASLADO',
            bodega_id: traslado.bodega_origen_id,
            referencia_id: traslado.id,
            referencia_tipo: 'TRASLADO'
          });
        }
        
        // Actualizar cantidad en bodega destino (restar)
        await db.query(
          'UPDATE productos SET cantidad_disponible = cantidad_disponible - ? WHERE id = ?',
          [traslado.cantidad, productoDestino[0].id]
        );
        
        // Registrar movimiento en bodega destino
        await inventarioModels.registrarMovimiento({
          producto_id: productoDestino[0].id,
          tipo: 'SALIDA',
          cantidad: traslado.cantidad,
          motivo: 'REVERSO_TRASLADO',
          bodega_id: traslado.bodega_destino_id,
          referencia_id: traslado.id,
          referencia_tipo: 'TRASLADO'
        });
        
        // Si después de revertir el traslado el producto queda en 0 en la bodega destino, marcarlo como inactivo
        await db.query(
          'UPDATE productos SET activo = CASE WHEN cantidad_disponible = 0 THEN 0 ELSE activo END WHERE id = ?',
          [productoDestino[0].id]
        );
        
        // Eliminar traslado
        await db.query('DELETE FROM traslados WHERE id = ?', [id]);
        
        await db.commit();
        
        return { id, deleted: true };
      } catch (error) {
        await db.rollback();
        throw error;
      }
    } catch (error) {
      console.error(`Error en deleteTraslado: ${error}`);
      throw error;
    }
  },

  // Registrar movimiento de inventario
  registrarMovimiento: async (movimientoData) => {
    try {
      const {
        producto_id,
        tipo, // ENTRADA, SALIDA
        cantidad,
        motivo, // INICIAL, COMPRA, VENTA, AJUSTE, TRASLADO, REVERSO_TRASLADO
        bodega_id,
        referencia_id = null,
        referencia_tipo = null
      } = movimientoData;
      
      return await db.query(
        `INSERT INTO movimientos_inventario 
        (producto_id, tipo, cantidad, motivo, bodega_id, referencia_id, referencia_tipo, fecha) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [producto_id, tipo, cantidad, motivo, bodega_id, referencia_id, referencia_tipo]
      );
    } catch (error) {
      console.error('Error en registrarMovimiento:', error);
      throw error;
    }
  },

  // REPORTES
  
  // Obtener reporte general de inventario
  getReporteInventario: async (params = {}) => {
    try {
      const {
        categoriaId,
        bodegaId,
        ordenarPor = 'nombre',
        soloActivos = true
      } = params;
      
      // Consulta para obtener items del reporte
      let query = `
        SELECT p.*, 
               c.nombre as categoria_nombre, 
               b.nombre as bodega_nombre
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN bodegas b ON p.bodega_id = b.id
        WHERE 1=1
      `;
      
      // Agregar condiciones de filtrado
      const queryParams = [];
      
      if (categoriaId) {
        query += ` AND p.categoria_id = ?`;
        queryParams.push(categoriaId);
      }
      
      if (bodegaId) {
        query += ` AND p.bodega_id = ?`;
        queryParams.push(bodegaId);
      }
      
      if (soloActivos) {
        query += ` AND p.activo = 1`;
      }
      
      // Agregar ordenamiento
      query += ` ORDER BY ${ordenarPor}`;
      
      const items = await db.query(query, queryParams);
      
      // Consulta para obtener resumen por categoría
      const resumenCategoriasQuery = `
        SELECT c.id, c.nombre, 
               COUNT(p.id) as cantidad_productos,
               SUM(p.cantidad_disponible) as unidades_totales,
               SUM(p.cantidad_disponible * p.precio_compra) as valor_total
        FROM categorias c
        LEFT JOIN productos p ON c.id = p.categoria_id
        WHERE p.activo = 1
        ${categoriaId ? ' AND c.id = ?' : ''}
        ${bodegaId ? ' AND p.bodega_id = ?' : ''}
        GROUP BY c.id, c.nombre
        ORDER BY c.nombre
      `;
      
      const resumenCategoriasParams = [];
      if (categoriaId) resumenCategoriasParams.push(categoriaId);
      if (bodegaId) resumenCategoriasParams.push(bodegaId);
      
      const resumenCategorias = await db.query(resumenCategoriasQuery, resumenCategoriasParams);
      
      // Consulta para obtener resumen por bodega
      const resumenBodegasQuery = `
        SELECT b.id, b.nombre, 
               COUNT(p.id) as cantidad_productos,
               SUM(p.cantidad_disponible) as unidades_totales,
               SUM(p.cantidad_disponible * p.precio_compra) as valor_total
        FROM bodegas b
        LEFT JOIN productos p ON b.id = p.bodega_id
        WHERE p.activo = 1
        ${categoriaId ? ' AND p.categoria_id = ?' : ''}
        ${bodegaId ? ' AND b.id = ?' : ''}
        GROUP BY b.id, b.nombre
        ORDER BY b.nombre
      `;
      
      const resumenBodegasParams = [];
      if (categoriaId) resumenBodegasParams.push(categoriaId);
      if (bodegaId) resumenBodegasParams.push(bodegaId);
      
      const resumenBodegas = await db.query(resumenBodegasQuery, resumenBodegasParams);
      
      return {
        items,
        resumenCategorias,
        resumenBodegas
      };
    } catch (error) {
      console.error('Error en getReporteInventario:', error);
      throw error;
    }
  },

  // Obtener estadísticas de inventario
  getEstadisticasInventario: async () => {
    try {
      // Total de productos
      const totalProductos = await db.query('SELECT COUNT(*) as total FROM productos WHERE activo = 1');
      
      // Valor total del inventario
      const valorInventario = await db.query(`
        SELECT SUM(cantidad_disponible * precio_compra) as total 
        FROM productos 
        WHERE activo = 1
      `);
      
      // Productos con alerta (bajo stock)
      const productosConAlerta = await db.query(`
        SELECT COUNT(*) as total 
        FROM productos 
        WHERE cantidad_disponible <= cantidad_minima AND activo = 1
      `);
      
      // Distribución por categoría
      const distribucionCategorias = await db.query(`
        SELECT c.id, c.nombre, 
               COUNT(p.id) as cantidad_productos,
               SUM(p.cantidad_disponible) as unidades_totales,
               SUM(p.cantidad_disponible * p.precio_compra) as valor_total
        FROM categorias c
        LEFT JOIN productos p ON c.id = p.categoria_id AND p.activo = 1
        GROUP BY c.id, c.nombre
        ORDER BY valor_total DESC
        LIMIT 10
      `);
      
      // Distribución por bodega
      const distribucionBodegas = await db.query(`
        SELECT b.id, b.nombre, 
               COUNT(p.id) as cantidad_productos,
               SUM(p.cantidad_disponible) as unidades_totales,
               SUM(p.cantidad_disponible * p.precio_compra) as valor_total
        FROM bodegas b
        LEFT JOIN productos p ON b.id = p.bodega_id AND p.activo = 1
        GROUP BY b.id, b.nombre
        ORDER BY valor_total DESC
      `);
      
      // Top 10 productos más valiosos
      const productosValiosos = await db.query(`
        SELECT id, codigo, nombre, cantidad_disponible, precio_compra,
               (cantidad_disponible * precio_compra) as valor_total
        FROM productos
        WHERE activo = 1
        ORDER BY valor_total DESC
        LIMIT 10
      `);
      
      return {
        totalProductos: totalProductos[0].total,
        valorInventario: valorInventario[0].total || 0,
        productosConAlerta: productosConAlerta[0].total,
        distribucionCategorias,
        distribucionBodegas,
        productosValiosos
      };
    } catch (error) {
      console.error('Error en getEstadisticasInventario:', error);
      throw error;
    }
  },

  // Obtener historial de movimientos de un producto
  getHistorialProducto: async (id) => {
    try {
      // Verificar si el producto existe
      const producto = await inventarioModels.getProductoById(id);
      
      if (!producto) {
        throw new Error('El producto no existe');
      }
      
      // Obtener movimientos
      const query = `
        SELECT m.*,
               b.nombre as bodega_nombre
        FROM movimientos_inventario m
        LEFT JOIN bodegas b ON m.bodega_id = b.id
        WHERE m.producto_id = ?
        ORDER BY m.fecha DESC
      `;
      
      return await db.query(query, [id]);
    } catch (error) {
      console.error(`Error en getHistorialProducto: ${error}`);
      throw error;
    }
  },

  // Obtener valorización del inventario
  getValorizacionInventario: async (params = {}) => {
    try {
      const {
        categoriaId,
        bodegaId,
        ordenarPor = 'valor_total',
        soloActivos = true
      } = params;
      
      // Consulta para obtener valorización
      let query = `
        SELECT c.id as categoria_id, c.nombre as categoria_nombre,
               b.id as bodega_id, b.nombre as bodega_nombre,
               SUM(p.cantidad_disponible) as cantidad_total,
               SUM(p.cantidad_disponible * p.precio_compra) as valor_total,
               COUNT(p.id) as cantidad_productos
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        LEFT JOIN bodegas b ON p.bodega_id = b.id
        WHERE 1=1
      `;
      
      // Agregar condiciones de filtrado
      const queryParams = [];
      
      if (categoriaId) {
        query += ` AND p.categoria_id = ?`;
        queryParams.push(categoriaId);
      }
      
      if (bodegaId) {
        query += ` AND p.bodega_id = ?`;
        queryParams.push(bodegaId);
      }
      
      if (soloActivos) {
        query += ` AND p.activo = 1`;
      }
      
      // Agrupar y ordenar
      query += ` GROUP BY c.id, c.nombre, b.id, b.nombre`;
      query += ` ORDER BY ${ordenarPor} DESC`;
      
      return await db.query(query, queryParams);
    } catch (error) {
      console.error('Error en getValorizacionInventario:', error);
      throw error;
    }
  }
};

module.exports = inventarioModels;
