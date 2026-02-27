"use client";

import { Box, Button, Container, Dialog, DialogActions, DialogContent, Grid, IconButton, Radio, Stack, TextField, Typography} from '@mui/material';
import React, { useState } from 'react'
import { CreateChoice, CreateQuestion } from '@/types/index'
import ImageCropper from "@/components/crop/imageCropper"
import DeleteIcon from '@mui/icons-material/Delete';


type QuestionCardProps = {
  question: CreateQuestion,
  
  changeQuestionImageUrl: (newUrl: string) => void,
  changeQuestionImageBlob: (blob: Blob) => void,
  changeChoice: (choiceUid: string, newChoice: string) => void,
  changeQuestion: (newQuestion: string) => void,
  changeCorrectChoice: (choiceUid: string) => void,
  deleteQuestion: () => void
}

//Need to create ui element and method to set option as correct
const QuestionCard = ({deleteQuestion, question, changeQuestionImageUrl, changeQuestionImageBlob, changeChoice, changeQuestion, changeCorrectChoice}: QuestionCardProps) => {
  const [open, setOpen] = useState<boolean>(false)

  const handleDialogClose = () => {
    setOpen(false);
  }

  return (
    <div>
      <Container sx={{
        justifyItems: "center",
        justifyContent: "center"
      }}>
        <Box sx={{
          width: "75%",
            borderRadius: "5px",
            justifyContent: "space-around",
            backgroundColor: "var(--primary-light)",
            padding: "20px",
            display: "flex",
            flexDirection: "column"
        }}>
          <IconButton color="error" sx={{
            ml: "auto"
          }} onClick={deleteQuestion}>
            <DeleteIcon />
          </IconButton>
          <Stack direction="row" justifyContent="center" sx={{
            width: "100%",
            justifyContent: "space-around",
          }}>
            <Stack sx={{
              height: "340px"
            }}>
              <img src={question.question_image_url} style={{
                height: "90%",
                objectFit: "cover"
              }}></img>
              <Button onClick={() => setOpen(true)}>Add Image</Button>
              <Dialog fullWidth={true} maxWidth={'sm'} open={open} onClose={handleDialogClose}>
                <DialogContent>
                  <DialogActions>
                    <ImageCropper handleDialogClose={handleDialogClose} changeImageUrl={changeQuestionImageUrl} cropShape={"rect"} changeImageBlob={changeQuestionImageBlob} aspectRatio={9/12}></ImageCropper>
                  </DialogActions>
                </DialogContent>
              </Dialog>
            </Stack>
            <Stack spacing={2} sx={{
              width: "60%",
              ml: "10px",
              mr: "10px",
            }}>
              <Stack spacing={1}>
                <Typography color="var(--primary-base)" sx={{
                  fontWeight: 600
                }}>Question</Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  maxRows={2}
                  value={question.question} 
                  onChange={(e) => changeQuestion(e.target.value)}
                  sx={{
                    width: "100%",
                    "& .MuiInputBase-root": {
                      height: "100%",
                      width: "100%",
                      fontSize: "0.85rem",
                      borderRadius: "3px"
                    },
                  }}>
                  {question.question}
                </TextField>
              </Stack>
              <Typography color="var(--primary-base)" sx={{fontWeight: 600
                }}>Choices</Typography>
              <Grid columnSpacing={0} rowSpacing={2} container>
                {question.choices.map((choice) => {
                  return (
                  <Grid size={6} key={choice.uid}>
                    <Radio checked={choice.is_answer} onClick={() => changeCorrectChoice(choice.uid)}></Radio>
                    <TextField sx={{ width: "80%" }} value={choice.choice} onChange={(e) => {changeChoice(choice.uid, e.target.value)}}></TextField>
                  </Grid>)
                })}
              </Grid>
              <Typography sx={{
                fontWeight: 500,
              }}>
                <span style={{color: "var(--primary-base)"}}>{ `The Correct Answer Is: `}</span>
                <span style={{fontWeight: 600}}>{question.choices.find((choice) => choice.is_answer)?.choice || " "}</span>
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </div>
  )
}

export default QuestionCard;
