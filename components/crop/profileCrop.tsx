'use client';

import { Box, Button, Dialog, DialogActions, DialogContent, IconButton } from '@mui/material';
import React, { useState } from 'react';
import ImageCropper from './imageCropper'

const ProfileCrop = () => {
  const [open, setOpen] = useState(false);


  const handleDialogClose = () => {
    setOpen(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Photo</Button>
      <Dialog open={open} onClose={handleDialogClose} fullWidth={true} maxWidth="sm">
        <DialogActions>
            <ImageCropper cropShape={"round"} aspectRatio={1} handleDialogClose={handleDialogClose} setURL={() => {}} savePath={"/test"}></ImageCropper>
        </DialogActions>
        <DialogContent>

        </DialogContent>

      </Dialog>
    </>
  )
}

export default ProfileCrop;
