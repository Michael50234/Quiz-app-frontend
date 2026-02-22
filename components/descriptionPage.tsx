'use client'

import { CreateQuiz, Tag } from '@/types/index';
import React, { useState } from 'react';
import ProfileCrop from '@/components/crop/profileCrop';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, FormControlLabel, Stack, Switch, TextField, Typography } from '@mui/material';
import TagSelect from './tagSelect';
import ImageCropper from './crop/imageCropper';

type DescriptionPageProps = {
  tagIds: CreateQuiz["tag_ids"]
  tags: Tag[]

  title: CreateQuiz["title"]
  isPublic: CreateQuiz["is_public"]
  coverImageUrl: CreateQuiz["cover_image_url"]
  description: CreateQuiz["description"]

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
    <div>
        <Container sx={{
          width: "70%", 
          minheight: "400px",
          display: "flex",
          justifyContent: "space-around",
          backgroundColor: "var(--primary-light)",
          borderRadius: "32px",
          boxShadow: "0px 0px 20px 1px rgba(0,0,0, 0.1)",
          pt: "50px",
          pb: "50px"
          }}>
          <Stack spacing={1} sx={{width: "35%"}}>
            <Box sx={{height: "360px", aspectRatio: {8:12}}}>
              <img src={coverImageUrl} style={{height: '100%', width: "100%", objectFit: "cover"}}></img>
            </Box>
            <Button variant="contained" onClick={() => setOpen(true)} sx={{
              padding: "5px"
            }}>Select Image</Button>
            <Dialog open={open} onClose={handleDialogClose} fullWidth={true} maxWidth="sm">
              <DialogActions>
                  <ImageCropper cropShape={"rect"} aspectRatio={8/12} handleDialogClose={handleDialogClose} setBlob={changeCoverImageBlob} setUrl={changeCoverImageUrl}></ImageCropper>
              </DialogActions>
              <DialogContent>
              </DialogContent>
            </Dialog>
          </Stack>
          <Stack spacing={2} sx={{
            width: "50%",
            height: "80%",
          }}>
            <Box sx={{width: "100%"}}>
              <Typography fontWeight={550} sx={{
                margin: 0,
                color: "var(--primary-dark)"
                }}>Title</Typography>
              <TextField placeholder="Untitled" value={title} onChange={(e) => changeTitle(e.target.value)}sx={{
                mt: "5px",
                width: "100%",
                "& .MuiInputBase-root": {
                  borderRadius: "2px",
                  height: "30px",
                }
              }}></TextField>
            </Box>
            <Box>
              <Typography fontWeight={550} sx={{
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
                minRows={5}
                maxRows={5}
                multiline
                sx={{
                mt: "5px",
                width: "100%",
                height: "80%",
                "& .MuiInputBase-root": {
                  borderRadius: "2px",
                  fontSize: "0.8rem", 
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
