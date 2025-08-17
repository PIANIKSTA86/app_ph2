import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import PropTypes from 'prop-types';

// Componente para el formulario de productos
const ProductoDialog = ({ open, onClose, onSave, producto, categorias, lineas, grupos, marcas, bodegas, isLoading }) => {
  const isEditing = Boolean(producto?.id);
  
  const initialFormState = {
    codigo: '',
    nombre: '',
    categoriaId: '',
    lineaId: '',
    grupoId: '',
    marcaId: '',
    bodegaId: '',
    descripcion: '',
    stockActual: 0,
    stockMinimo: 0,
    precioCompra: 0,
    precioVenta: 0,
    aplicaIva: true,
    activo: true
  };

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // Cargar datos del producto cuando estamos editando
  useEffect(() => {
    if (producto) {
      setForm({
        codigo: producto.codigo || '',
        nombre: producto.nombre || '',
        categoriaId: producto.categoriaId || '',
        lineaId: producto.lineaId || '',
        grupoId: producto.grupoId || '',
        marcaId: producto.marcaId || '',
        bodegaId: producto.bodegaId || '',
        descripcion: producto.descripcion || '',
        stockActual: producto.stockActual || 0,
        stockMinimo: producto.stockMinimo || 0,
        precioCompra: producto.precioCompra || 0,
        precioVenta: producto.precioVenta || 0,
        aplicaIva: producto.aplicaIva !== undefined ? producto.aplicaIva : true,
        activo: producto.activo !== undefined ? producto.activo : true
      });
    } else {
      setForm(initialFormState);
    }
    setErrors({});
  }, [producto]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Limpiar error cuando el campo se modifica
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!form.codigo.trim()) newErrors.codigo = 'El código es obligatorio';
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!form.categoriaId) newErrors.categoriaId = 'La categoría es obligatoria';
    if (form.stockMinimo < 0) newErrors.stockMinimo = 'El stock mínimo no puede ser negativo';
    if (form.precioCompra < 0) newErrors.precioCompra = 'El precio de compra no puede ser negativo';
    if (form.precioVenta < 0) newErrors.precioVenta = 'El precio de venta no puede ser negativo';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSave({
        ...form,
        id: producto?.id, // Incluir ID si estamos editando
        stockActual: Number(form.stockActual),
        stockMinimo: Number(form.stockMinimo),
        precioCompra: Number(form.precioCompra),
        precioVenta: Number(form.precioVenta)
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Código"
                name="codigo"
                value={form.codigo}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={Boolean(errors.codigo)}
                helperText={errors.codigo}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={Boolean(errors.nombre)}
                helperText={errors.nombre}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" error={Boolean(errors.categoriaId)} required>
                <InputLabel>Categoría</InputLabel>
                <Select
                  name="categoriaId"
                  value={form.categoriaId}
                  onChange={handleChange}
                  label="Categoría"
                >
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categoriaId && <FormHelperText>{errors.categoriaId}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Línea</InputLabel>
                <Select
                  name="lineaId"
                  value={form.lineaId}
                  onChange={handleChange}
                  label="Línea"
                >
                  <MenuItem value="">
                    <em>Ninguna</em>
                  </MenuItem>
                  {lineas.map((linea) => (
                    <MenuItem key={linea.id} value={linea.id}>
                      {linea.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Grupo</InputLabel>
                <Select
                  name="grupoId"
                  value={form.grupoId}
                  onChange={handleChange}
                  label="Grupo"
                >
                  <MenuItem value="">
                    <em>Ninguno</em>
                  </MenuItem>
                  {grupos.map((grupo) => (
                    <MenuItem key={grupo.id} value={grupo.id}>
                      {grupo.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Marca</InputLabel>
                <Select
                  name="marcaId"
                  value={form.marcaId}
                  onChange={handleChange}
                  label="Marca"
                >
                  <MenuItem value="">
                    <em>Ninguna</em>
                  </MenuItem>
                  {marcas.map((marca) => (
                    <MenuItem key={marca.id} value={marca.id}>
                      {marca.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Bodega</InputLabel>
                <Select
                  name="bodegaId"
                  value={form.bodegaId}
                  onChange={handleChange}
                  label="Bodega"
                >
                  <MenuItem value="">
                    <em>Ninguna</em>
                  </MenuItem>
                  {bodegas.map((bodega) => (
                    <MenuItem key={bodega.id} value={bodega.id}>
                      {bodega.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Descripción"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Stock Actual"
                name="stockActual"
                type="number"
                value={form.stockActual}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  inputProps: { min: 0 }
                }}
                disabled={isEditing} // El stock actual solo se puede editar mediante movimientos si ya existe el producto
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Stock Mínimo"
                name="stockMinimo"
                type="number"
                value={form.stockMinimo}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={Boolean(errors.stockMinimo)}
                helperText={errors.stockMinimo}
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Precio de Compra"
                name="precioCompra"
                type="number"
                value={form.precioCompra}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={Boolean(errors.precioCompra)}
                helperText={errors.precioCompra}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Precio de Venta"
                name="precioVenta"
                type="number"
                value={form.precioVenta}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={Boolean(errors.precioVenta)}
                helperText={errors.precioVenta}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  inputProps: { min: 0, step: 0.01 }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Aplica IVA</InputLabel>
                <Select
                  name="aplicaIva"
                  value={form.aplicaIva}
                  onChange={handleChange}
                  label="Aplica IVA"
                >
                  <MenuItem value={true}>Sí</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Estado</InputLabel>
                <Select
                  name="activo"
                  value={form.activo}
                  onChange={handleChange}
                  label="Estado"
                >
                  <MenuItem value={true}>Activo</MenuItem>
                  <MenuItem value={false}>Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : isEditing ? 'Actualizar' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

ProductoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  producto: PropTypes.object,
  categorias: PropTypes.array.isRequired,
  lineas: PropTypes.array.isRequired,
  grupos: PropTypes.array.isRequired,
  marcas: PropTypes.array.isRequired,
  bodegas: PropTypes.array.isRequired,
  isLoading: PropTypes.bool
};

ProductoDialog.defaultProps = {
  producto: null,
  categorias: [],
  lineas: [],
  grupos: [],
  marcas: [],
  bodegas: [],
  isLoading: false
};

export default ProductoDialog;
