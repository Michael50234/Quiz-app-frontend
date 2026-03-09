'use client'

import { EditQuiz, Tag } from '@/types/index';
import React, { useState } from 'react';
import ProfileCrop from '@/components/crop/profileCrop';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, FormControlLabel, Stack, Switch, TextField, Typography } from '@mui/material';
import TagSelect from '@/components/tagSelect';
import ImageCropper from '@/components/crop/imageCropper';

type DescriptionPageProps = {
  tagIds: EditQuiz["tag_ids"]
  tags: Tag[]

  title: EditQuiz["title"]
  isPublic: EditQuiz["is_public"]
  coverImageUrl: EditQuiz["cover_image_url"]
  description: EditQuiz["description"]

  changeTagIds: (newValue: number[]) => void
  changeTitle: (newTitle: string) => void
  changeIsPublic: (value: boolean) => void
  changeCoverImageUrl: (newUrl: string) => void
  changeCoverImageBlob: (blob: Blob) => void
  changeDescription: (newDescription: string) => void
}

const DescriptionPage = ({tagIds, tags, title, isPublic, coverImageUrl, description, changeTagIds, changeTitle,
  changeIsPublic, changeCoverImageUrl, changeCoverImageBlob, changeDescription}: DescriptionPageProps) => {

  const [open, setOpen] = useState(false);
  const handleDialogClose = () => {
    setOpen(false);
  }

  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      marginTop: "20px",
    }}>
        <Container sx={{
          width: "70%", 
          height: "700px",
          display: "flex",
          justifyContent: "space-around",
          backgroundColor: "var(--bg)",
          borderRadius: "32px",
          boxShadow: "0px 0px 20px 1px rgba(0,0,0, 0.1)",
          pt: "50px",
          pb: "50px"
          }}>
          <Stack spacing={1} sx={{width: "35%"}}>
            <Box sx={{ width: "100%", aspectRatio: "9 / 12", border: "1px solid var(--border)"}}>
              <img src={coverImageUrl} style={{height: '100%', width: "100%", objectFit: "cover"}}></img>
            </Box>
            <Button variant="contained" onClick={() => setOpen(true)} sx={{
              padding: "5px"
            }}>Select Image</Button>
            <Dialog open={open} onClose={handleDialogClose} fullWidth={true} maxWidth="sm">
              <DialogActions>
                  <ImageCropper cropShape={"rect"} aspectRatio={9/12} handleDialogClose={handleDialogClose} changeImageBlob={changeCoverImageBlob} changeImageUrl={changeCoverImageUrl}></ImageCropper>
              </DialogActions>
              <DialogContent>
              </DialogContent>
            </Dialog>
          </Stack>
          <Stack spacing={2} sx={{
            width: "50%",
            height: "100%",
          }}>
            <Box sx={{width: "100%"}}>
              <Typography fontWeight={550} sx={{
                fontSize: "1.2rem",
                margin: 0,
                color: "var(--primary-dark)"
                }}>Title</Typography>
              <TextField 
                slotProps={{
                  input: {
                    inputProps: {
                      maxLength: 20
                    }
                  }
                }}
                placeholder="Untitled" 
                value={title} 
                onChange={(e) => changeTitle(e.target.value)}
                sx={{
                  mt: "5px",
                  width: "100%",
                  "& .MuiInputBase-root": {
                    borderRadius: "2px",
                    height: "30px",
                    fontSize: "0.9rem"
                  },
                }}>
              </TextField>
            </Box>
            <Box>
              <Typography fontWeight={550} sx={{
                fontSize: "1.2rem",
                margin: 0,
                color: "var(--primary-dark)"
              }}>Public Status</Typography>
              <FormControlLabel control={<Switch onChange={(e) => changeIsPublic(e.target.checked)} checked={isPublic}></Switch>} label={isPublic === true ? "Public" : "Private"} />
            </Box>
            <Box sx={{width: "100%"}}>
              <Typography fontWeight={550} sx={{
                margin: 0,
                color: "var(--primary-dark)"
              }}>Tags</Typography>
              <TagSelect tags={tags} tagIds={tagIds} changeTagIds={changeTagIds}/>
            </Box>
            <Box sx={{flex: 1}}>
              <Typography fontWeight={550} sx={{
                margin: 0,
                color: "var(--primary-dark)"
              }}>Description</Typography>
              <TextField 
                onChange={(e) => changeDescription(e.target.value)}
                value={description}
                minRows={12}
                maxRows={12}
                multiline
                sx={{
                  mt: "5px",
                  width: "100%",
                  height: "80%",
                  flex: 1,
                  "& .MuiInputBase-root": {
                    borderRadius: "2px",
                    fontSize: "1rem", 
                    flex: 1,
                  }
              }}></TextField>
            </Box>
          </Stack>
        </Container>
    </div>
  )
}

export default DescriptionPage;
