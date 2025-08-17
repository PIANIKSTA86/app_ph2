const express = require('express');
const { check, validationResult } = require('express-validator');
const { Factura, DetalleFactura, Propiedad, Propietario } = require('../../core/models');
const router = express.Router();

// Middleware para verificación de roles
const checkRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para realizar esta acción'
      });
    }
    next();
  };
};

// Obtener todas las facturas (con filtros opcionales)
router.get('/', async (req, res) => {
  try {
    const { 
      conjuntoId, propiedadId, estado, 
      fechaInicio, fechaFin, 
      page = 1, limit = 10 
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    
    if (conjuntoId) {
      whereClause['$Propiedad.conjuntoId$'] = conjuntoId;
    }
    
    if (propiedadId) {
      whereClause.propiedadId = propiedadId;
    }
    
    if (estado) {
      whereClause.estado = estado;
    }
    
    if (fechaInicio && fechaFin) {
      whereClause.fechaEmision = {
        [Sequelize.Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
      };
    }
    
    const facturas = await Factura.findAndCountAll({
      where: whereClause,
      include: [
        { 
          model: Propiedad,
          include: [{ model: Propietario }]
        }
      ],
      order: [['fechaEmision', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    return res.json({
      success: true,
      total: facturas.count,
      pages: Math.ceil(facturas.count / limit),
      currentPage: parseInt(page),
      facturas: facturas.rows
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener las facturas',
      error: error.message
    });
  }
});

// Obtener factura por ID
router.get('/:id', async (req, res) => {
  try {
    const factura = await Factura.findByPk(req.params.id, {
      include: [
        { 
          model: DetalleFactura 
        },
        { 
          model: Propiedad,
          include: [{ model: Propietario }]
        }
      ]
    });
    
    if (!factura) {
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada'
      });
    }
    
    return res.json({
      success: true,
      factura
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener la factura',
      error: error.message
    });
  }
});

// Crear nueva factura
router.post('/', [
  check('propiedadId', 'El ID de la propiedad es obligatorio').not().isEmpty(),
  check('fechaVencimiento', 'La fecha de vencimiento es obligatoria').not().isEmpty(),
  check('periodoFacturado', 'El período facturado es obligatorio').not().isEmpty(),
  check('detalles', 'Se requiere al menos un concepto a facturar').isArray({ min: 1 })
], checkRoles('admin', 'gerente', 'contador'), async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  const {
    propiedadId,
    fechaVencimiento,
    periodoFacturado,
    observaciones,
    detalles
  } = req.body;
  
  const t = await sequelize.transaction();
  
  try {
    // Verificar que la propiedad existe
    const propiedad = await Propiedad.findByPk(propiedadId);
    if (!propiedad) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'La propiedad no existe'
      });
    }
    
    // Generar número de factura
    const ultimaFactura = await Factura.findOne({
      order: [['id', 'DESC']]
    });
    
    const numeroActual = ultimaFactura ? parseInt(ultimaFactura.numeroFactura.split('-')[1]) : 0;
    const nuevoNumero = numeroActual + 1;
    const numeroFactura = `F-${nuevoNumero.toString().padStart(6, '0')}`;
    
    // Calcular totales
    let subtotal = 0;
    let totalIva = 0;
    let totalDescuento = 0;
    
    detalles.forEach(detalle => {
      subtotal += parseFloat(detalle.subtotal);
      totalIva += parseFloat(detalle.iva || 0);
      totalDescuento += parseFloat(detalle.descuento || 0);
    });
    
    const total = subtotal + totalIva - totalDescuento;
    
    // Crear la factura
    const nuevaFactura = await Factura.create({
      propiedadId,
      numeroFactura,
      fechaEmision: new Date(),
      fechaVencimiento,
      subtotal,
      iva: totalIva,
      descuento: totalDescuento,
      total,
      estado: 'Pendiente',
      observaciones,
      periodoFacturado
    }, { transaction: t });
    
    // Crear los detalles de la factura
    for (const detalle of detalles) {
      await DetalleFactura.create({
        facturaId: nuevaFactura.id,
        concepto: detalle.concepto,
        descripcion: detalle.descripcion,
        cantidad: detalle.cantidad || 1,
        valorUnitario: detalle.valorUnitario,
        subtotal: detalle.subtotal,
        iva: detalle.iva || 0,
        descuento: detalle.descuento || 0,
        total: detalle.total,
        cuentaContableId: detalle.cuentaContableId,
        presupuestoRubroId: detalle.presupuestoRubroId
      }, { transaction: t });
    }
    
    await t.commit();
    
    return res.status(201).json({
      success: true,
      message: 'Factura creada correctamente',
      factura: nuevaFactura
    });
    
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear la factura',
      error: error.message
    });
  }
});

// Actualizar factura
router.put('/:id', checkRoles('admin', 'gerente', 'contador'), async (req, res) => {
  const { id } = req.params;
  const {
    fechaVencimiento,
    estado,
    observaciones,
    detalles
  } = req.body;
  
  const t = await sequelize.transaction();
  
  try {
    // Verificar que la factura existe
    const factura = await Factura.findByPk(id);
    if (!factura) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada'
      });
    }
    
    // No permitir modificar facturas pagadas o anuladas
    if (['Pagada', 'Anulada'].includes(factura.estado)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: `No se puede modificar una factura en estado ${factura.estado}`
      });
    }
    
    // Actualizar datos básicos de la factura
    const datosActualizar = {};
    
    if (fechaVencimiento) datosActualizar.fechaVencimiento = fechaVencimiento;
    if (estado) datosActualizar.estado = estado;
    if (observaciones) datosActualizar.observaciones = observaciones;
    
    await factura.update(datosActualizar, { transaction: t });
    
    // Actualizar detalles si se proporcionaron
    if (detalles && detalles.length > 0) {
      // Eliminar detalles anteriores
      await DetalleFactura.destroy({
        where: { facturaId: id },
        transaction: t
      });
      
      // Calcular nuevos totales
      let subtotal = 0;
      let totalIva = 0;
      let totalDescuento = 0;
      
      for (const detalle of detalles) {
        subtotal += parseFloat(detalle.subtotal);
        totalIva += parseFloat(detalle.iva || 0);
        totalDescuento += parseFloat(detalle.descuento || 0);
        
        // Crear nuevos detalles
        await DetalleFactura.create({
          facturaId: id,
          concepto: detalle.concepto,
          descripcion: detalle.descripcion,
          cantidad: detalle.cantidad || 1,
          valorUnitario: detalle.valorUnitario,
          subtotal: detalle.subtotal,
          iva: detalle.iva || 0,
          descuento: detalle.descuento || 0,
          total: detalle.total,
          cuentaContableId: detalle.cuentaContableId,
          presupuestoRubroId: detalle.presupuestoRubroId
        }, { transaction: t });
      }
      
      const total = subtotal + totalIva - totalDescuento;
      
      // Actualizar totales en la factura
      await factura.update({
        subtotal,
        iva: totalIva,
        descuento: totalDescuento,
        total
      }, { transaction: t });
    }
    
    await t.commit();
    
    return res.json({
      success: true,
      message: 'Factura actualizada correctamente',
      factura: await Factura.findByPk(id, {
        include: [{ model: DetalleFactura }]
      })
    });
    
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar la factura',
      error: error.message
    });
  }
});

// Anular factura
router.put('/:id/anular', checkRoles('admin', 'gerente', 'contador'), async (req, res) => {
  const { id } = req.params;
  const { motivo } = req.body;
  
  try {
    const factura = await Factura.findByPk(id);
    
    if (!factura) {
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada'
      });
    }
    
    if (factura.estado === 'Anulada') {
      return res.status(400).json({
        success: false,
        message: 'La factura ya se encuentra anulada'
      });
    }
    
    if (factura.estado === 'Pagada') {
      return res.status(400).json({
        success: false,
        message: 'No se puede anular una factura pagada'
      });
    }
    
    await factura.update({
      estado: 'Anulada',
      observaciones: motivo ? `${factura.observaciones || ''}\nANULADA: ${motivo}` : factura.observaciones
    });
    
    return res.json({
      success: true,
      message: 'Factura anulada correctamente',
      factura
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al anular la factura',
      error: error.message
    });
  }
});

// Generar facturación masiva para un conjunto
router.post('/masiva/:conjuntoId', checkRoles('admin', 'gerente', 'contador'), async (req, res) => {
  const { conjuntoId } = req.params;
  const { 
    periodoFacturado, 
    fechaVencimiento,
    conceptos 
  } = req.body;
  
  const t = await sequelize.transaction();
  
  try {
    // Verificar datos requeridos
    if (!periodoFacturado || !fechaVencimiento || !conceptos || !conceptos.length) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Datos incompletos para la facturación masiva'
      });
    }
    
    // Obtener todas las propiedades activas del conjunto
    const propiedades = await Propiedad.findAll({
      where: { 
        conjuntoId,
        activo: true
      }
    });
    
    if (!propiedades.length) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'No se encontraron propiedades activas en este conjunto'
      });
    }
    
    // Generar facturas para cada propiedad
    const facturasGeneradas = [];
    
    // Obtener último número de factura
    const ultimaFactura = await Factura.findOne({
      order: [['id', 'DESC']]
    });
    
    let numeroActual = ultimaFactura ? parseInt(ultimaFactura.numeroFactura.split('-')[1]) : 0;
    
    for (const propiedad of propiedades) {
      numeroActual++;
      const numeroFactura = `F-${numeroActual.toString().padStart(6, '0')}`;
      
      // Calcular totales para esta propiedad
      let subtotal = 0;
      let totalIva = 0;
      let totalDescuento = 0;
      
      const detallesFactura = [];
      
      for (const concepto of conceptos) {
        let valorConcepto = parseFloat(concepto.valorUnitario);
        
        // Si es concepto basado en coeficiente, ajustarlo
        if (concepto.aplicarCoeficiente && propiedad.coeficiente) {
          valorConcepto = valorConcepto * propiedad.coeficiente;
        }
        
        const subtotalConcepto = concepto.cantidad * valorConcepto;
        const ivaConcepto = subtotalConcepto * (parseFloat(concepto.porcentajeIva || 0) / 100);
        const descuentoConcepto = subtotalConcepto * (parseFloat(concepto.porcentajeDescuento || 0) / 100);
        const totalConcepto = subtotalConcepto + ivaConcepto - descuentoConcepto;
        
        subtotal += subtotalConcepto;
        totalIva += ivaConcepto;
        totalDescuento += descuentoConcepto;
        
        detallesFactura.push({
          concepto: concepto.nombre,
          descripcion: concepto.descripcion,
          cantidad: concepto.cantidad || 1,
          valorUnitario: valorConcepto,
          subtotal: subtotalConcepto,
          iva: ivaConcepto,
          descuento: descuentoConcepto,
          total: totalConcepto,
          cuentaContableId: concepto.cuentaContableId,
          presupuestoRubroId: concepto.presupuestoRubroId
        });
      }
      
      const total = subtotal + totalIva - totalDescuento;
      
      // Crear la factura
      const nuevaFactura = await Factura.create({
        propiedadId: propiedad.id,
        numeroFactura,
        fechaEmision: new Date(),
        fechaVencimiento,
        subtotal,
        iva: totalIva,
        descuento: totalDescuento,
        total,
        estado: 'Pendiente',
        periodoFacturado
      }, { transaction: t });
      
      // Crear detalles
      for (const detalle of detallesFactura) {
        await DetalleFactura.create({
          ...detalle,
          facturaId: nuevaFactura.id
        }, { transaction: t });
      }
      
      facturasGeneradas.push(nuevaFactura);
    }
    
    await t.commit();
    
    return res.status(201).json({
      success: true,
      message: `Se generaron ${facturasGeneradas.length} facturas correctamente`,
      cantidadFacturas: facturasGeneradas.length
    });
    
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al generar la facturación masiva',
      error: error.message
    });
  }
});

// Generar reporte de facturación
router.get('/reportes/estado', checkRoles('admin', 'gerente', 'contador', 'tesorero'), async (req, res) => {
  const { conjuntoId, fechaInicio, fechaFin } = req.query;
  
  try {
    // Validar parámetros
    if (!conjuntoId) {
      return res.status(400).json({
        success: false,
        message: 'El ID del conjunto es requerido'
      });
    }
    
    // Construir cláusula where para fechas
    const whereClause = {};
    
    if (fechaInicio && fechaFin) {
      whereClause.fechaEmision = {
        [Sequelize.Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
      };
    }
    
    // Obtener estadísticas de facturas
    const estadisticas = await Factura.findAll({
      attributes: [
        'estado',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'cantidad'],
        [Sequelize.fn('SUM', Sequelize.col('total')), 'valorTotal']
      ],
      include: [
        {
          model: Propiedad,
          attributes: [],
          where: { conjuntoId }
        }
      ],
      where: whereClause,
      group: ['estado'],
      raw: true
    });
    
    // Calcular totales
    const totalFacturas = estadisticas.reduce((acc, item) => acc + parseInt(item.cantidad), 0);
    const valorTotalFacturado = estadisticas.reduce((acc, item) => acc + parseFloat(item.valorTotal || 0), 0);
    
    return res.json({
      success: true,
      estadisticas,
      totalFacturas,
      valorTotalFacturado
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al generar el reporte de facturación',
      error: error.message
    });
  }
});

module.exports = router;
