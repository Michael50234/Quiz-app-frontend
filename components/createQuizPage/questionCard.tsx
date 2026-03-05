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
  deleteQuestion: () => void,
}

const QuestionCard = ({ deleteQuestion, question, changeQuestionImageUrl, changeQuestionImageBlob, changeChoice, changeQuestion, changeCorrectChoice}: QuestionCardProps) => {
  const [open, setOpen] = useState<boolean>(false)

  const handleDialogClose = () => {
    setOpen(false);
  }

  return (
    <div>
      <Container sx={{
        justifyItems: "center",
        justifyContent: "center",
      }}>
        <Box sx={{
            width: "75%",
            borderRadius: "5px",
            justifyContent: "space-around",
            backgroundColor: "var(--bg)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            height: "450px"
        }}>
          <IconButton color="error" sx={{
            ml: "auto",
            "&:hover": {
              backgroundColor: "var(--bg-light)"
            }
          }} onClick={deleteQuestion}>
            <DeleteIcon />
          </IconButton>
          <Stack direction="row" justifyContent="center" sx={{
            height: "100%",
            width: "100%",
            flex: 1,
            justifyContent: "space-around",
          }}>
            <Stack sx={{
              width: "30%"
            }}>
              <img src={question.question_image_url} style={{
                width: "100%",
                aspectRatio: "9 / 12",
                objectFit: "cover",
                outline: "1px solid var(--border)"
              }}></img>
              <Button variant="contained" sx={{
                mt: "5px",
                pt: "3px",
                pb: "3px"
              }}onClick={() => setOpen(true)}>Add Image</Button>
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
              height: "100%",
              flexDirection: 1,
            }}>
              <Stack spacing={1} >
                <Typography color="var(--primary-base)" sx={{
                  fontWeight: 600
                }}>Question</Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  maxRows={3}
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
                    <TextField 
                      minRows={2}
                      maxRows={2}
                      sx={{ 
                        width: "80%",
                        "& .MuiInputBase-input": {
                          fontSize: "0.9rem"
                        }
                       }} 
                      value={choice.choice} 
                      onChange={(e) => {changeChoice(choice.uid, e.target.value)}}>
                    </TextField>
                  </Grid>)
                })}
              </Grid>
              <Typography sx={{
                position: "relative",
                top: "15px",
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
