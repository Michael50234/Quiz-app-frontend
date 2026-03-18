'use client';

import { Box, Button, Container, Dialog, DialogActions, DialogContent, Stack, Toolbar, Typography } from '@mui/material'
import { DisplayUser, ErrorResponse, User } from '@/types'
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/loadingSpinner' 
import ImageCropper from '@/components/crop/imageCropper';

const page = () => {
  const [userData, setUserData] = useState<null | DisplayUser>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadUserData()
      } catch {
        // TODO: Use toast to show errors
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const loadUserData = async () => {
    const access_token = localStorage.getItem("access_token");

    const response = await fetch(`http://127.0.0.1:8000/accounts/user`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${access_token}`
      }
    });

    if(!response.ok) {
      const error: ErrorResponse = await response.json();
    }

    const data: User = await response.json();

    setUserData(data);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  return (
    <Box sx={{
      backgroundColor: "var(--bg-light)",
      minHeight: "100vh",
      width: "100vw",
      pl: "20px",
      pr: "20px"
    }}>
      <Toolbar></Toolbar>
      <Container maxWidth={false} sx={{
          width: "100%",
          minHeight: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
      }}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Stack 
            spacing={3} 
            direction="row" 
            sx={{
              width: "70%",
              height: "700px",
              backgroundColor: "var(--bg)",
              borderRadius: "50px"
            }}
          >
            <Stack>
              <Box component="img" src={ userData?.profile_picture_url || "/DefaultProfileImage.png"} sx={{
                objectFit: "cover",
                height: "75%",
                aspectRatio: "1 / 1",
                borderRadius: "50%"
              }} />
              <Button onClick={() => setDialogOpen(true)}>Select An Image</Button>
              <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogContent>
                  <DialogActions>
                    <ImageCropper handleDialogClose={handleDialogClose} cropShape="round" ></ImageCropper>
                  </DialogActions>
                </DialogContent>

              </Dialog>

            </Stack>
          </Stack>
        )}
      </Container>
    </Box>
  )
}

export default page
