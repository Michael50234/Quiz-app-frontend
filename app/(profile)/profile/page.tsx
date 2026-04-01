'use client';

import { Box, Button, Container, Dialog, DialogActions, DialogContent, InputBase, Stack, TextField, Toolbar, Typography } from '@mui/material'
import { DisplayUser, ErrorResponse, User } from '@/types'
import { useContext, useEffect, useState } from 'react';
import LoadingSpinner from '@/components/loadingSpinner' 
import ImageCropper from '@/components/crop/imageCropper';
import { saveImageInFirebase } from '@/utils';
import { UserContext, useUser } from '@/components/userProvider';
import ProtectedPage from '@/components/ProtectedPage';
import { useToast } from '@/components/toastProvider';

const page = () => {
  const [userData, setUserData] = useState<null | DisplayUser>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const { loadUser, user, userLoading } = useUser();
  
  const { showError, showSuccess } = useToast();

  
  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if(userLoading) return;

    
    setUserData(user);
    setLoading(false);

  }, [userLoading])

  const setNickname = (nickname: string) => {
    setUserData((prev) => {
      if(!prev) return null;

      return {
        ...prev,
        nickname: nickname
      }
    })
  }
  
  const setAboutMe = (about_me: string) => {
    setUserData((prev) => {
      if(!prev) return null;

      return {
        ...prev,
        about_me: about_me
      }
    })
  }

  const handleDialogClose = () => {
    setDialogOpen(false);
  }

  const setProfilePictureBlob = (blob: Blob) => {
    setUserData((prev) => {
      if(!prev) return null;

      return {
        ...prev,
        profilePictureBlob: blob,
      }
    })
  }

  const setProfilePictureUrl = (newUrl: string) => {
    setUserData((prev) => {
      if(!prev) return null;

      return {
        ...prev,
        profile_picture_url: newUrl,
      }
    })

  }

  const saveUserData = async () => {
    try {
      const access_token = localStorage.getItem("access_token");

      const userDataCopy = {
        ...userData
      };

      if(userDataCopy.profilePictureBlob) {
          const imageUrl = await saveImageInFirebase(userDataCopy.profilePictureBlob, `/users/${userDataCopy.id}/profile`);
          userDataCopy.profile_picture_url = imageUrl;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/accounts/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
        },
        body: JSON.stringify({
          nickname: userDataCopy.nickname,
          profile_picture_url: userDataCopy.profile_picture_url,
          about_me: userDataCopy.about_me
        })
      });

      if(!response.ok) {
        const error: ErrorResponse = await response.json();
        throw new Error("Failed to save changes")
      }

      if(userDataCopy.profile_picture_url) {
        setProfilePictureUrl(userDataCopy.profile_picture_url);
      }

      // Refresh the global user state
      loadUser();

      showSuccess("Successfully saved changes")

    } catch(error) {
      showError("Failed to save changes")
    }
  }


  return (
    <Box sx={{
      backgroundColor: "var(--bg-dark)",
      minHeight: "100vh",
      width: "100vw",
      pl: "20px",
      pr: "20px"
    }}>
      <Toolbar></Toolbar>
      <ProtectedPage>
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
              spacing={6} 
              direction="row" 
              justifyContent="center"
              sx={{
                width: "50%",
                height: "fit-content",
                borderRadius: "50px",
              }}
            >
              <Stack spacing={4} alignItems="center" sx={{
                width: "100%",
                px: "80px"
              }}>
                <Typography sx={{
                    fontWeight: "600",
                    fontSize: "2rem",
                    m: "0px"
                  }}>Profile Settings
                </Typography>
                <Stack 
                  spacing={2}
                  sx={{
                    width: "100%",
                  }}
                >
                  <Stack spacing={2} sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%"
                  }}>
                    <Box component="img" src={ userData?.profile_picture_url || "/DefaultProfileImage.png"} sx={{
                      objectFit: "cover",
                      height: "350px",
                      aspectRatio: "1 / 1",
                      borderRadius: "50%"
                    }} />
                    <Button variant="contained" onClick={() => setDialogOpen(true)} 
                      color="secondary"
                      sx={{
                        width: "50%",
                      }}
                      >
                        Select An Image
                    </Button>
                    <Dialog open={dialogOpen} onClose={handleDialogClose}>
                      <DialogContent>
                        <DialogActions>
                          <ImageCropper aspectRatio={1} changeImageBlob={setProfilePictureBlob} changeImageUrl={setProfilePictureUrl} handleDialogClose={handleDialogClose} cropShape="round"></ImageCropper>
                        </DialogActions>
                      </DialogContent>
                    </Dialog>
                  </Stack>
                  <Stack 
                    spacing={2} 
                    sx={{
                      width: "100%", 
                      backgroundColor: "var(--muted-surface)", 
                      p: "10px", 
                      borderRadius: "20px",
                    }}>
                    <Box>
                      <Typography sx={{ fontWeight: 500 }}>Nickname</Typography>
                      <TextField value={userData?.nickname} onChange={(e) => {setNickname(e.target.value)}} 
                        sx={{ 
                          width: "100%",
                          "& .MuiInputBase-root": {
                            fontSize: "0.9rem"
                          }
                        }} 
                        slotProps={{
                          input: {
                            inputProps: {
                              maxLength: 50
                            }
                          }
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 500 }}>About Me</Typography>
                      <TextField 
                        multiline
                        value={userData?.about_me}
                        onChange={(e) => {setAboutMe(e.target.value)}}
                        minRows={3}
                        maxRows={3}
                        sx={{ 
                          width: "100%",
                          "& .MuiInputBase-root": {
                            fontSize: "0.9rem"
                          }
                        }}
                        slotProps={{
                          input: {
                            inputProps: {
                              maxLength: 2000
                            }
                          }
                        }}
                      >
                      </TextField>
                    </Box>
                  </Stack>
                </Stack>
                <Button 
                  sx={{
                    width: "50%"
                  }}
                  variant="contained"
                  onClick={saveUserData}
                >
                    Save
                </Button>
              </Stack>
            </Stack>
          )}
        </Container>
      </ProtectedPage>
    </Box>
  )
}

export default page
