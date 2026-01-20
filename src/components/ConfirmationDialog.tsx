import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'

interface ConfirmationDialogProps {
  openConfirmation: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  openConfirmation,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'OK',
  cancelText = 'Cancel'
}) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const dialogStyles = {
    paper: {
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
      minWidth: '350px'
    }
  }

  const titleStyles = {
    fontSize: '24px',
    fontWeight: 600,
    color: '#ffffff',
    paddingBottom: '8px',
    borderBottom: '1px solid #eaeaea'
  }

  const contentStyles = {
    marginTop: '16px',
    marginBottom: '24px'
  }

  const descriptionStyles = {
    fontSize: '16px',
    color: '#666666',
    lineHeight: 1.5
  }

  const actionsStyles = {
    padding: '16px 0 0',
    borderTop: '1px solid #eaeaea',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px'
  }

  const buttonBaseStyles = {
    textTransform: 'none',
    padding: '8px 24px',
    borderRadius: '8px',
    fontWeight: 500
  }

  const cancelButtonStyles = {
    ...buttonBaseStyles,
    color: '#666666',
    backgroundColor: '#f5f5f5',
    '&:hover': {
      backgroundColor: '#e0e0e0'
    }
  }

  const confirmButtonStyles = {
    ...buttonBaseStyles,
    backgroundColor: '#1976d2',
    color: 'white',
    '&:hover': {
      backgroundColor: '#1565c0'
    }
  }

  return (
    <Dialog
      open={openConfirmation}
      onClose={onClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      PaperProps={{ style: dialogStyles.paper }}
    >
      <DialogTitle id='alert-dialog-title' style={titleStyles}>
        {title}
      </DialogTitle>
      <DialogContent style={contentStyles}>
        <DialogContentText id='alert-dialog-description' style={descriptionStyles}>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions style={actionsStyles}>
        <Button
          onClick={onClose}
          // style={cancelButtonStyles}
          variant='contained'
          disableElevation
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          // style={confirmButtonStyles}
          variant='contained'
          disableElevation
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
