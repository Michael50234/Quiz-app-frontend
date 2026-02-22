import { Box, Grid, TextField, Typography } from '@mui/material';
import React from 'react'
import { CreateChoice, CreateQuestion } from '@/types/index'

//We bake choice and question uids into setters
//question is baked in props 
//create a component for choices and bake it in

type QuestionCardProps = {
  choices: CreateChoice[],
  question: CreateQuestion,
  questionImageUrl: string,
  
  changeQuestionImageUrl: (ImageUrl: string) => void,
  changeQuestionImageBlob: (blob: Blob) => void,
  changeChoice: (choiceUid: string, choice: string) => void,
  changeQuestion: (question: string) => void
  changeCorrectChoice: (choiceUid: string)
}

//Need to create ui element and method to set option as correct
const QuestionCard = ({choices, question, questionImageUrl, changeQuestionImageUrl, changeQuestionImageBlob, changeChoice, changeQuestion, changeCorrectChoice}: QuestionCardProps) => {

  return (
    <Box>
      <TextField value={question.question} onChange={(e) => changeQuestion(e.target.value)}>{question.question}</TextField>
      <Grid container>
        {choices.map((choice) => {
          return <Grid key={choice.uid} ></Grid>
        })}

      </Grid>
    </Box>
  )
}

export default QuestionCard;
