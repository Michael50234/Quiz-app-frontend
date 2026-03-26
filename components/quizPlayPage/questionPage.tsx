'use client';

import { ErrorResponse, PlayQuestion } from '@/types'
import { Box, Button, Grid, keyframes, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

type Animation = "in" | "out"

const animationOut = keyframes`
    0% {
        opacity: 1;
        transform: translateY(0);
    }
    100% {
        opacity: 0;
        transform: translateY(-50%);
    }
`;
const animationIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(50%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;


type QuestionPageProps = {
  questionData: PlayQuestion | undefined,

  selectedChoiceId: number | null,
  setSelectedChoiceId: React.Dispatch<React.SetStateAction<number | null>>,
  correctChoiceId: number | null,
  checkQuestion: (choiceId: number) => void,
  animation: Animation,
  showNextQuestion: () => void,

  checkAnswerLoading: boolean,
}

const QuestionPage = ({ checkQuestion, showNextQuestion, animation, checkAnswerLoading, questionData, selectedChoiceId, setSelectedChoiceId, correctChoiceId }: QuestionPageProps) => {

  useEffect(() => {
    console.log("selected choice", selectedChoiceId);
  }, [selectedChoiceId])

  return (
    <Stack key={questionData?.id} alignItems="center" spacing={3} justifyContent="center" sx={{
        width: "60%",
        height: "800px",
        animation: `${animation === "in" ? animationIn : animationOut} 0.6s ease-out`,
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
        <Button variant="contained" onClick={showNextQuestion}sx={{
          py: "10px",
          visibility: !correctChoiceId && !selectedChoiceId ? "hidden" : undefined
        }}>
          Next Question
        </Button>
    </Stack>
  )
}

export default QuestionPage;
