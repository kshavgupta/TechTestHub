import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';

const Modal = ({ mode, open, onClose, children }) => {

  const backgroundColor = (mode) =>
    mode === 'light' ? 'white' : 'black';

  return (
    
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundSize: 'cover',
            borderRadius: '10px',
            outline: '1px solid',
            backgroundColor,
          },
        }}
      >
        <DialogContent>
          <DialogContentText>{children}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    
  );
};

export default Modal;
