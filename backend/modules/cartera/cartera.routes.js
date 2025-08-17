const express = require('express');
const { check, validationResult } = require('express-validator');
const { MovimientoCartera, Factura, Propiedad, Propietario } = require('../../core/models');
const { sequelize, Sequelize } = require('../../core/db');
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

// Obtener estado de cartera de un conjunto
router.get('/estado', async (req, res) => {
  try {
    const { conjuntoId } = req.query;
    
    if (!conjuntoId) {
      return res.status(400).json({
        success: false,
        message: 'El ID del conjunto es requerido'
      });
    }
    
    // Calcular totales de cartera
    const carteraTotal = await Factura.findAll({
      attributes: [
        'estado',
        [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad'],
        [sequelize.fn('SUM', sequelize.col('total')), 'monto']
      ],
      include: [
        {
          model: Propiedad,
          attributes: [],
          where: { conjuntoId }
        }
      ],
      where: {
        estado: {
          [Sequelize.Op.in]: ['Pendiente', 'Vencida', 'Parcial']
        }
      },
      group: ['estado'],
      raw: true
    });
    
    // Calcular total por edades de cartera
    const fechaActual = new Date();
    
    const carteraVencida = await Factura.findAll({
      attributes: [
        [
          sequelize.literal(`
            CASE 
              WHEN DATEDIFF(NOW(), fecha_vencimiento) <= 30 THEN '0-30'
              WHEN DATEDIFF(NOW(), fecha_vencimiento) <= 60 THEN '31-60'
              WHEN DATEDIFF(NOW(), fecha_vencimiento) <= 90 THEN '61-90'
              ELSE 'Mayor a 90'
            END
          `),
          'rango'
        ],
        [sequelize.fn('COUNT', sequelize.col('id')), 'cantidad'],
        [sequelize.fn('SUM', sequelize.col('total')), 'monto']
      ],
      include: [
        {
          model: Propiedad,
          attributes: [],
          where: { conjuntoId }
        }
      ],
      where: {
        estado: {
          [Sequelize.Op.in]: ['Pendiente', 'Vencida', 'Parcial']
        },
        fechaVencimiento: {
          [Sequelize.Op.lt]: fechaActual
        }
      },
      group: [sequelize.literal(`
        CASE 
          WHEN DATEDIFF(NOW(), fecha_vencimiento) <= 30 THEN '0-30'
          WHEN DATEDIFF(NOW(), fecha_vencimiento) <= 60 THEN '31-60'
          WHEN DATEDIFF(NOW(), fecha_vencimiento) <= 90 THEN '61-90'
          ELSE 'Mayor a 90'
        END
      `)],
      raw: true
    });
    
    // Calcular top 10 de deudores
    const topDeudores = await Propiedad.findAll({
      attributes: [
        'id',
        'identificacion',
        'bloque',
        'torre',
        'piso',
        [sequelize.fn('SUM', sequelize.col('Facturas.total')), 'totalDeuda']
      ],
      include: [
        {
          model: Factura,
          attributes: [],
          where: {
            estado: {
              [Sequelize.Op.in]: ['Pendiente', 'Vencida', 'Parcial']
            }
          },
          required: true
        },
        {
          model: Propietario,
          attributes: ['nombre']
        }
      ],
      where: {
        conjuntoId
      },
      group: ['Propiedad.id', 'Propietario.id'],
      order: [[sequelize.fn('SUM', sequelize.col('Facturas.total')), 'DESC']],
      limit: 10,
      raw: true
    });
    
    // Calcular totales de recaudo
    const recaudos = await MovimientoCartera.findAll({
      attributes: [
        [sequelize.fn('YEAR', sequelize.col('fecha')), 'anio'],
        [sequelize.fn('MONTH', sequelize.col('fecha')), 'mes'],
        [sequelize.fn('SUM', sequelize.col('monto')), 'montoRecaudado']
      ],
      include: [
        {
          model: Factura,
          attributes: [],
          include: [
            {
              model: Propiedad,
              attributes: [],
              where: { conjuntoId }
            }
          ]
        }
      ],
      where: {
        tipoMovimiento: {
          [Sequelize.Op.in]: ['Pago', 'Abono']
        },
        anulado: false,
        [Sequelize.Op.and]: sequelize.literal(`YEAR(fecha) = YEAR(CURRENT_DATE())`)
      },
      group: ['anio', 'mes'],
      order: [
        [sequelize.fn('YEAR', sequelize.col('fecha')), 'ASC'],
        [sequelize.fn('MONTH', sequelize.col('fecha')), 'ASC']
      ],
      raw: true
    });
    
    return res.json({
      success: true,
      cartera: {
        total: carteraTotal,
        porEdades: carteraVencida,
        topDeudores,
        recaudos
      }
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el estado de cartera',
      error: error.message
    });
  }
});

// Obtener cartera por propiedad
router.get('/propiedad/:propiedadId', async (req, res) => {
  try {
    const { propiedadId } = req.params;
    
    // Verificar que la propiedad existe
    const propiedad = await Propiedad.findByPk(propiedadId);
    if (!propiedad) {
      return res.status(404).json({
        success: false,
        message: 'Propiedad no encontrada'
      });
    }
    
    // Obtener facturas pendientes y sus pagos
    const facturas = await Factura.findAll({
      where: {
        propiedadId,
        estado: {
          [Sequelize.Op.in]: ['Pendiente', 'Vencida', 'Parcial']
        }
      },
      include: [
        {
          model: MovimientoCartera,
          where: {
            anulado: false
          },
          required: false
        }
      ],
      order: [['fechaEmision', 'ASC']]
    });
    
    const cartera = facturas.map(factura => {
      // Calcular días de mora
      const fechaVencimiento = new Date(factura.fechaVencimiento);
      const fechaActual = new Date();
      const diasMora = fechaVencimiento < fechaActual 
        ? Math.floor((fechaActual - fechaVencimiento) / (1000 * 60 * 60 * 24))
        : 0;
      
      // Calcular total pagado
      let totalPagado = 0;
      if (factura.MovimientoCarteras && factura.MovimientoCarteras.length > 0) {
        totalPagado = factura.MovimientoCarteras
          .filter(movimiento => ['Pago', 'Abono'].includes(movimiento.tipoMovimiento))
          .reduce((sum, movimiento) => sum + parseFloat(movimiento.monto), 0);
      }
      
      // Calcular saldo
      const saldo = parseFloat(factura.total) - totalPagado;
      
      return {
        facturaId: factura.id,
        numeroFactura: factura.numeroFactura,
        fechaEmision: factura.fechaEmision,
        fechaVencimiento: factura.fechaVencimiento,
        periodoFacturado: factura.periodoFacturado,
        total: parseFloat(factura.total),
        totalPagado,
        saldo,
        estado: factura.estado,
        diasMora,
        pagos: factura.MovimientoCarteras || []
      };
    });
    
    return res.json({
      success: true,
      propiedad: {
        id: propiedad.id,
        identificacion: propiedad.identificacion,
        bloque: propiedad.bloque,
        torre: propiedad.torre,
        piso: propiedad.piso
      },
      cartera
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener la cartera de la propiedad',
      error: error.message
    });
  }
});

// Registrar pago o abono
router.post('/pago', [
  check('facturaId', 'El ID de la factura es obligatorio').not().isEmpty(),
  check('monto', 'El monto es obligatorio').isNumeric(),
  check('medioPago', 'El medio de pago es obligatorio').not().isEmpty()
], checkRoles('admin', 'gerente', 'contador', 'tesorero'), async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  const {
    facturaId,
    tipoMovimiento = 'Pago',
    monto,
    fecha = new Date(),
    descripcion,
    comprobante,
    medioPago,
    bancoId,
    referencia
  } = req.body;
  
  const t = await sequelize.transaction();
  
  try {
    // Verificar que la factura existe
    const factura = await Factura.findByPk(facturaId);
    if (!factura) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada'
      });
    }
    
    // Verificar que la factura no esté anulada
    if (factura.estado === 'Anulada') {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'No se pueden registrar pagos a facturas anuladas'
      });
    }
    
    // Verificar que la factura no esté pagada (si es pago total)
    if (factura.estado === 'Pagada' && tipoMovimiento === 'Pago') {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'La factura ya está pagada completamente'
      });
    }
    
    // Obtener pagos anteriores
    const pagosAnteriores = await MovimientoCartera.findAll({
      where: {
        facturaId,
        tipoMovimiento: {
          [Sequelize.Op.in]: ['Pago', 'Abono']
        },
        anulado: false
      }
    });
    
    const totalPagado = pagosAnteriores.reduce((sum, pago) => sum + parseFloat(pago.monto), 0);
    const totalFactura = parseFloat(factura.total);
    const saldoPendiente = totalFactura - totalPagado;
    
    // Verificar que el monto no exceda el saldo pendiente
    if (parseFloat(monto) > saldoPendiente) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: `El monto del pago (${monto}) excede el saldo pendiente (${saldoPendiente.toFixed(2)})`
      });
    }
    
    // Registrar el movimiento
    const movimiento = await MovimientoCartera.create({
      facturaId,
      tipoMovimiento,
      monto,
      fecha: new Date(fecha),
      descripcion,
      comprobante,
      medioPago,
      bancoId,
      referencia,
      usuarioId: req.usuario.id
    }, { transaction: t });
    
    // Actualizar estado de la factura
    const nuevoTotalPagado = totalPagado + parseFloat(monto);
    let nuevoEstado;
    
    if (nuevoTotalPagado >= totalFactura) {
      nuevoEstado = 'Pagada';
    } else if (nuevoTotalPagado > 0) {
      nuevoEstado = 'Parcial';
    } else {
      nuevoEstado = factura.estado;
    }
    
    await factura.update({ estado: nuevoEstado }, { transaction: t });
    
    await t.commit();
    
    return res.status(201).json({
      success: true,
      message: `${tipoMovimiento} registrado correctamente`,
      movimiento,
      factura: {
        ...factura.toJSON(),
        estado: nuevoEstado,
        totalPagado: nuevoTotalPagado,
        saldoPendiente: totalFactura - nuevoTotalPagado
      }
    });
    
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({
      success: false,
      message: `Error al registrar el ${tipoMovimiento.toLowerCase()}`,
      error: error.message
    });
  }
});

// Anular un pago
router.put('/pago/:id/anular', checkRoles('admin', 'gerente', 'tesorero'), async (req, res) => {
  const { id } = req.params;
  const { motivoAnulacion } = req.body;
  
  const t = await sequelize.transaction();
  
  try {
    // Verificar que el movimiento existe
    const movimiento = await MovimientoCartera.findByPk(id);
    if (!movimiento) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Movimiento de cartera no encontrado'
      });
    }
    
    // Verificar que no esté anulado
    if (movimiento.anulado) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'El movimiento ya está anulado'
      });
    }
    
    // Anular el movimiento
    await movimiento.update({
      anulado: true,
      fechaAnulacion: new Date(),
      motivoAnulacion,
      usuarioAnulacionId: req.usuario.id
    }, { transaction: t });
    
    // Actualizar estado de la factura
    const factura = await Factura.findByPk(movimiento.facturaId);
    
    // Obtener pagos válidos
    const pagosValidos = await MovimientoCartera.findAll({
      where: {
        facturaId: movimiento.facturaId,
        tipoMovimiento: {
          [Sequelize.Op.in]: ['Pago', 'Abono']
        },
        anulado: false
      }
    });
    
    const totalPagado = pagosValidos.reduce((sum, pago) => sum + parseFloat(pago.monto), 0);
    const totalFactura = parseFloat(factura.total);
    
    // Determinar nuevo estado
    let nuevoEstado;
    if (totalPagado >= totalFactura) {
      nuevoEstado = 'Pagada';
    } else if (totalPagado > 0) {
      nuevoEstado = 'Parcial';
    } else {
      // Verificar si está vencida
      nuevoEstado = new Date(factura.fechaVencimiento) < new Date() ? 'Vencida' : 'Pendiente';
    }
    
    await factura.update({ estado: nuevoEstado }, { transaction: t });
    
    await t.commit();
    
    return res.json({
      success: true,
      message: 'Pago anulado correctamente',
      movimiento: {
        ...movimiento.toJSON(),
        anulado: true
      },
      factura: {
        ...factura.toJSON(),
        estado: nuevoEstado,
        totalPagado,
        saldoPendiente: totalFactura - totalPagado
      }
    });
    
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al anular el pago',
      error: error.message
    });
  }
});

// Obtener historial de pagos
router.get('/pagos', async (req, res) => {
  try {
    const { 
      conjuntoId, propiedadId, facturaId, 
      fechaInicio, fechaFin, 
      page = 1, limit = 20 
    } = req.query;
    
    const whereClause = {
      anulado: false
    };
    
    if (facturaId) {
      whereClause.facturaId = facturaId;
    }
    
    const includeClause = [
      {
        model: Factura,
        include: [
          { 
            model: Propiedad,
            where: propiedadId ? { id: propiedadId } : {}
          }
        ]
      }
    ];
    
    if (conjuntoId) {
      includeClause[0].include[0].where.conjuntoId = conjuntoId;
    }
    
    if (fechaInicio && fechaFin) {
      whereClause.fecha = {
        [Sequelize.Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
      };
    }
    
    // Obtener pagos
    const pagos = await MovimientoCartera.findAndCountAll({
      where: whereClause,
      include: includeClause,
      order: [['fecha', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });
    
    return res.json({
      success: true,
      total: pagos.count,
      pagos: pagos.rows,
      page: parseInt(page),
      pages: Math.ceil(pagos.count / parseInt(limit))
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el historial de pagos',
      error: error.message
    });
  }
});

// Generar reporte de cartera por edades
router.get('/reporte/edades', checkRoles('admin', 'gerente', 'contador', 'tesorero'), async (req, res) => {
  try {
    const { conjuntoId } = req.query;
    
    if (!conjuntoId) {
      return res.status(400).json({
        success: false,
        message: 'El ID del conjunto es requerido'
      });
    }
    
    // Obtener todas las propiedades con facturas pendientes
    const propiedades = await Propiedad.findAll({
      where: { 
        conjuntoId,
        activo: true
      },
      include: [
        {
          model: Propietario
        },
        {
          model: Factura,
          where: {
            estado: {
              [Sequelize.Op.in]: ['Pendiente', 'Vencida', 'Parcial']
            }
          },
          required: false,
          include: [
            {
              model: MovimientoCartera,
              where: {
                anulado: false,
                tipoMovimiento: {
                  [Sequelize.Op.in]: ['Pago', 'Abono']
                }
              },
              required: false
            }
          ]
        }
      ]
    });
    
    // Procesar datos para el reporte
    const reporte = propiedades.map(propiedad => {
      // Agrupar facturas por edades
      const facturasPorEdad = {
        corriente: [],
        '1a30': [],
        '31a60': [],
        '61a90': [],
        'mayor90': []
      };
      
      const fechaActual = new Date();
      let totalDeuda = 0;
      
      if (propiedad.Facturas && propiedad.Facturas.length > 0) {
        propiedad.Facturas.forEach(factura => {
          // Calcular pagos
          const totalPagado = factura.MovimientoCarteras && factura.MovimientoCarteras.length > 0
            ? factura.MovimientoCarteras.reduce((sum, mov) => sum + parseFloat(mov.monto), 0)
            : 0;
          
          const saldo = parseFloat(factura.total) - totalPagado;
          
          if (saldo <= 0) return;
          
          totalDeuda += saldo;
          
          // Calcular días de mora
          const fechaVencimiento = new Date(factura.fechaVencimiento);
          if (fechaVencimiento >= fechaActual) {
            facturasPorEdad.corriente.push({
              id: factura.id,
              numeroFactura: factura.numeroFactura,
              fechaVencimiento: factura.fechaVencimiento,
              periodoFacturado: factura.periodoFacturado,
              saldo
            });
          } else {
            const diasMora = Math.floor((fechaActual - fechaVencimiento) / (1000 * 60 * 60 * 24));
            
            if (diasMora <= 30) {
              facturasPorEdad['1a30'].push({
                id: factura.id,
                numeroFactura: factura.numeroFactura,
                fechaVencimiento: factura.fechaVencimiento,
                periodoFacturado: factura.periodoFacturado,
                saldo,
                diasMora
              });
            } else if (diasMora <= 60) {
              facturasPorEdad['31a60'].push({
                id: factura.id,
                numeroFactura: factura.numeroFactura,
                fechaVencimiento: factura.fechaVencimiento,
                periodoFacturado: factura.periodoFacturado,
                saldo,
                diasMora
              });
            } else if (diasMora <= 90) {
              facturasPorEdad['61a90'].push({
                id: factura.id,
                numeroFactura: factura.numeroFactura,
                fechaVencimiento: factura.fechaVencimiento,
                periodoFacturado: factura.periodoFacturado,
                saldo,
                diasMora
              });
            } else {
              facturasPorEdad.mayor90.push({
                id: factura.id,
                numeroFactura: factura.numeroFactura,
                fechaVencimiento: factura.fechaVencimiento,
                periodoFacturado: factura.periodoFacturado,
                saldo,
                diasMora
              });
            }
          }
        });
      }
      
      // Calcular totales por edad
      const totalCorriente = facturasPorEdad.corriente.reduce((sum, f) => sum + f.saldo, 0);
      const total1a30 = facturasPorEdad['1a30'].reduce((sum, f) => sum + f.saldo, 0);
      const total31a60 = facturasPorEdad['31a60'].reduce((sum, f) => sum + f.saldo, 0);
      const total61a90 = facturasPorEdad['61a90'].reduce((sum, f) => sum + f.saldo, 0);
      const totalMayor90 = facturasPorEdad.mayor90.reduce((sum, f) => sum + f.saldo, 0);
      
      return {
        propiedad: {
          id: propiedad.id,
          identificacion: propiedad.identificacion,
          bloque: propiedad.bloque,
          torre: propiedad.torre,
          piso: propiedad.piso,
          propietario: propiedad.Propietario ? propiedad.Propietario.nombre : 'Sin asignar'
        },
        totalDeuda,
        edades: {
          corriente: {
            facturas: facturasPorEdad.corriente,
            total: totalCorriente
          },
          '1a30': {
            facturas: facturasPorEdad['1a30'],
            total: total1a30
          },
          '31a60': {
            facturas: facturasPorEdad['31a60'],
            total: total31a60
          },
          '61a90': {
            facturas: facturasPorEdad['61a90'],
            total: total61a90
          },
          'mayor90': {
            facturas: facturasPorEdad.mayor90,
            total: totalMayor90
          }
        }
      };
    }).filter(item => item.totalDeuda > 0); // Filtrar solo propiedades con deuda
    
    // Calcular totales generales
    const totales = {
      corriente: reporte.reduce((sum, item) => sum + item.edades.corriente.total, 0),
      '1a30': reporte.reduce((sum, item) => sum + item.edades['1a30'].total, 0),
      '31a60': reporte.reduce((sum, item) => sum + item.edades['31a60'].total, 0),
      '61a90': reporte.reduce((sum, item) => sum + item.edades['61a90'].total, 0),
      'mayor90': reporte.reduce((sum, item) => sum + item.edades.mayor90.total, 0),
      total: reporte.reduce((sum, item) => sum + item.totalDeuda, 0)
    };
    
    return res.json({
      success: true,
      reporte,
      totales,
      fecha: new Date()
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al generar el reporte de cartera por edades',
      error: error.message
    });
  }
});

module.exports = router;
