import React, { useState } from 'react'

import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'

import CustomTextField from '@core/components/mui/TextField'
import Loader from './loader/Loader'

interface CustomModalProps {
  open: boolean
  onClose: () => void
  title: string
  description: string
  onSubmit: (code: number, email: string) => void
  submitButtonText: string
  email: string // Now we are passing email as a prop
  loadingVerify: boolean
}

const CustomModal: React.FC<CustomModalProps> = ({
  open,
  onClose,
  title,
  description,
  onSubmit,
  submitButtonText,
  email,
  loadingVerify
}) => {
  const [verificationCode, setVerificationCode] = useState('')

  const handleSubmit = () => {
    const numericCode = parseInt(verificationCode, 10) // Convert string to number if necessary

    onSubmit(numericCode, email) // Pass both email and code to the onSubmit function
    // onClose() // Optionally close the modal after submit
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='form-dialog-title'
      maxWidth='sm'
      fullWidth={true}
      sx={{
        '& .MuiDialog-paper': {
          width: '420px',

          // height: '700px'
          // height: loadingVerify ? '250px' : '280px'
          overflow: 'hidden'
        },
        '& .MuiDialogContent-root': {
          overflow: 'hidden' // Additional measure to prevent scrolling within content area
        },
        // '& .MuiDialogContentText-root': { color: '#000000' }
      }}
    >
      <DialogTitle id='form-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: theme => theme.palette.text.primary }} className='mbe-3 '>{description}</DialogContentText>
        <CustomTextField
          id='verification-code'
          autoFocus
          fullWidth
          type='number'
          label='Enter Verification Code'
          value={verificationCode}
          onChange={e => setVerificationCode(e.target.value)}
          required
        />
      </DialogContent>
      {/* <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={onClose}>Close</Button>
          <Button disabled={loadingVerify} onClick={handleSubmit}>
            {submitButtonText}
          </Button>
        </DialogActions>
        <div>{loadingVerify && <Loader />}</div>
      </div> */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ paddingLeft: '16px' }}>{loadingVerify && <Loader />}</div>
        <DialogActions className='dialog-actions-dense' style={{ marginLeft: 'auto' }}>
          <Button onClick={onClose}>Close</Button>
          <Button disabled={loadingVerify} onClick={handleSubmit}>
            {submitButtonText}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  )
}

export default CustomModal
