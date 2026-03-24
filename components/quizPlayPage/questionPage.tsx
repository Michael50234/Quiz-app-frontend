'use client';

import { ErrorResponse, PlayQuestion } from '@/types'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

type QuestionPageProps = {
  questionData: PlayQuestion | undefined,

  selectedChoiceId: number | null,
  setSelectedChoiceId: React.Dispatch<React.SetStateAction<number | null>>,
  correctChoiceId: number | null,
  setCorrectChoiceId: React.Dispatch<React.SetStateAction<number | null>>,
  checkQuestion: (choiceId: number) => void

  checkAnswerLoading: boolean,
}

const QuestionPage = ({ checkQuestion, checkAnswerLoading, questionData, selectedChoiceId, setSelectedChoiceId, setCorrectChoiceId, correctChoiceId }: QuestionPageProps) => {

  useEffect(() => {
    console.log("selected choice", selectedChoiceId);
  }, [selectedChoiceId])

  return (
    <Stack alignItems="center" spacing={3} justifyContent="center" sx={{
        width: "60%",
        height: "800px"
    }}>
        <Typography sx={{
          fontSize: "2rem",
          fontWeight: 500,
          textAlign: "center"
        }}>{questionData?.question}</Typography>
        <Box component="img" src={questionData?.question_image_url} sx={{
          height: "450px",
          aspectRatio: "9 / 12"
        }}/>
        <Grid container rowSpacing={2} columnSpacing={3} sx={{
          display: "flex",
          justifyContent: "center",
          width: "700px"
        }}>
          { questionData?.choices.map((choice) => {
            return (
              <Grid 
                key={choice.id} 
                size={5} 
                sx={{ 
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "80px",
                  borderRadius: "10px"
                }} 
              >
                <Button 
                  data-correct = { choice.id === correctChoiceId || undefined }
                  data-incorrect = { choice.id === selectedChoiceId && choice.id !== correctChoiceId || undefined }
                  onClick={async () => {
                    setSelectedChoiceId(choice.id)
                    await checkQuestion(choice.id)
                  }}
                  disabled={selectedChoiceId !== null} 
                  variant="outlined" 
                  color="primary"
                  sx={{
                    height: "100%",
                    width: "100%",
                    "&.Mui-disabled": {
                      opacity: 1,
                      color: "inherit",
                      backgroundColor: "inherit",
                      pointerEvents: "auto", // optional: allows hover/click styles
                    },
                    "&:hover": {
                      backgroundColor: "var(--primary)"
                    },
                    "&[data-incorrect]": {
                      backgroundColor: "error.main"
                    },
                    "&[data-correct]": {
                      backgroundColor: "success.main"
                    }
                  }}
                >
                  {choice.choice}
                </Button>
              </Grid>
            )
          })}
        </Grid>
        <Button variant="contained" sx={{
          py: "10px",
          visibility: !correctChoiceId && !selectedChoiceId ? "hidden" : undefined
        }}>
          Next Question
        </Button>
    </Stack>
  )
}

export default QuestionPage;
