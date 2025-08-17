import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Grid, 
  Box, 
  Button, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Tab,
  Tabs,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  List,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  History as HistoryIcon,
  QrCode2 as QrCode2Icon,
  Category as CategoryIcon,
  LocalOffer as LocalOfferIcon,
  ViewList as ViewListIcon,
  Sell as BrandingIcon,
  Warehouse as WarehouseIcon,
  SwapHoriz as SwapHorizIcon
} from '@mui/icons-material';

import GestionAlmacenes from '../components/almacenes/GestionAlmacenes';

// Panel de contenido para las pestañas
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`inventario-tabpanel-${index}`}
      aria-labelledby={`inventario-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Datos de ejemplo para los productos
const productosData = [
  { 
    id: 1, 
    codigo: 'PROD-001', 
    nombre: 'Bombillos LED', 
    categoria: 'Eléctricos',
    stockActual: 48,
    stockMinimo: 20,
    ubicacion: 'Almacén Central',
    ultimaEntrada: '2025-08-10'
  },
  { 
    id: 2, 
    codigo: 'PROD-002', 
    nombre: 'Pintura Blanca 5Gal', 
    categoria: 'Pinturas',
    stockActual: 12,
    stockMinimo: 5,
    ubicacion: 'Almacén Central',
    ultimaEntrada: '2025-08-05'
  },
  { 
    id: 3, 
    codigo: 'PROD-003', 
    nombre: 'Tubo PVC 1/2"', 
    categoria: 'Plomería',
    stockActual: 95,
    stockMinimo: 30,
    ubicacion: 'Bodega Externa',
    ultimaEntrada: '2025-08-01'
  },
  { 
    id: 4, 
    codigo: 'PROD-004', 
    nombre: 'Cemento 50kg', 
    categoria: 'Construcción',
    stockActual: 4,
    stockMinimo: 10,
    ubicacion: 'Bodega Externa',
    ultimaEntrada: '2025-07-20'
  }
];

// Datos de ejemplo para categorías
const categoriasData = [
  { id: 1, nombre: 'Eléctricos', cantidad: 28 },
  { id: 2, nombre: 'Pinturas', cantidad: 15 },
  { id: 3, nombre: 'Plomería', cantidad: 32 },
  { id: 4, nombre: 'Construcción', cantidad: 9 },
  { id: 5, nombre: 'Herramientas', cantidad: 17 }
];

// Datos de ejemplo para líneas
const lineasData = [
  { id: 1, nombre: 'Iluminación', descripcion: 'Productos para iluminación', cantidad: 28 },
  { id: 2, nombre: 'Acabados', descripcion: 'Productos para acabados finales', cantidad: 15 },
  { id: 3, nombre: 'Instalaciones', descripcion: 'Productos para instalaciones', cantidad: 32 }
];

// Datos de ejemplo para grupos
const gruposData = [
  { id: 1, nombre: 'Bombillos', descripcion: 'Bombillos y focos', cantidad: 12 },
  { id: 2, nombre: 'Interruptores', descripcion: 'Interruptores y tomas', cantidad: 18 },
  { id: 3, nombre: 'Tuberías', descripcion: 'Tuberías y conectores', cantidad: 25 }
];

// Datos de ejemplo para marcas
const marcasData = [
  { id: 1, nombre: 'Luminex', descripcion: 'Productos de iluminación', activa: true },
  { id: 2, nombre: 'Pintuco', descripcion: 'Pinturas y recubrimientos', activa: true },
  { id: 3, nombre: 'Pavco', descripcion: 'Tuberías y accesorios', activa: true },
  { id: 4, nombre: 'Argos', descripcion: 'Cemento y concreto', activa: false }
];

// Datos de ejemplo para bodegas
const bodegasData = [
  { id: 1, codigo: 'BOD-CEN', nombre: 'Almacén Central', direccion: 'Calle Principal #123', responsable: 'Juan Pérez', activa: true },
  { id: 2, codigo: 'BOD-EXT', nombre: 'Bodega Externa', direccion: 'Calle 45 #12-34', responsable: 'María Rodríguez', activa: true },
  { id: 3, codigo: 'ALM-HER', nombre: 'Almacén de Herramientas', direccion: 'Carrera 23 #56-78', responsable: 'Pedro González', activa: true },
  { id: 4, codigo: 'DEP-MTO', nombre: 'Depósito de Mantenimiento', direccion: 'Av. Principal km 3', responsable: 'Ana Martínez', activa: true },
];

// Datos de ejemplo para traslados entre bodegas
const trasladosData = [
  { 
    id: 1, 
    referencia: 'TR-2025-001', 
    fecha: '2025-08-01', 
    bodegaOrigen: 'Almacén Central', 
    bodegaDestino: 'Bodega Externa', 
    responsable: 'Luis Ramírez',
    estado: 'Completado',
    productos: [{ nombre: 'Bombillos LED', cantidad: 10, unidad: 'Unidades' }],
    observaciones: 'Traslado mensual de insumos'
  },
  { 
    id: 2, 
    referencia: 'TR-2025-002', 
    fecha: '2025-08-05', 
    bodegaOrigen: 'Almacén de Herramientas', 
    bodegaDestino: 'Depósito de Mantenimiento', 
    responsable: 'Carlos Gómez',
    estado: 'En tránsito',
    productos: [
      { nombre: 'Destornilladores', cantidad: 5, unidad: 'Sets' },
      { nombre: 'Llaves ajustables', cantidad: 3, unidad: 'Unidades' }
    ],
    observaciones: 'Herramientas para mantenimiento de puertas'
  },
  { 
    id: 3, 
    referencia: 'TR-2025-003', 
    fecha: '2025-08-10', 
    bodegaOrigen: 'Bodega Externa', 
    bodegaDestino: 'Almacén Central', 
    responsable: 'Ana Martínez',
    estado: 'Pendiente',
    productos: [{ nombre: 'Tubos PVC 1/2"', cantidad: 20, unidad: 'Unidades' }],
    observaciones: 'Devolución por calidad'
  }
];

// Datos de ejemplo para movimientos de inventario
const movimientosData = [
  { 
    id: 1, 
    tipo: 'Entrada', 
    fecha: '2025-08-10', 
    producto: 'Bombillos LED', 
    cantidad: 25,
    responsable: 'Carlos Pérez',
    observacion: 'Compra según OC-2025-001'
  },
  { 
    id: 2, 
    tipo: 'Salida', 
    fecha: '2025-08-14', 
    producto: 'Tubo PVC 1/2"', 
    cantidad: 5,
    responsable: 'Juan Martínez',
    observacion: 'Reparación baños torre A'
  },
  { 
    id: 3, 
    tipo: 'Entrada', 
    fecha: '2025-08-05', 
    producto: 'Pintura Blanca 5Gal', 
    cantidad: 12,
    responsable: 'María Rodríguez',
    observacion: 'Transferencia desde bodega secundaria'
  },
  { 
    id: 4, 
    tipo: 'Salida', 
    fecha: '2025-08-12', 
    producto: 'Cemento 50kg', 
    cantidad: 8,
    responsable: 'Pedro López',
    observacion: 'Reparación andén entrada principal'
  },
  { 
    id: 5, 
    tipo: 'Entrada', 
    fecha: '2025-07-30', 
    producto: 'Bombillos LED', 
    cantidad: 15,
    responsable: 'Carlos Pérez',
    observacion: 'Compra según OC-2025-001'
  }
];

// Componente para la página de inventario
const InventarioPage = () => {
  // Estados para manejar las pestañas y diálogos
  const [tabValue, setTabValue] = useState(0);
  const [categoriasTabValue, setCategoriasTabValue] = useState(0);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [lineas, setLineas] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [traslados, setTraslados] = useState([]);
  const [movimientos, setMovimientos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estados para los diálogos
  const [openDialog, setOpenDialog] = useState(false);
  const [openCategoriaDialog, setOpenCategoriaDialog] = useState(false);
  const [openLineaDialog, setOpenLineaDialog] = useState(false);
  const [openGrupoDialog, setOpenGrupoDialog] = useState(false);
  const [openMarcaDialog, setOpenMarcaDialog] = useState(false);
  const [openBodegaDialog, setOpenBodegaDialog] = useState(false);
  const [openTrasladoDialog, setOpenTrasladoDialog] = useState(false);
  const [trasladoDetalleDialog, setTrasladoDetalleDialog] = useState(false);
  
  // Estados para items seleccionados
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedLinea, setSelectedLinea] = useState(null);
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [selectedMarca, setSelectedMarca] = useState(null);
  const [selectedBodega, setSelectedBodega] = useState(null);
  const [selectedTraslado, setSelectedTraslado] = useState(null);
  
  // Estados para formularios
  const [formCategoria, setFormCategoria] = useState({ nombre: '', cantidad: 0 });
  const [formLinea, setFormLinea] = useState({ nombre: '', descripcion: '', cantidad: 0 });
  const [formGrupo, setFormGrupo] = useState({ nombre: '', descripcion: '', cantidad: 0 });
  const [formMarca, setFormMarca] = useState({ nombre: '', descripcion: '', activa: true });
  const [formBodega, setFormBodega] = useState({ codigo: '', nombre: '', direccion: '', responsable: '', activa: true });
  const [formTraslado, setFormTraslado] = useState({ 
    fecha: new Date().toISOString().split('T')[0],
    bodegaOrigen: '',
    bodegaDestino: '',
    referencia: '',
    productos: [],
    responsable: '',
    observaciones: ''
  });
  
  // Estado para notificaciones
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Simular carga de datos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Simulando una llamada API con timeout
      setTimeout(() => {
        setProductos(productosData);
        setCategorias(categoriasData);
        setLineas(lineasData);
        setGrupos(gruposData);
        setMarcas(marcasData);
        setBodegas(bodegasData);
        setTraslados(trasladosData);
        setMovimientos(movimientosData);
        setLoading(false);
      }, 800);
    };

    fetchData();
  }, []);

  // Manejar cambios de pestañas
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Manejar cambios de pestañas en la sección de categorías
  const handleCategoriasTabChange = (event, newValue) => {
    setCategoriasTabValue(newValue);
  };

  // Manejar cambio en campo de búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handlers para diálogos de productos
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handlers para diálogos de categorías
  const handleOpenCategoriaDialog = (categoria = null) => {
    if (categoria) {
      setSelectedCategoria(categoria);
      setFormCategoria({ ...categoria });
    } else {
      setSelectedCategoria(null);
      setFormCategoria({ nombre: '', cantidad: 0 });
    }
    setOpenCategoriaDialog(true);
  };

  const handleCloseCategoriaDialog = () => {
    setOpenCategoriaDialog(false);
  };

  const handleSaveCategoria = () => {
    if (selectedCategoria) {
      // Editar existente
      setCategorias(categorias.map(cat => 
        cat.id === selectedCategoria.id ? { ...cat, ...formCategoria } : cat
      ));
      setSnackbar({ open: true, message: 'Categoría actualizada correctamente', severity: 'success' });
    } else {
      // Crear nueva
      const newCategoria = {
        id: categorias.length + 1,
        ...formCategoria
      };
      setCategorias([...categorias, newCategoria]);
      setSnackbar({ open: true, message: 'Categoría creada correctamente', severity: 'success' });
    }
    setOpenCategoriaDialog(false);
  };

  const handleDeleteCategoria = (id) => {
    setCategorias(categorias.filter(cat => cat.id !== id));
    setSnackbar({ open: true, message: 'Categoría eliminada correctamente', severity: 'success' });
  };

  // Handlers para diálogos de líneas
  const handleOpenLineaDialog = (linea = null) => {
    if (linea) {
      setSelectedLinea(linea);
      setFormLinea({ ...linea });
    } else {
      setSelectedLinea(null);
      setFormLinea({ nombre: '', descripcion: '', cantidad: 0 });
    }
    setOpenLineaDialog(true);
  };

  const handleCloseLineaDialog = () => {
    setOpenLineaDialog(false);
  };

  const handleSaveLinea = () => {
    if (selectedLinea) {
      // Editar existente
      setLineas(lineas.map(linea => 
        linea.id === selectedLinea.id ? { ...linea, ...formLinea } : linea
      ));
      setSnackbar({ open: true, message: 'Línea actualizada correctamente', severity: 'success' });
    } else {
      // Crear nueva
      const newLinea = {
        id: lineas.length + 1,
        ...formLinea
      };
      setLineas([...lineas, newLinea]);
      setSnackbar({ open: true, message: 'Línea creada correctamente', severity: 'success' });
    }
    setOpenLineaDialog(false);
  };

  const handleDeleteLinea = (id) => {
    setLineas(lineas.filter(linea => linea.id !== id));
    setSnackbar({ open: true, message: 'Línea eliminada correctamente', severity: 'success' });
  };

  // Handlers para diálogos de grupos
  const handleOpenGrupoDialog = (grupo = null) => {
    if (grupo) {
      setSelectedGrupo(grupo);
      setFormGrupo({ ...grupo });
    } else {
      setSelectedGrupo(null);
      setFormGrupo({ nombre: '', descripcion: '', cantidad: 0 });
    }
    setOpenGrupoDialog(true);
  };

  const handleCloseGrupoDialog = () => {
    setOpenGrupoDialog(false);
  };

  const handleSaveGrupo = () => {
    if (selectedGrupo) {
      // Editar existente
      setGrupos(grupos.map(grupo => 
        grupo.id === selectedGrupo.id ? { ...grupo, ...formGrupo } : grupo
      ));
      setSnackbar({ open: true, message: 'Grupo actualizado correctamente', severity: 'success' });
    } else {
      // Crear nuevo
      const newGrupo = {
        id: grupos.length + 1,
        ...formGrupo
      };
      setGrupos([...grupos, newGrupo]);
      setSnackbar({ open: true, message: 'Grupo creado correctamente', severity: 'success' });
    }
    setOpenGrupoDialog(false);
  };

  const handleDeleteGrupo = (id) => {
    setGrupos(grupos.filter(grupo => grupo.id !== id));
    setSnackbar({ open: true, message: 'Grupo eliminado correctamente', severity: 'success' });
  };

  // Handlers para diálogos de marcas
  const handleOpenMarcaDialog = (marca = null) => {
    if (marca) {
      setSelectedMarca(marca);
      setFormMarca({ ...marca });
    } else {
      setSelectedMarca(null);
      setFormMarca({ nombre: '', descripcion: '', activa: true });
    }
    setOpenMarcaDialog(true);
  };

  const handleCloseMarcaDialog = () => {
    setOpenMarcaDialog(false);
  };

  const handleSaveMarca = () => {
    if (selectedMarca) {
      // Editar existente
      setMarcas(marcas.map(marca => 
        marca.id === selectedMarca.id ? { ...marca, ...formMarca } : marca
      ));
      setSnackbar({ open: true, message: 'Marca actualizada correctamente', severity: 'success' });
    } else {
      // Crear nueva
      const newMarca = {
        id: marcas.length + 1,
        ...formMarca
      };
      setMarcas([...marcas, newMarca]);
      setSnackbar({ open: true, message: 'Marca creada correctamente', severity: 'success' });
    }
    setOpenMarcaDialog(false);
  };

  const handleDeleteMarca = (id) => {
    setMarcas(marcas.filter(marca => marca.id !== id));
    setSnackbar({ open: true, message: 'Marca eliminada correctamente', severity: 'success' });
  };

  // Handlers para diálogos de bodegas
  const handleOpenBodegaDialog = (bodega = null) => {
    if (bodega) {
      setSelectedBodega(bodega);
      setFormBodega({ ...bodega });
    } else {
      setSelectedBodega(null);
      setFormBodega({ codigo: '', nombre: '', direccion: '', responsable: '', activa: true });
    }
    setOpenBodegaDialog(true);
  };

  const handleCloseBodegaDialog = () => {
    setOpenBodegaDialog(false);
  };

  const handleSaveBodega = () => {
    if (selectedBodega) {
      // Editar existente
      setBodegas(bodegas.map(bodega => 
        bodega.id === selectedBodega.id ? { ...bodega, ...formBodega } : bodega
      ));
      setSnackbar({ open: true, message: 'Bodega actualizada correctamente', severity: 'success' });
    } else {
      // Crear nueva
      const newBodega = {
        id: bodegas.length + 1,
        ...formBodega
      };
      setBodegas([...bodegas, newBodega]);
      setSnackbar({ open: true, message: 'Bodega creada correctamente', severity: 'success' });
    }
    setOpenBodegaDialog(false);
  };

  const handleDeleteBodega = (id) => {
    setBodegas(bodegas.filter(bodega => bodega.id !== id));
    setSnackbar({ open: true, message: 'Bodega eliminada correctamente', severity: 'success' });
  };
  
  // Handlers para diálogos de traslados
  const handleOpenTrasladoDialog = (traslado = null) => {
    if (traslado) {
      setSelectedTraslado(traslado);
      setFormTraslado({ ...traslado });
    } else {
      setSelectedTraslado(null);
      setFormTraslado({ 
        fecha: new Date().toISOString().split('T')[0],
        bodegaOrigen: '',
        bodegaDestino: '',
        referencia: `TR-${new Date().getFullYear()}-${(traslados.length + 1).toString().padStart(3, '0')}`,
        productos: [],
        responsable: '',
        observaciones: '',
        estado: 'Pendiente'
      });
    }
    setOpenTrasladoDialog(true);
  };

  const handleCloseTrasladoDialog = () => {
    setOpenTrasladoDialog(false);
  };

  const handleSaveTraslado = () => {
    if (selectedTraslado) {
      // Editar existente
      setTraslados(traslados.map(traslado => 
        traslado.id === selectedTraslado.id ? { ...traslado, ...formTraslado } : traslado
      ));
      setSnackbar({ open: true, message: 'Traslado actualizado correctamente', severity: 'success' });
    } else {
      // Crear nuevo
      const newTraslado = {
        id: traslados.length + 1,
        ...formTraslado
      };
      setTraslados([...traslados, newTraslado]);
      setSnackbar({ open: true, message: 'Traslado creado correctamente', severity: 'success' });
    }
    setOpenTrasladoDialog(false);
  };

  const handleDeleteTraslado = (id) => {
    setTraslados(traslados.filter(traslado => traslado.id !== id));
    setSnackbar({ open: true, message: 'Traslado eliminado correctamente', severity: 'success' });
  };
  
  const handleOpenTrasladoDetalle = (traslado) => {
    setSelectedTraslado(traslado);
    setTrasladoDetalleDialog(true);
  };

  const handleCloseTrasladoDetalle = () => {
    setTrasladoDetalleDialog(false);
  };

  // Filtrar productos basados en el término de búsqueda
  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtener productos con bajo stock
  const productosAlerta = productos.filter(producto => 
    producto.stockActual <= producto.stockMinimo
  );

  // Componente para la pestaña de Productos
  const ProductosTab = () => (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" width="50%">
          <TextField 
            label="Buscar producto" 
            variant="outlined" 
            fullWidth
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Nuevo Producto
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell align="center">Stock Actual</TableCell>
              <TableCell align="center">Stock Mínimo</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Última Entrada</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProductos.map(row => (
                <TableRow 
                  key={row.id} 
                  hover
                  sx={{
                    backgroundColor: row.stockActual <= row.stockMinimo ? '#fff8e1' : 'inherit'
                  }}
                >
                  <TableCell>{row.codigo}</TableCell>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{row.categoria}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={row.stockActual} 
                      color={
                        row.stockActual <= row.stockMinimo ? 'warning' : 'primary'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">{row.stockMinimo}</TableCell>
                  <TableCell>{row.ubicacion}</TableCell>
                  <TableCell>{row.ultimaEntrada}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" title="Editar">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Ver código QR">
                      <QrCode2Icon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para agregar nuevo producto */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Nuevo Producto</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Código"
                fullWidth
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Categoría"
                fullWidth
                variant="outlined"
                select
                required
              >
                {categorias.map(cat => (
                  <MenuItem key={cat.id} value={cat.nombre}>
                    {cat.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nombre del Producto"
                fullWidth
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Stock Mínimo"
                fullWidth
                variant="outlined"
                type="number"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Stock Inicial"
                fullWidth
                variant="outlined"
                type="number"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Ubicación"
                fullWidth
                variant="outlined"
                select
                required
              >
                {bodegas.map(bodega => (
                  <MenuItem key={bodega.id} value={bodega.nombre}>
                    {bodega.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Marca"
                fullWidth
                variant="outlined"
                select
                required
              >
                {marcas.filter(marca => marca.activa).map(marca => (
                  <MenuItem key={marca.id} value={marca.nombre}>
                    {marca.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button variant="contained" color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>
    </>
  );

  // Componente para la pestaña de Movimientos
  const MovimientosTab = () => (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Registro de Movimientos</Typography>
        <Box>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            sx={{ mr: 1 }}
          >
            Entrada
          </Button>
          <Button 
            variant="outlined" 
            color="primary"
            startIcon={<AddIcon />}
          >
            Salida
          </Button>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell align="right">Cantidad</TableCell>
              <TableCell>Responsable</TableCell>
              <TableCell>Observación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movimientos.map(mov => (
              <TableRow key={mov.id} hover>
                <TableCell>
                  <Chip 
                    label={mov.tipo} 
                    color={mov.tipo === 'Entrada' ? 'success' : 'secondary'}
                    size="small" 
                  />
                </TableCell>
                <TableCell>{mov.fecha}</TableCell>
                <TableCell>{mov.producto}</TableCell>
                <TableCell align="right">{mov.cantidad}</TableCell>
                <TableCell>{mov.responsable}</TableCell>
                <TableCell>{mov.observacion}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  // Componente para la pestaña de Alertas
  const AlertasTab = () => (
    <>
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>Productos con Bajo Stock</Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Se muestran los productos que están por debajo del nivel mínimo recomendado.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {productosAlerta.map(producto => (
          <Grid item xs={12} md={6} lg={4} key={producto.id}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <WarningIcon />
                  </Avatar>
                  <Typography variant="h6">{producto.nombre}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="textSecondary">
                    Código: {producto.codigo}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Categoría: {producto.categoria}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">
                    Stock Actual: <Chip label={producto.stockActual} color="warning" size="small" />
                  </Typography>
                  <Typography variant="body1">
                    Mínimo Requerido: {producto.stockMinimo}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {productosAlerta.length === 0 && (
        <Box textAlign="center" my={4}>
          <InventoryIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
          <Typography variant="h6">¡Sin Alertas Activas!</Typography>
          <Typography variant="body1" color="textSecondary">
            Todos los productos tienen niveles de stock adecuados
          </Typography>
        </Box>
      )}
    </>
  );

  // Función para cerrar notificaciones
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Gestión de Inventario</Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Productos</Typography>
              <Typography variant="h4">{productos.length}</Typography>
              <Typography variant="body2" color="textSecondary">Total registrados</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Categorías</Typography>
              <Typography variant="h4">{categorias.length}</Typography>
              <Typography variant="body2" color="textSecondary">Clasificaciones</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Alertas</Typography>
              <Typography variant="h4">{productosAlerta.length}</Typography>
              <Typography variant="body2" color="textSecondary">Productos bajo mínimo</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Movimientos</Typography>
              <Typography variant="h4">{movimientos.length}</Typography>
              <Typography variant="body2" color="textSecondary">Últimos 30 días</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Pestañas de contenido */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Productos" />
          <Tab label="Movimientos" />
          <Tab label="Alertas de Stock" />
        </Tabs>
        <Divider />
        
        <TabPanel value={tabValue} index={0}>
          <ProductosTab />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <MovimientosTab />
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <AlertasTab />
        </TabPanel>
      </Paper>

      {/* Sección de Clasificación de Productos */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Clasificación de Productos</Typography>
        </Box>

        <Tabs
          value={categoriasTabValue}
          onChange={handleCategoriasTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          <Tab label="Categorías" />
          <Tab label="Líneas" />
          <Tab label="Grupos" />
          <Tab label="Marcas" />
        </Tabs>
        <Divider sx={{ mb: 2 }} />
        
        {/* Categorías Tab */}
        {categoriasTabValue === 0 && (
          <>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                size="small"
                onClick={() => handleOpenCategoriaDialog()}
              >
                Nueva Categoría
              </Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell align="center">Productos</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categorias.map((categoria) => (
                    <TableRow key={categoria.id} hover>
                      <TableCell>{categoria.nombre}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={categoria.cantidad} 
                          color="primary" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => handleOpenCategoriaDialog(categoria)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteCategoria(categoria.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Diálogo para crear/editar categoría */}
            <Dialog 
              open={openCategoriaDialog} 
              onClose={handleCloseCategoriaDialog} 
              maxWidth="sm" 
              fullWidth
            >
              <DialogTitle>
                {selectedCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      label="Nombre de la Categoría"
                      fullWidth
                      variant="outlined"
                      required
                      value={formCategoria.nombre}
                      onChange={(e) => setFormCategoria({
                        ...formCategoria,
                        nombre: e.target.value
                      })}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseCategoriaDialog}>Cancelar</Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSaveCategoria}
                >
                  Guardar
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {/* Líneas Tab */}
        {categoriasTabValue === 1 && (
          <>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                size="small"
                onClick={() => handleOpenLineaDialog()}
              >
                Nueva Línea
              </Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell align="center">Productos</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lineas.map((linea) => (
                    <TableRow key={linea.id} hover>
                      <TableCell>{linea.nombre}</TableCell>
                      <TableCell>{linea.descripcion}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={linea.cantidad} 
                          color="primary" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => handleOpenLineaDialog(linea)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteLinea(linea.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Diálogo para crear/editar línea */}
            <Dialog 
              open={openLineaDialog} 
              onClose={handleCloseLineaDialog} 
              maxWidth="sm" 
              fullWidth
            >
              <DialogTitle>
                {selectedLinea ? 'Editar Línea' : 'Nueva Línea'}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      label="Nombre de la Línea"
                      fullWidth
                      variant="outlined"
                      required
                      value={formLinea.nombre}
                      onChange={(e) => setFormLinea({
                        ...formLinea,
                        nombre: e.target.value
                      })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Descripción"
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={2}
                      value={formLinea.descripcion}
                      onChange={(e) => setFormLinea({
                        ...formLinea,
                        descripcion: e.target.value
                      })}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseLineaDialog}>Cancelar</Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSaveLinea}
                >
                  Guardar
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {/* Grupos Tab */}
        {categoriasTabValue === 2 && (
          <>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                size="small"
                onClick={() => handleOpenGrupoDialog()}
              >
                Nuevo Grupo
              </Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell align="center">Productos</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {grupos.map((grupo) => (
                    <TableRow key={grupo.id} hover>
                      <TableCell>{grupo.nombre}</TableCell>
                      <TableCell>{grupo.descripcion}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={grupo.cantidad} 
                          color="primary" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => handleOpenGrupoDialog(grupo)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteGrupo(grupo.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Diálogo para crear/editar grupo */}
            <Dialog 
              open={openGrupoDialog} 
              onClose={handleCloseGrupoDialog} 
              maxWidth="sm" 
              fullWidth
            >
              <DialogTitle>
                {selectedGrupo ? 'Editar Grupo' : 'Nuevo Grupo'}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      label="Nombre del Grupo"
                      fullWidth
                      variant="outlined"
                      required
                      value={formGrupo.nombre}
                      onChange={(e) => setFormGrupo({
                        ...formGrupo,
                        nombre: e.target.value
                      })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Descripción"
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={2}
                      value={formGrupo.descripcion}
                      onChange={(e) => setFormGrupo({
                        ...formGrupo,
                        descripcion: e.target.value
                      })}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseGrupoDialog}>Cancelar</Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSaveGrupo}
                >
                  Guardar
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {/* Marcas Tab */}
        {categoriasTabValue === 3 && (
          <>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                size="small"
                onClick={() => handleOpenMarcaDialog()}
              >
                Nueva Marca
              </Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell align="center">Estado</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {marcas.map((marca) => (
                    <TableRow key={marca.id} hover>
                      <TableCell>{marca.nombre}</TableCell>
                      <TableCell>{marca.descripcion}</TableCell>
                      <TableCell align="center">
                        {marca.activa ? 
                          <Chip label="Activa" color="success" size="small" /> : 
                          <Chip label="Inactiva" color="default" size="small" />
                        }
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => handleOpenMarcaDialog(marca)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteMarca(marca.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Diálogo para crear/editar marca */}
            <Dialog 
              open={openMarcaDialog} 
              onClose={handleCloseMarcaDialog} 
              maxWidth="sm" 
              fullWidth
            >
              <DialogTitle>
                {selectedMarca ? 'Editar Marca' : 'Nueva Marca'}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      label="Nombre de la Marca"
                      fullWidth
                      variant="outlined"
                      required
                      value={formMarca.nombre}
                      onChange={(e) => setFormMarca({
                        ...formMarca,
                        nombre: e.target.value
                      })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Descripción"
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={2}
                      value={formMarca.descripcion}
                      onChange={(e) => setFormMarca({
                        ...formMarca,
                        descripcion: e.target.value
                      })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formMarca.activa}
                          onChange={(e) => setFormMarca({
                            ...formMarca,
                            activa: e.target.checked
                          })}
                          color="primary"
                        />
                      }
                      label="Marca Activa"
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseMarcaDialog}>Cancelar</Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleSaveMarca}
                >
                  Guardar
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Paper>
      
      {/* Componente de Gestión de Almacenes */}
      <GestionAlmacenes 
        bodegas={bodegas}
        traslados={traslados}
        setBodegas={setBodegas}
        setTraslados={setTraslados}
        setSnackbar={setSnackbar}
        openBodegaDialog={openBodegaDialog}
        openTrasladoDialog={openTrasladoDialog}
        selectedBodega={selectedBodega}
        selectedTraslado={selectedTraslado}
        formBodega={formBodega}
        formTraslado={formTraslado}
        setFormBodega={setFormBodega}
        setFormTraslado={setFormTraslado}
        trasladoDetalleDialog={trasladoDetalleDialog}
        handleOpenBodegaDialog={handleOpenBodegaDialog}
        handleCloseBodegaDialog={handleCloseBodegaDialog}
        handleSaveBodega={handleSaveBodega}
        handleDeleteBodega={handleDeleteBodega}
        handleOpenTrasladoDialog={handleOpenTrasladoDialog}
        handleCloseTrasladoDialog={handleCloseTrasladoDialog}
        handleSaveTraslado={handleSaveTraslado}
        handleDeleteTraslado={handleDeleteTraslado}
        handleOpenTrasladoDetalle={handleOpenTrasladoDetalle}
        handleCloseTrasladoDetalle={handleCloseTrasladoDetalle}
      />

      {/* Notificación de éxito o error */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InventarioPage;
