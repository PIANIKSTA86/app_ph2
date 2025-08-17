import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Box,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PropTypes from 'prop-types';

// Componente para mostrar traslados entre bodegas
const TrasladosTable = ({ 
  traslados,
  loading,
  onView,
  onDelete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredTraslados, setFilteredTraslados] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [trasladoToDelete, setTrasladoToDelete] = useState(null);

  // Filtrar traslados según término de búsqueda
  useEffect(() => {
    if (!traslados) {
      setFilteredTraslados([]);
      return;
    }

    if (searchTerm.trim() === '') {
      setFilteredTraslados(traslados);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = traslados.filter(traslado => 
        traslado.producto?.nombre.toLowerCase().includes(lowercasedTerm) ||
        traslado.producto?.codigo.toLowerCase().includes(lowercasedTerm) ||
        traslado.bodegaOrigen?.nombre.toLowerCase().includes(lowercasedTerm) ||
        traslado.bodegaDestino?.nombre.toLowerCase().includes(lowercasedTerm) ||
        (traslado.notas && traslado.notas.toLowerCase().includes(lowercasedTerm))
      );
      setFilteredTraslados(filtered);
    }
    setPage(0);
  }, [searchTerm, traslados]);

  // Manejo de cambio en el campo de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Manejo de paginación
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Confirmar eliminación
  const handleDeleteClick = (traslado) => {
    setTrasladoToDelete(traslado);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(trasladoToDelete);
    setOpenDeleteDialog(false);
    setTrasladoToDelete(null);
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setTrasladoToDelete(null);
  };

  // Calcular traslados a mostrar según paginación
  const displayTraslados = filteredTraslados.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <TextField
          label="Buscar"
          variant="outlined"
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
          sx={{ width: '50%' }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : displayTraslados && displayTraslados.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Origen</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Destino</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Cantidad</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayTraslados.map((traslado) => (
                  <TableRow key={traslado.id} hover>
                    <TableCell>{formatDate(traslado.fecha)}</TableCell>
                    <TableCell>
                      {traslado.producto ? `${traslado.producto.codigo} - ${traslado.producto.nombre}` : '-'}
                    </TableCell>
                    <TableCell>{traslado.bodegaOrigen?.nombre || '-'}</TableCell>
                    <TableCell>{traslado.bodegaDestino?.nombre || '-'}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        size="small" 
                        color="primary" 
                        label={traslado.cantidad} 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Ver detalles">
                          <IconButton size="small" color="info" onClick={() => onView(traslado)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton 
                            size="small" 
                            color="error" 
                            onClick={() => handleDeleteClick(traslado)}
                            // Solo permitir eliminar traslados recientes (ejemplo: menos de 24 horas)
                            disabled={new Date() - new Date(traslado.fecha) > 24 * 60 * 60 * 1000}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredTraslados.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
            labelRowsPerPage="Filas por página:"
          />
        </>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <Typography variant="subtitle1" color="text.secondary">
            {searchTerm 
              ? 'No se encontraron traslados con ese término de búsqueda' 
              : 'No hay traslados registrados'
            }
          </Typography>
        </Box>
      )}

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Eliminar Traslado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar este traslado? Esta acción no se puede deshacer y afectará el inventario de ambas bodegas.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

TrasladosTable.propTypes = {
  traslados: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onView: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default TrasladosTable;
