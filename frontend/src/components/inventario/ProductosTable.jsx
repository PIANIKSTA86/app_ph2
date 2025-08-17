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
  TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PropTypes from 'prop-types';

// Componente para mostrar lista de productos con opciones de filtrado y ordenación
const ProductosTable = ({ 
  productos,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onFilter,
  filteredCount = 0,
  totalCount = 0
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState('nombre');
  const [sortDirection, setSortDirection] = useState('asc');

  // Función para ordenar las columnas
  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortField(field);
    
    if (onFilter) {
      onFilter({
        searchTerm,
        page,
        rowsPerPage,
        sortField: field,
        sortDirection: isAsc ? 'desc' : 'asc'
      });
    }
  };

  // Manejo de filtro por término de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0); // Reiniciar a la primera página al cambiar la búsqueda
  };

  // Aplicar filtro cuando cambia el término de búsqueda
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (onFilter) {
        onFilter({
          searchTerm,
          page,
          rowsPerPage,
          sortField,
          sortDirection
        });
      }
    }, 500); // Debounce de 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Cambio de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (onFilter) {
      onFilter({
        searchTerm,
        page: newPage,
        rowsPerPage,
        sortField,
        sortDirection
      });
    }
  };

  // Cambio de filas por página
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    if (onFilter) {
      onFilter({
        searchTerm,
        page: 0,
        rowsPerPage: newRowsPerPage,
        sortField,
        sortDirection
      });
    }
  };

  // Formato de moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(value);
  };

  // Ícono de dirección de ordenamiento
  const getSortDirectionIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAdd}
          disabled={loading}
        >
          Agregar Producto
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : productos && productos.length > 0 ? (
        <>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell 
                    onClick={() => handleSort('codigo')}
                    sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Código {getSortDirectionIcon('codigo')}
                  </TableCell>
                  <TableCell 
                    onClick={() => handleSort('nombre')}
                    sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Nombre {getSortDirectionIcon('nombre')}
                  </TableCell>
                  <TableCell 
                    onClick={() => handleSort('categoria.nombre')}
                    sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Categoría {getSortDirectionIcon('categoria.nombre')}
                  </TableCell>
                  <TableCell 
                    onClick={() => handleSort('precio_venta')}
                    sx={{ cursor: 'pointer', fontWeight: 'bold', textAlign: 'right' }}
                  >
                    Precio {getSortDirectionIcon('precio_venta')}
                  </TableCell>
                  <TableCell 
                    onClick={() => handleSort('cantidad_disponible')}
                    sx={{ cursor: 'pointer', fontWeight: 'bold', textAlign: 'center' }}
                  >
                    Stock {getSortDirectionIcon('cantidad_disponible')}
                  </TableCell>
                  <TableCell 
                    onClick={() => handleSort('bodega.nombre')}
                    sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Bodega {getSortDirectionIcon('bodega.nombre')}
                  </TableCell>
                  <TableCell 
                    onClick={() => handleSort('activo')}
                    sx={{ cursor: 'pointer', fontWeight: 'bold', textAlign: 'center' }}
                  >
                    Estado {getSortDirectionIcon('activo')}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center', fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map((producto) => (
                  <TableRow key={producto.id} hover>
                    <TableCell>{producto.codigo}</TableCell>
                    <TableCell>{producto.nombre}</TableCell>
                    <TableCell>{producto.categoria?.nombre || '-'}</TableCell>
                    <TableCell align="right">{formatCurrency(producto.precio_venta)}</TableCell>
                    <TableCell align="center">
                      {producto.cantidad_disponible <= producto.cantidad_minima ? (
                        <Chip 
                          size="small" 
                          color={producto.cantidad_disponible === 0 ? "error" : "warning"} 
                          label={producto.cantidad_disponible} 
                        />
                      ) : (
                        producto.cantidad_disponible
                      )}
                    </TableCell>
                    <TableCell>{producto.bodega?.nombre || '-'}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        size="small" 
                        color={producto.activo ? "success" : "default"} 
                        label={producto.activo ? "Activo" : "Inactivo"} 
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Ver detalles">
                          <IconButton size="small" color="info" onClick={() => onView(producto)}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton size="small" color="primary" onClick={() => onEdit(producto)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton size="small" color="error" onClick={() => onDelete(producto)}>
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
            count={totalCount}
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
            {searchTerm ? 'No se encontraron productos con ese término de búsqueda' : 'No hay productos registrados'}
          </Typography>
        </Box>
      )}

      {filteredCount > 0 && filteredCount < totalCount && (
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 1 }}>
          Mostrando {filteredCount} de {totalCount} productos
        </Typography>
      )}
    </Box>
  );
};

ProductosTable.propTypes = {
  productos: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  onAdd: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  onFilter: PropTypes.func,
  filteredCount: PropTypes.number,
  totalCount: PropTypes.number
};

export default ProductosTable;
