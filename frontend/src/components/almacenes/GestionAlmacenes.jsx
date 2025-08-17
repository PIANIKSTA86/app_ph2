import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Divider,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  Warehouse as WarehouseIcon,
  SwapHoriz as SwapHorizIcon,
} from '@mui/icons-material';

const GestionAlmacenes = ({ 
  bodegas, 
  traslados, 
  setBodegas, 
  setTraslados, 
  setSnackbar,
  openBodegaDialog,
  openTrasladoDialog,
  selectedBodega,
  selectedTraslado,
  formBodega,
  formTraslado,
  setFormBodega,
  setFormTraslado,
  trasladoDetalleDialog,
  handleOpenBodegaDialog,
  handleCloseBodegaDialog,
  handleSaveBodega,
  handleDeleteBodega,
  handleOpenTrasladoDialog,
  handleCloseTrasladoDialog,
  handleSaveTraslado,
  handleDeleteTraslado,
  handleOpenTrasladoDetalle,
  handleCloseTrasladoDetalle
}) => {
  const [almacenesTabValue, setAlmacenesTabValue] = useState(0);

  const handleAlmacenesTabChange = (event, newValue) => {
    setAlmacenesTabValue(newValue);
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Gestión de Almacenes</Typography>
      </Box>

      <Tabs
        value={almacenesTabValue}
        onChange={handleAlmacenesTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        <Tab icon={<WarehouseIcon />} label="Bodegas" />
        <Tab icon={<SwapHorizIcon />} label="Traslados" />
      </Tabs>
      <Divider sx={{ mb: 2 }} />

      {/* Bodegas Tab */}
      {almacenesTabValue === 0 && (
        <>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
              onClick={() => handleOpenBodegaDialog()}
            >
              Nueva Bodega
            </Button>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>Responsable</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bodegas.map((bodega) => (
                  <TableRow key={bodega.id} hover>
                    <TableCell>{bodega.codigo}</TableCell>
                    <TableCell>{bodega.nombre}</TableCell>
                    <TableCell>{bodega.direccion}</TableCell>
                    <TableCell>{bodega.responsable}</TableCell>
                    <TableCell align="center">
                      {bodega.activa ? 
                        <Chip label="Activa" color="success" size="small" /> : 
                        <Chip label="Inactiva" color="default" size="small" />
                      }
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => handleOpenBodegaDialog(bodega)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteBodega(bodega.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Diálogo para crear/editar bodega */}
          <Dialog 
            open={openBodegaDialog} 
            onClose={handleCloseBodegaDialog} 
            maxWidth="sm" 
            fullWidth
          >
            <DialogTitle>
              {selectedBodega ? 'Editar Bodega' : 'Nueva Bodega'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Código"
                    fullWidth
                    variant="outlined"
                    required
                    value={formBodega.codigo}
                    onChange={(e) => setFormBodega({
                      ...formBodega,
                      codigo: e.target.value
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField
                    label="Nombre"
                    fullWidth
                    variant="outlined"
                    required
                    value={formBodega.nombre}
                    onChange={(e) => setFormBodega({
                      ...formBodega,
                      nombre: e.target.value
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Dirección"
                    fullWidth
                    variant="outlined"
                    value={formBodega.direccion}
                    onChange={(e) => setFormBodega({
                      ...formBodega,
                      direccion: e.target.value
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Responsable"
                    fullWidth
                    variant="outlined"
                    required
                    value={formBodega.responsable}
                    onChange={(e) => setFormBodega({
                      ...formBodega,
                      responsable: e.target.value
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formBodega.activa}
                        onChange={(e) => setFormBodega({
                          ...formBodega,
                          activa: e.target.checked
                        })}
                        color="primary"
                      />
                    }
                    label="Bodega Activa"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseBodegaDialog}>Cancelar</Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSaveBodega}
              >
                Guardar
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {/* Traslados Tab */}
      {almacenesTabValue === 1 && (
        <>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              size="small"
              onClick={() => handleOpenTrasladoDialog()}
            >
              Nuevo Traslado
            </Button>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Referencia</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Origen</TableCell>
                  <TableCell>Destino</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell>Responsable</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {traslados.map((traslado) => (
                  <TableRow key={traslado.id} hover>
                    <TableCell>{traslado.referencia}</TableCell>
                    <TableCell>{traslado.fecha}</TableCell>
                    <TableCell>{traslado.bodegaOrigen}</TableCell>
                    <TableCell>{traslado.bodegaDestino}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={traslado.estado} 
                        color={
                          traslado.estado === 'Completado' ? 'success' : 
                          traslado.estado === 'En tránsito' ? 'primary' : 'warning'
                        } 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{traslado.responsable}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver detalle">
                        <IconButton size="small" onClick={() => handleOpenTrasladoDetalle(traslado)}>
                          <InventoryIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => handleOpenTrasladoDialog(traslado)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton size="small" color="error" onClick={() => handleDeleteTraslado(traslado.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Diálogo para crear/editar traslado */}
          <Dialog 
            open={openTrasladoDialog} 
            onClose={handleCloseTrasladoDialog} 
            maxWidth="md" 
            fullWidth
          >
            <DialogTitle>
              {selectedTraslado ? 'Editar Traslado' : 'Nuevo Traslado'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Referencia"
                    fullWidth
                    variant="outlined"
                    required
                    disabled={selectedTraslado !== null}
                    value={formTraslado.referencia}
                    onChange={(e) => setFormTraslado({
                      ...formTraslado,
                      referencia: e.target.value
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Fecha"
                    type="date"
                    fullWidth
                    variant="outlined"
                    required
                    value={formTraslado.fecha}
                    onChange={(e) => setFormTraslado({
                      ...formTraslado,
                      fecha: e.target.value
                    })}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="bodega-origen-label">Bodega de Origen</InputLabel>
                    <Select
                      labelId="bodega-origen-label"
                      label="Bodega de Origen"
                      value={formTraslado.bodegaOrigen || ''}
                      onChange={(e) => setFormTraslado({
                        ...formTraslado,
                        bodegaOrigen: e.target.value
                      })}
                    >
                      {bodegas.map(bodega => (
                        <MenuItem key={bodega.id} value={bodega.nombre}>
                          {bodega.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="bodega-destino-label">Bodega de Destino</InputLabel>
                    <Select
                      labelId="bodega-destino-label"
                      label="Bodega de Destino"
                      value={formTraslado.bodegaDestino || ''}
                      onChange={(e) => setFormTraslado({
                        ...formTraslado,
                        bodegaDestino: e.target.value
                      })}
                    >
                      {bodegas
                        .filter(bodega => bodega.nombre !== formTraslado.bodegaOrigen)
                        .map(bodega => (
                          <MenuItem key={bodega.id} value={bodega.nombre}>
                            {bodega.nombre}
                          </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Responsable"
                    fullWidth
                    variant="outlined"
                    required
                    value={formTraslado.responsable}
                    onChange={(e) => setFormTraslado({
                      ...formTraslado,
                      responsable: e.target.value
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Observaciones"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={3}
                    value={formTraslado.observaciones}
                    onChange={(e) => setFormTraslado({
                      ...formTraslado,
                      observaciones: e.target.value
                    })}
                  />
                </Grid>
                {selectedTraslado && (
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="estado-traslado-label">Estado</InputLabel>
                      <Select
                        labelId="estado-traslado-label"
                        label="Estado"
                        value={formTraslado.estado || 'Pendiente'}
                        onChange={(e) => setFormTraslado({
                          ...formTraslado,
                          estado: e.target.value
                        })}
                      >
                        <MenuItem value="Pendiente">Pendiente</MenuItem>
                        <MenuItem value="En tránsito">En tránsito</MenuItem>
                        <MenuItem value="Completado">Completado</MenuItem>
                        <MenuItem value="Cancelado">Cancelado</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseTrasladoDialog}>Cancelar</Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSaveTraslado}
              >
                Guardar
              </Button>
            </DialogActions>
          </Dialog>

          {/* Diálogo para ver detalle de traslado */}
          <Dialog 
            open={trasladoDetalleDialog} 
            onClose={handleCloseTrasladoDetalle} 
            maxWidth="md" 
            fullWidth
          >
            {selectedTraslado && (
              <>
                <DialogTitle>
                  Detalle de Traslado: {selectedTraslado.referencia}
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Fecha</Typography>
                      <Typography variant="body2" gutterBottom>{selectedTraslado.fecha}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Estado</Typography>
                      <Chip 
                        label={selectedTraslado.estado} 
                        color={
                          selectedTraslado.estado === 'Completado' ? 'success' : 
                          selectedTraslado.estado === 'En tránsito' ? 'primary' : 'warning'
                        } 
                        size="small" 
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Bodega de Origen</Typography>
                      <Typography variant="body2" gutterBottom>{selectedTraslado.bodegaOrigen}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2">Bodega de Destino</Typography>
                      <Typography variant="body2" gutterBottom>{selectedTraslado.bodegaDestino}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Responsable</Typography>
                      <Typography variant="body2" gutterBottom>{selectedTraslado.responsable}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">Observaciones</Typography>
                      <Typography variant="body2" gutterBottom>{selectedTraslado.observaciones || 'Sin observaciones'}</Typography>
                    </Grid>

                    <Grid item xs={12} mt={2}>
                      <Typography variant="subtitle1" gutterBottom>Productos Trasladados</Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Producto</TableCell>
                              <TableCell align="right">Cantidad</TableCell>
                              <TableCell>Unidad</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {(selectedTraslado.productos && selectedTraslado.productos.length > 0) ? (
                              selectedTraslado.productos.map((producto, index) => (
                                <TableRow key={index}>
                                  <TableCell>{producto.nombre}</TableCell>
                                  <TableCell align="right">{producto.cantidad}</TableCell>
                                  <TableCell>{producto.unidad}</TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={3} align="center">No hay productos registrados en este traslado</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseTrasladoDetalle}>Cerrar</Button>
                </DialogActions>
              </>
            )}
          </Dialog>
        </>
      )}
    </Paper>
  );
};

export default GestionAlmacenes;
