const { sequelize } = require('./db');
const Usuario = require('./usuario');

// Importación de modelos de los módulos - Usando try/catch para manejar módulos que puedan no existir
let Factura, DetalleFactura, Presupuesto, RubroPresupuesto, MovimientoCartera;
let AsientoContable, CuentaContable, LibroDiario;
let ActivoFijo, DepreciacionActivoFijo;
let MovimientoTesoreria, Banco, Caja;
let Proveedor, Compra, OrdenCompra;
let Reunion, Acta, Documento;
let ItemInventario, MovimientoInventario;
let ConfiguracionNIIF, ReporteNIIF;
let Empleado, Nomina, ConceptoNomina;

try {
  const facturaModule = require('../modules/facturacion/factura');
  Factura = facturaModule.Factura;
  DetalleFactura = facturaModule.DetalleFactura;
} catch (error) {
  console.log('Módulo de facturación no disponible');
}

try {
  const presupuestoModule = require('../modules/presupuesto/presupuesto');
  Presupuesto = presupuestoModule.Presupuesto;
  RubroPresupuesto = presupuestoModule.RubroPresupuesto;
} catch (error) {
  console.log('Módulo de presupuesto no disponible');
}

try {
  const carteraModule = require('../modules/cartera/movimientoCartera');
  MovimientoCartera = carteraModule.MovimientoCartera;
} catch (error) {
  console.log('Módulo de cartera no disponible');
}

// Los demás módulos se cargarán a medida que estén disponibles

let Conjunto, Propiedad, TipoPropiedad, Propietario, Residente, AreaComun;

try {
  ({ 
    Conjunto,
    Propiedad,
    TipoPropiedad,
    Propietario,
    Residente,
    AreaComun
  } = require('./propiedades.models'));

  // Definición de relaciones solo si los modelos existen
  if (Conjunto && Propiedad) {
    // Conjunto Residencial - Propiedades
    Conjunto.hasMany(Propiedad, { foreignKey: 'conjuntoId' });
    Propiedad.belongsTo(Conjunto, { foreignKey: 'conjuntoId' });
  }

  if (TipoPropiedad && Propiedad) {
    // Tipo de Propiedad - Propiedades
    TipoPropiedad.hasMany(Propiedad, { foreignKey: 'tipoPropiedadId' });
    Propiedad.belongsTo(TipoPropiedad, { foreignKey: 'tipoPropiedadId' });
  }

  if (Propietario && Propiedad) {
    // Propietarios - Propiedades
    Propietario.hasMany(Propiedad, { foreignKey: 'propietarioId' });
    Propiedad.belongsTo(Propietario, { foreignKey: 'propietarioId' });
  }

  if (Propiedad && Residente) {
    // Residentes - Propiedades
    Propiedad.hasMany(Residente, { foreignKey: 'propiedadId' });
    Residente.belongsTo(Propiedad, { foreignKey: 'propiedadId' });
  }

  if (Usuario) {
    // Usuario - Propietarios/Residentes
    if (Propietario) {
      Usuario.hasOne(Propietario, { foreignKey: 'usuarioId' });
      Propietario.belongsTo(Usuario, { foreignKey: 'usuarioId' });
    }
    
    if (Residente) {
      Usuario.hasOne(Residente, { foreignKey: 'usuarioId' });
      Residente.belongsTo(Usuario, { foreignKey: 'usuarioId' });
    }
  }
} catch (error) {
  console.log('Modelos de propiedades no disponibles:', error.message);
}

// Establecer relaciones solo si los módulos están cargados
if (Factura && Propiedad) {
  // Facturación - Propiedades
  Propiedad.hasMany(Factura, { foreignKey: 'propiedadId' });
  Factura.belongsTo(Propiedad, { foreignKey: 'propiedadId' });
}

if (Factura && DetalleFactura) {
  // Facturas - Detalles
  Factura.hasMany(DetalleFactura, { foreignKey: 'facturaId' });
  DetalleFactura.belongsTo(Factura, { foreignKey: 'facturaId' });
}

if (Factura && MovimientoCartera) {
  // Facturas - Cartera
  Factura.hasMany(MovimientoCartera, { foreignKey: 'facturaId' });
  MovimientoCartera.belongsTo(Factura, { foreignKey: 'facturaId' });
}

if (Conjunto && Presupuesto) {
  // Presupuesto - Conjunto
  Conjunto.hasMany(Presupuesto, { foreignKey: 'conjuntoId' });
  Presupuesto.belongsTo(Conjunto, { foreignKey: 'conjuntoId' });
}

if (Presupuesto && RubroPresupuesto) {
  // Presupuesto - Rubros
  Presupuesto.hasMany(RubroPresupuesto, { foreignKey: 'presupuestoId' });
  RubroPresupuesto.belongsTo(Presupuesto, { foreignKey: 'presupuestoId' });
}

if (Conjunto && AsientoContable) {
  // Contabilidad - Conjunto
  Conjunto.hasMany(AsientoContable, { foreignKey: 'conjuntoId' });
  AsientoContable.belongsTo(Conjunto, { foreignKey: 'conjuntoId' });
}

if (Conjunto && MovimientoTesoreria) {
  // Tesorería - Conjunto
  Conjunto.hasMany(MovimientoTesoreria, { foreignKey: 'conjuntoId' });
  MovimientoTesoreria.belongsTo(Conjunto, { foreignKey: 'conjuntoId' });
}

if (CuentaContable) {
  // Relación circular para las cuentas contables (estructura jerárquica)
  CuentaContable.belongsTo(CuentaContable, { as: 'cuentaPadre', foreignKey: 'cuentaPadreId' });
  CuentaContable.hasMany(CuentaContable, { as: 'subcuentas', foreignKey: 'cuentaPadreId' });
}

// Exportación de modelos - Solo exportamos los que existen
const modelsToExport = {
  sequelize,
  Usuario
};

// Agregar modelos solo si existen
if (Factura) modelsToExport.Factura = Factura;
if (DetalleFactura) modelsToExport.DetalleFactura = DetalleFactura;
if (Presupuesto) modelsToExport.Presupuesto = Presupuesto;
if (RubroPresupuesto) modelsToExport.RubroPresupuesto = RubroPresupuesto;
if (MovimientoCartera) modelsToExport.MovimientoCartera = MovimientoCartera;
if (AsientoContable) modelsToExport.AsientoContable = AsientoContable;
if (CuentaContable) modelsToExport.CuentaContable = CuentaContable;
if (LibroDiario) modelsToExport.LibroDiario = LibroDiario;
if (ActivoFijo) modelsToExport.ActivoFijo = ActivoFijo;
if (DepreciacionActivoFijo) modelsToExport.DepreciacionActivoFijo = DepreciacionActivoFijo;
if (MovimientoTesoreria) modelsToExport.MovimientoTesoreria = MovimientoTesoreria;
if (Banco) modelsToExport.Banco = Banco;
if (Caja) modelsToExport.Caja = Caja;
if (Proveedor) modelsToExport.Proveedor = Proveedor;
if (Compra) modelsToExport.Compra = Compra;
if (OrdenCompra) modelsToExport.OrdenCompra = OrdenCompra;
if (Reunion) modelsToExport.Reunion = Reunion;
if (Acta) modelsToExport.Acta = Acta;
if (Documento) modelsToExport.Documento = Documento;
if (ItemInventario) modelsToExport.ItemInventario = ItemInventario;
if (MovimientoInventario) modelsToExport.MovimientoInventario = MovimientoInventario;
if (ConfiguracionNIIF) modelsToExport.ConfiguracionNIIF = ConfiguracionNIIF;
if (ReporteNIIF) modelsToExport.ReporteNIIF = ReporteNIIF;
if (Empleado) modelsToExport.Empleado = Empleado;
if (Nomina) modelsToExport.Nomina = Nomina;
if (ConceptoNomina) modelsToExport.ConceptoNomina = ConceptoNomina;
if (Conjunto) modelsToExport.Conjunto = Conjunto;
if (Propiedad) modelsToExport.Propiedad = Propiedad;
if (TipoPropiedad) modelsToExport.TipoPropiedad = TipoPropiedad;
if (Propietario) modelsToExport.Propietario = Propietario;
if (Residente) modelsToExport.Residente = Residente;
if (AreaComun) modelsToExport.AreaComun = AreaComun;

module.exports = modelsToExport;
