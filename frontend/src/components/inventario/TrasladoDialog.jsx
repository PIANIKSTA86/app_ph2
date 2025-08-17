import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  Typography,
  Alert
} from '@mui/material';
import PropTypes from 'prop-types';

// Componente para gestionar traslados entre bodegas
const TrasladoDialog = ({ open, onClose, onSave, traslado, productos, bodegas, isLoading }) => {
  const isEditing = Boolean(traslado?.id);

  const initialFormState = {
    fecha: new Date().toISOString().split('T')[0],
    producto_id: '',
    bodega_origen_id: '',
    bodega_destino_id: '',
    cantidad: '',
    notas: '',
    ...traslado
  };

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [productosDisponibles, setProductosDisponibles] = useState([]);

  // Cargar datos cuando estamos editando
  useEffect(() => {
    if (traslado) {
      setForm({
        fecha: traslado.fecha || new Date().toISOString().split('T')[0],
        producto_id: traslado.producto_id || '',
        bodega_origen_id: traslado.bodega_origen_id || '',
        bodega_destino_id: traslado.bodega_destino_id || '',
        cantidad: traslado.cantidad || '',
        notas: traslado.notas || '',
        ...traslado
      });
    } else {
      setForm(initialFormState);
    }
    setErrors({});
    setFormError('');
  }, [traslado]);

  // Filtrar productos disponibles según la bodega de origen seleccionada
  useEffect(() => {
    if (form.bodega_origen_id && productos) {
      const productosFiltrados = productos.filter(
        producto => producto.bodega_id === form.bodega_origen_id && producto.cantidad_disponible > 0
      );
      setProductosDisponibles(productosFiltrados);
      
      // Si el producto seleccionado ya no está disponible en la bodega, limpiarlo
      if (form.producto_id) {
        const productoExiste = productosFiltrados.some(p => p.id === form.producto_id);
        if (!productoExiste) {
          setForm(prev => ({
            ...prev,
            producto_id: '',
            cantidad: ''
          }));
        }
      }
    } else {
      setProductosDisponibles([]);
      setForm(prev => ({
        ...prev,
        producto_id: '',
        cantidad: ''
      }));
    }
  }, [form.bodega_origen_id, productos]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Validación especial para campos numéricos
    if (name === 'cantidad') {
      // Permitir solo números enteros positivos
      if (value === '' || (!isNaN(value) && parseInt(value) >= 0)) {
        setForm(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Para bodega destino, asegurar que no sea igual a la bodega origen
    if (name === 'bodega_origen_id' && form.bodega_destino_id === value) {
      setForm(prev => ({
        ...prev,
        [name]: value,
        bodega_destino_id: ''
      }));
    }
    
    if (name === 'bodega_destino_id' && form.bodega_origen_id === value) {
      setErrors(prev => ({
        ...prev,
        bodega_destino_id: 'La bodega destino no puede ser igual a la bodega origen'
      }));
    } else if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Validaciones de campos obligatorios
    if (!form.fecha) newErrors.fecha = 'La fecha es obligatoria';
    if (!form.producto_id) newErrors.producto_id = 'El producto es obligatorio';
    if (!form.bodega_origen_id) newErrors.bodega_origen_id = 'La bodega origen es obligatoria';
    if (!form.bodega_destino_id) newErrors.bodega_destino_id = 'La bodega destino es obligatoria';
    if (!form.cantidad) newErrors.cantidad = 'La cantidad es obligatoria';
    
    // Validación para bodega origen y destino
    if (form.bodega_origen_id && form.bodega_destino_id && form.bodega_origen_id === form.bodega_destino_id) {
      newErrors.bodega_destino_id = 'La bodega destino no puede ser igual a la bodega origen';
    }
    
    // Validación para cantidad máxima
    if (form.producto_id && form.cantidad) {
      const productoSeleccionado = productosDisponibles.find(p => p.id === form.producto_id);
      if (productoSeleccionado && parseInt(form.cantidad) > productoSeleccionado.cantidad_disponible) {
        newErrors.cantidad = `La cantidad no puede ser mayor a la disponible (${productoSeleccionado.cantidad_disponible})`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      if (validate()) {
        // Convertir valores numéricos de string a número
        const formattedForm = {
          ...form,
          cantidad: parseInt(form.cantidad)
        };

        onSave(formattedForm);
      }
    } catch (error) {
      console.error('Error al procesar el formulario:', error);
      setFormError('Ocurrió un error al procesar el formulario. Por favor, inténtelo de nuevo.');
    }
  };

  // Obtener la cantidad máxima disponible para el producto seleccionado
  const getCantidadMaxima = () => {
    if (form.producto_id) {
      const productoSeleccionado = productosDisponibles.find(p => p.id === form.producto_id);
      return productoSeleccionado ? productoSeleccionado.cantidad_disponible : 0;
    }
    return 0;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? 'Editar Traslado' : 'Nuevo Traslado entre Bodegas'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Fecha"
                name="fecha"
                type="date"
                value={form.fecha}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.fecha)}
                helperText={errors.fecha}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" error={Boolean(errors.bodega_origen_id)}>
                <InputLabel id="bodega-origen-label">Bodega Origen *</InputLabel>
                <Select
                  labelId="bodega-origen-label"
                  name="bodega_origen_id"
                  value={form.bodega_origen_id}
                  onChange={handleChange}
                  label="Bodega Origen *"
                  required
                >
                  <MenuItem value="">
                    <em>Seleccione una bodega</em>
                  </MenuItem>
                  {bodegas?.map((bodega) => (
                    <MenuItem key={bodega.id} value={bodega.id}>{bodega.nombre}</MenuItem>
                  ))}
                </Select>
                {errors.bodega_origen_id && (
                  <Typography variant="caption" color="error">
                    {errors.bodega_origen_id}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" error={Boolean(errors.producto_id)}>
                <InputLabel id="producto-label">Producto *</InputLabel>
                <Select
                  labelId="producto-label"
                  name="producto_id"
                  value={form.producto_id}
                  onChange={handleChange}
                  label="Producto *"
                  required
                  disabled={!form.bodega_origen_id || productosDisponibles.length === 0}
                >
                  <MenuItem value="">
                    <em>Seleccione un producto</em>
                  </MenuItem>
                  {productosDisponibles.map((producto) => (
                    <MenuItem key={producto.id} value={producto.id}>
                      {producto.codigo} - {producto.nombre} (Disp: {producto.cantidad_disponible})
                    </MenuItem>
                  ))}
                </Select>
                {errors.producto_id && (
                  <Typography variant="caption" color="error">
                    {errors.producto_id}
                  </Typography>
                )}
                {form.bodega_origen_id && productosDisponibles.length === 0 && (
                  <Typography variant="caption" color="error">
                    No hay productos disponibles en esta bodega
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" error={Boolean(errors.bodega_destino_id)}>
                <InputLabel id="bodega-destino-label">Bodega Destino *</InputLabel>
                <Select
                  labelId="bodega-destino-label"
                  name="bodega_destino_id"
                  value={form.bodega_destino_id}
                  onChange={handleChange}
                  label="Bodega Destino *"
                  required
                  disabled={!form.bodega_origen_id}
                >
                  <MenuItem value="">
                    <em>Seleccione una bodega</em>
                  </MenuItem>
                  {bodegas?.filter(bodega => bodega.id !== form.bodega_origen_id).map((bodega) => (
                    <MenuItem key={bodega.id} value={bodega.id}>{bodega.nombre}</MenuItem>
                  ))}
                </Select>
                {errors.bodega_destino_id && (
                  <Typography variant="caption" color="error">
                    {errors.bodega_destino_id}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Cantidad"
                name="cantidad"
                value={form.cantidad}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={Boolean(errors.cantidad)}
                helperText={errors.cantidad || `Máximo: ${getCantidadMaxima()}`}
                required
                type="number"
                inputProps={{ min: 1, max: getCantidadMaxima() }}
                disabled={!form.producto_id}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Notas"
                name="notas"
                value={form.notas}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
                rows={3}
              />
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

TrasladoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  traslado: PropTypes.object,
  productos: PropTypes.array,
  bodegas: PropTypes.array,
  isLoading: PropTypes.bool
};

export default TrasladoDialog;
