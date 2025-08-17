import { useEffect, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

const ErrorDisplay = ({ message, severity = 'error', duration = 6000 }) => {
  const [open, setOpen] = useState(!!message);

  useEffect(() => {
    setOpen(!!message);
  }, [message]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar 
      open={open} 
      autoHideDuration={duration} 
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={severity} 
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ErrorDisplay;
