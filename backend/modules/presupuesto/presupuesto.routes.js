const express = require('express');
const { check, validationResult } = require('express-validator');
const { Presupuesto, RubroPresupuesto, Conjunto } = require('../../core/models');
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

// Obtener todos los presupuestos de un conjunto
router.get('/', async (req, res) => {
  try {
    const { conjuntoId, anio, estado } = req.query;
    
    const whereClause = {};
    
    if (conjuntoId) {
      whereClause.conjuntoId = conjuntoId;
    }
    
    if (anio) {
      whereClause.anio = anio;
    }
    
    if (estado) {
      whereClause.estado = estado;
    }
    
    const presupuestos = await Presupuesto.findAll({
      where: whereClause,
      include: [
        { model: Conjunto, attributes: ['id', 'nombre'] }
      ],
      order: [['anio', 'DESC'], ['id', 'DESC']]
    });
    
    return res.json({
      success: true,
      presupuestos
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los presupuestos',
      error: error.message
    });
  }
});

// Obtener un presupuesto por ID con sus rubros
router.get('/:id', async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findByPk(req.params.id, {
      include: [
        { 
          model: RubroPresupuesto,
          where: { activo: true },
          required: false
        },
        { model: Conjunto, attributes: ['id', 'nombre'] }
      ]
    });
    
    if (!presupuesto) {
      return res.status(404).json({
        success: false,
        message: 'Presupuesto no encontrado'
      });
    }
    
    return res.json({
      success: true,
      presupuesto
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener el presupuesto',
      error: error.message
    });
  }
});

// Crear nuevo presupuesto
router.post('/', [
  check('conjuntoId', 'El ID del conjunto es obligatorio').not().isEmpty(),
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('anio', 'El año es obligatorio').isNumeric()
], checkRoles('admin', 'gerente', 'contador'), async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  const {
    conjuntoId,
    nombre,
    anio,
    descripcion,
    estado = 'Borrador',
    fechaInicio,
    fechaFin,
    rubros = []
  } = req.body;
  
  const t = await sequelize.transaction();
  
  try {
    // Verificar que el conjunto existe
    const conjunto = await Conjunto.findByPk(conjuntoId);
    if (!conjunto) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'El conjunto no existe'
      });
    }
    
    // Verificar si ya existe un presupuesto aprobado para ese año
    if (estado === 'Aprobado') {
      const presupuestoExistente = await Presupuesto.findOne({
        where: {
          conjuntoId,
          anio,
          estado: 'Aprobado',
          activo: true
        }
      });
      
      if (presupuestoExistente) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Ya existe un presupuesto aprobado para el conjunto en el año ${anio}`
        });
      }
    }
    
    // Calcular monto total basado en rubros
    let montoTotal = 0;
    if (rubros.length > 0) {
      rubros.forEach(rubro => {
        montoTotal += parseFloat(rubro.montoPresupuestado || 0);
      });
    }
    
    // Crear el presupuesto
    const nuevoPrespuesto = await Presupuesto.create({
      conjuntoId,
      nombre,
      anio,
      descripcion,
      montoTotal,
      estado,
      fechaInicio: fechaInicio ? new Date(fechaInicio) : null,
      fechaFin: fechaFin ? new Date(fechaFin) : null,
      fechaAprobacion: estado === 'Aprobado' ? new Date() : null
    }, { transaction: t });
    
    // Crear rubros si se proporcionaron
    const rubrosCreados = [];
    if (rubros.length > 0) {
      for (const rubro of rubros) {
        // Si tiene distribución mensual, verificar que la suma coincida con el monto total
        if (rubro.distribucionMensual) {
          const sumaMensual = parseFloat(rubro.enero || 0) +
                             parseFloat(rubro.febrero || 0) +
                             parseFloat(rubro.marzo || 0) +
                             parseFloat(rubro.abril || 0) +
                             parseFloat(rubro.mayo || 0) +
                             parseFloat(rubro.junio || 0) +
                             parseFloat(rubro.julio || 0) +
                             parseFloat(rubro.agosto || 0) +
                             parseFloat(rubro.septiembre || 0) +
                             parseFloat(rubro.octubre || 0) +
                             parseFloat(rubro.noviembre || 0) +
                             parseFloat(rubro.diciembre || 0);
          
          // Si no hay distribución mensual definida, distribuir equitativamente
          if (sumaMensual === 0 && rubro.montoPresupuestado > 0) {
            const montoPorMes = parseFloat(rubro.montoPresupuestado) / 12;
            rubro.enero = rubro.febrero = rubro.marzo = rubro.abril = 
            rubro.mayo = rubro.junio = rubro.julio = rubro.agosto = 
            rubro.septiembre = rubro.octubre = rubro.noviembre = rubro.diciembre = montoPorMes;
          }
        }
        
        const rubroCreado = await RubroPresupuesto.create({
          ...rubro,
          presupuestoId: nuevoPrespuesto.id
        }, { transaction: t });
        
        rubrosCreados.push(rubroCreado);
      }
    }
    
    await t.commit();
    
    return res.status(201).json({
      success: true,
      message: 'Presupuesto creado correctamente',
      presupuesto: {
        ...nuevoPrespuesto.toJSON(),
        rubros: rubrosCreados
      }
    });
    
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al crear el presupuesto',
      error: error.message
    });
  }
});

// Actualizar presupuesto
router.put('/:id', checkRoles('admin', 'gerente', 'contador'), async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    descripcion,
    estado,
    fechaInicio,
    fechaFin,
    documentoAprobacion,
    rubros
  } = req.body;
  
  const t = await sequelize.transaction();
  
  try {
    // Verificar que el presupuesto existe
    const presupuesto = await Presupuesto.findByPk(id);
    if (!presupuesto) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Presupuesto no encontrado'
      });
    }
    
    // No permitir modificar presupuestos finalizados o anulados
    if (['Finalizado', 'Anulado'].includes(presupuesto.estado)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: `No se puede modificar un presupuesto en estado ${presupuesto.estado}`
      });
    }
    
    // Si se está cambiando a Aprobado, verificar que no haya otro aprobado
    if (estado === 'Aprobado' && presupuesto.estado !== 'Aprobado') {
      const presupuestoExistente = await Presupuesto.findOne({
        where: {
          conjuntoId: presupuesto.conjuntoId,
          anio: presupuesto.anio,
          estado: 'Aprobado',
          activo: true,
          id: { [Sequelize.Op.ne]: id }
        }
      });
      
      if (presupuestoExistente) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Ya existe un presupuesto aprobado para el conjunto en el año ${presupuesto.anio}`
        });
      }
    }
    
    // Actualizar datos básicos
    const datosActualizar = {};
    
    if (nombre) datosActualizar.nombre = nombre;
    if (descripcion) datosActualizar.descripcion = descripcion;
    if (estado) {
      datosActualizar.estado = estado;
      if (estado === 'Aprobado' && presupuesto.estado !== 'Aprobado') {
        datosActualizar.fechaAprobacion = new Date();
      }
    }
    if (fechaInicio) datosActualizar.fechaInicio = new Date(fechaInicio);
    if (fechaFin) datosActualizar.fechaFin = new Date(fechaFin);
    if (documentoAprobacion) datosActualizar.documentoAprobacion = documentoAprobacion;
    
    await presupuesto.update(datosActualizar, { transaction: t });
    
    // Actualizar o crear rubros si se proporcionaron
    if (rubros && rubros.length > 0) {
      let montoTotal = 0;
      
      for (const rubro of rubros) {
        if (rubro.id) {
          // Actualizar rubro existente
          const rubroExistente = await RubroPresupuesto.findByPk(rubro.id);
          
          if (rubroExistente && rubroExistente.presupuestoId === parseInt(id)) {
            await rubroExistente.update({
              nombre: rubro.nombre,
              codigo: rubro.codigo,
              descripcion: rubro.descripcion,
              montoPresupuestado: rubro.montoPresupuestado,
              tipo: rubro.tipo,
              cuentaContableId: rubro.cuentaContableId,
              distribucionMensual: rubro.distribucionMensual,
              enero: rubro.enero || 0,
              febrero: rubro.febrero || 0,
              marzo: rubro.marzo || 0,
              abril: rubro.abril || 0,
              mayo: rubro.mayo || 0,
              junio: rubro.junio || 0,
              julio: rubro.julio || 0,
              agosto: rubro.agosto || 0,
              septiembre: rubro.septiembre || 0,
              octubre: rubro.octubre || 0,
              noviembre: rubro.noviembre || 0,
              diciembre: rubro.diciembre || 0,
              activo: rubro.activo !== undefined ? rubro.activo : true
            }, { transaction: t });
            
            if (rubroExistente.activo !== false) {
              montoTotal += parseFloat(rubro.montoPresupuestado || 0);
            }
          }
        } else {
          // Crear nuevo rubro
          await RubroPresupuesto.create({
            ...rubro,
            presupuestoId: id
          }, { transaction: t });
          
          montoTotal += parseFloat(rubro.montoPresupuestado || 0);
        }
      }
      
      // Actualizar monto total del presupuesto
      await presupuesto.update({
        montoTotal
      }, { transaction: t });
    }
    
    await t.commit();
    
    return res.json({
      success: true,
      message: 'Presupuesto actualizado correctamente',
      presupuesto: await Presupuesto.findByPk(id, {
        include: [{ model: RubroPresupuesto, where: { activo: true }, required: false }]
      })
    });
    
  } catch (error) {
    await t.rollback();
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el presupuesto',
      error: error.message
    });
  }
});

// Eliminar/anular un presupuesto
router.delete('/:id', checkRoles('admin', 'gerente'), async (req, res) => {
  const { id } = req.params;
  
  try {
    const presupuesto = await Presupuesto.findByPk(id);
    
    if (!presupuesto) {
      return res.status(404).json({
        success: false,
        message: 'Presupuesto no encontrado'
      });
    }
    
    // Si está en ejecución o finalizado, solo se marca como anulado
    if (['Ejecutándose', 'Finalizado'].includes(presupuesto.estado)) {
      await presupuesto.update({
        estado: 'Anulado',
        activo: false
      });
      
      return res.json({
        success: true,
        message: 'Presupuesto anulado correctamente'
      });
    } else {
      // Si está en borrador o aprobado, se puede eliminar lógicamente
      await presupuesto.update({
        activo: false
      });
      
      return res.json({
        success: true,
        message: 'Presupuesto eliminado correctamente'
      });
    }
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el presupuesto',
      error: error.message
    });
  }
});

// Obtener ejecución presupuestal (comparativo presupuestado vs ejecutado)
router.get('/:id/ejecucion', async (req, res) => {
  try {
    const { id } = req.params;
    const { mes } = req.query;
    
    const presupuesto = await Presupuesto.findByPk(id, {
      include: [
        { model: RubroPresupuesto, where: { activo: true }, required: false }
      ]
    });
    
    if (!presupuesto) {
      return res.status(404).json({
        success: false,
        message: 'Presupuesto no encontrado'
      });
    }
    
    // Preparar resultado
    const ejecucion = {
      presupuestado: {
        total: parseFloat(presupuesto.montoTotal),
        ingresos: 0,
        gastos: 0
      },
      ejecutado: {
        total: 0,
        ingresos: 0,
        gastos: 0
      },
      porcentajeEjecucion: 0,
      rubros: []
    };
    
    // Calcular ejecución por rubros
    if (presupuesto.RubroPresupuestos && presupuesto.RubroPresupuestos.length > 0) {
      // Calcular totales presupuestados por tipo
      presupuesto.RubroPresupuestos.forEach(rubro => {
        if (rubro.tipo === 'Ingreso') {
          ejecucion.presupuestado.ingresos += parseFloat(rubro.montoPresupuestado);
        } else {
          ejecucion.presupuestado.gastos += parseFloat(rubro.montoPresupuestado);
        }
        
        // Calcular montos ejecutados y porcentajes de ejecución
        const montoEjecutado = parseFloat(rubro.montoEjecutado);
        const porcentajeEjecucionRubro = rubro.montoPresupuestado > 0 
          ? (montoEjecutado / parseFloat(rubro.montoPresupuestado)) * 100 
          : 0;
        
        if (rubro.tipo === 'Ingreso') {
          ejecucion.ejecutado.ingresos += montoEjecutado;
        } else {
          ejecucion.ejecutado.gastos += montoEjecutado;
        }
        
        // Determinar presupuestado para el período
        let montoPeriodo = parseFloat(rubro.montoPresupuestado);
        
        // Si hay un mes específico y tiene distribución mensual
        if (mes && rubro.distribucionMensual) {
          const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                       'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
          
          if (meses[mes - 1]) {
            montoPeriodo = parseFloat(rubro[meses[mes - 1]]) || 0;
          }
        }
        
        ejecucion.rubros.push({
          id: rubro.id,
          codigo: rubro.codigo,
          nombre: rubro.nombre,
          tipo: rubro.tipo,
          montoPresupuestado: parseFloat(rubro.montoPresupuestado),
          montoPresupuestadoPeriodo: montoPeriodo,
          montoEjecutado: montoEjecutado,
          porcentajeEjecucion: porcentajeEjecucionRubro.toFixed(2)
        });
      });
      
      // Calcular totales ejecutados
      ejecucion.ejecutado.total = ejecucion.ejecutado.ingresos - ejecucion.ejecutado.gastos;
      
      // Calcular porcentaje general de ejecución
      ejecucion.porcentajeEjecucion = ejecucion.presupuestado.total > 0 
        ? ((ejecucion.ejecutado.ingresos + ejecucion.ejecutado.gastos) / ejecucion.presupuestado.total) * 100 
        : 0;
    }
    
    return res.json({
      success: true,
      ejecucion
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al obtener la ejecución presupuestal',
      error: error.message
    });
  }
});

// Registrar ejecución de un rubro presupuestal
router.post('/:presupuestoId/rubros/:rubroId/ejecucion', checkRoles('admin', 'gerente', 'contador'), async (req, res) => {
  const { presupuestoId, rubroId } = req.params;
  const { montoEjecutado, observaciones } = req.body;
  
  try {
    // Verificar que el presupuesto y rubro existen
    const presupuesto = await Presupuesto.findByPk(presupuestoId);
    if (!presupuesto) {
      return res.status(404).json({
        success: false,
        message: 'Presupuesto no encontrado'
      });
    }
    
    if (!['Aprobado', 'Ejecutándose'].includes(presupuesto.estado)) {
      return res.status(400).json({
        success: false,
        message: `No se puede registrar ejecución en un presupuesto en estado ${presupuesto.estado}`
      });
    }
    
    const rubro = await RubroPresupuesto.findOne({
      where: {
        id: rubroId,
        presupuestoId,
        activo: true
      }
    });
    
    if (!rubro) {
      return res.status(404).json({
        success: false,
        message: 'Rubro presupuestal no encontrado'
      });
    }
    
    // Si es la primera ejecución, cambiar estado a "Ejecutándose"
    if (presupuesto.estado === 'Aprobado') {
      await presupuesto.update({ estado: 'Ejecutándose' });
    }
    
    // Actualizar monto ejecutado del rubro
    const nuevoMontoEjecutado = parseFloat(rubro.montoEjecutado) + parseFloat(montoEjecutado);
    await rubro.update({
      montoEjecutado: nuevoMontoEjecutado
    });
    
    return res.json({
      success: true,
      message: 'Ejecución presupuestal registrada correctamente',
      rubro: {
        ...rubro.toJSON(),
        porcentajeEjecucion: rubro.montoPresupuestado > 0 
          ? (nuevoMontoEjecutado / parseFloat(rubro.montoPresupuestado)) * 100 
          : 0
      }
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error al registrar la ejecución presupuestal',
      error: error.message
    });
  }
});

module.exports = router;
