'use client';

import { Box, Button, Container, Dialog, DialogActions, DialogContent, InputBase, Stack, TextField, Toolbar, Typography } from '@mui/material'
import { DisplayUser, ErrorResponse, User } from '@/types'
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/loadingSpinner' 
import ImageCropper from '@/components/crop/imageCropper';
import { Input } from '@mui/icons-material';

const page = () => {
  const [userData, setUserData] = useState<null | DisplayUser>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>("");
  const [aboutMe, setAboutMe] = useState<string>("");

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

  const setProfilePictureBlob = (blob: Blob) => {
    setUserData((prev) => {
      if(!prev) return null;

      return {
        ...prev,
        setProfilePictureBlob: blob,
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

  return (
    <Box sx={{
      backgroundColor: "var(--bg-dark)",
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
            spacing={6} 
            direction="row" 
            justifyContent="center"
            sx={{
              width: "50%",
              height: "fit-content",
              borderRadius: "50px",
              // backgroundColor: "var(--bg)"
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
                spacing={3}
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
                    sx={{
                      width: "50%"
                    }}
                    >
                      Select An Image
                  </Button>
                  <Dialog open={dialogOpen} onClose={handleDialogClose}>
                    <DialogContent>
                      <DialogActions>
                        <ImageCropper aspectRatio={1} changeImageBlob={setProfilePictureBlob} changeImageUrl={setProfilePictureUrl} handleDialogClose={handleDialogClose} cropShape="round" ></ImageCropper>
                      </DialogActions>
                    </DialogContent>
                  </Dialog>
                </Stack>
                <Stack 
                  spacing={2} 
                  sx={{
                    width: "100%", 
                    backgroundColor: "rgba(0,0,0,0.03)", 
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
              >
                  Save
              </Button>
            </Stack>
          </Stack>
        )}
      </Container>
    </Box>
  )
}

export default page
