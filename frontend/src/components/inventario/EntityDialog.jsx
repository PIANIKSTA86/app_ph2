import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  CircularProgress
} from '@mui/material';
import PropTypes from 'prop-types';

// Componente genérico para formularios de entidades básicas (categoría, línea, etc.)
const EntityDialog = ({ 
  open, 
  onClose, 
  onSave, 
  entity, 
  title, 
  entityName, 
  isLoading,
  includeDescripcion = false,
  includeActivo = true
}) => {
  const isEditing = Boolean(entity?.id);
  
  const initialFormState = {
    nombre: '',
    descripcion: '',
    activo: true,
    ...entity
  };

  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  // Cargar datos cuando estamos editando
  useEffect(() => {
    if (entity) {
      setForm({
        nombre: entity.nombre || '',
        descripcion: entity.descripcion || '',
        activo: entity.activo !== undefined ? entity.activo : true,
        ...entity
      });
    } else {
      setForm(initialFormState);
    }
    setErrors({});
  }, [entity]);

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
    
    if (!form.nombre.trim()) newErrors.nombre = `El nombre ${entityName ? `de ${entityName}` : ''} es obligatorio`;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSave({
        ...form,
        id: entity?.id // Incluir ID si estamos editando
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {title || (isEditing ? `Editar ${entityName || 'elemento'}` : `Nueva ${entityName || 'elemento'}`)}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
                autoFocus
              />
            </Grid>
            
            {includeDescripcion && (
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
            )}

            {includeActivo && (
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.activo}
                      onChange={handleChange}
                      name="activo"
                      color="primary"
                    />
                  }
                  label="Activo"
                />
              </Grid>
            )}
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

EntityDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  entity: PropTypes.object,
  title: PropTypes.string,
  entityName: PropTypes.string,
  isLoading: PropTypes.bool,
  includeDescripcion: PropTypes.bool,
  includeActivo: PropTypes.bool
};

export default EntityDialog;
