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
import AddIcon from '@mui/icons-material/Add';
import PropTypes from 'prop-types';

// Componente genérico para tablas de entidades (categorías, líneas, etc.)
const EntityTable = ({ 
  title,
  entities,
  entityNameSingular,
  entityNamePlural,
  loading,
  onAdd,
  onEdit,
  onDelete,
  includeDescripcion = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredEntities, setFilteredEntities] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState(null);

  // Filtrar entidades según término de búsqueda
  useEffect(() => {
    if (!entities) {
      setFilteredEntities([]);
      return;
    }

    if (searchTerm.trim() === '') {
      setFilteredEntities(entities);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = entities.filter(entity => 
        entity.nombre.toLowerCase().includes(lowercasedTerm) || 
        (includeDescripcion && entity.descripcion && entity.descripcion.toLowerCase().includes(lowercasedTerm))
      );
      setFilteredEntities(filtered);
    }
    setPage(0);
  }, [searchTerm, entities, includeDescripcion]);

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
  const handleDeleteClick = (entity) => {
    setEntityToDelete(entity);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(entityToDelete);
    setOpenDeleteDialog(false);
    setEntityToDelete(null);
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setEntityToDelete(null);
  };

  // Calcular entidades a mostrar según paginación
  const displayEntities = filteredEntities.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAdd}
          disabled={loading}
        >
          {`Agregar ${entityNameSingular}`}
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : displayEntities && displayEntities.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Nombre</TableCell>
                  {includeDescripcion && (
                    <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Descripción</TableCell>
                  )}
                  <TableCell sx={{ fontWeight: 'bold', width: '15%', textAlign: 'center' }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', width: '15%', textAlign: 'center' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayEntities.map((entity) => (
                  <TableRow key={entity.id} hover>
                    <TableCell>{entity.nombre}</TableCell>
                    {includeDescripcion && (
                      <TableCell>{entity.descripcion || '-'}</TableCell>
                    )}
                    <TableCell align="center">
                      <Chip 
                        size="small" 
                        color={entity.activo ? "success" : "default"} 
                        label={entity.activo ? "Activo" : "Inactivo"} 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Editar">
                          <IconButton size="small" color="primary" onClick={() => onEdit(entity)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton size="small" color="error" onClick={() => handleDeleteClick(entity)}>
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
            count={filteredEntities.length}
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
              ? `No se encontraron ${entityNamePlural} con ese término de búsqueda` 
              : `No hay ${entityNamePlural} registrados`
            }
          </Typography>
        </Box>
      )}

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
      >
        <DialogTitle>{`Eliminar ${entityNameSingular}`}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar {entityToDelete?.nombre}? Esta acción no se puede deshacer.
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

EntityTable.propTypes = {
  title: PropTypes.string,
  entities: PropTypes.array.isRequired,
  entityNameSingular: PropTypes.string.isRequired,
  entityNamePlural: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  includeDescripcion: PropTypes.bool
};

export default EntityTable;
