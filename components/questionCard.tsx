import { Box, Grid, Radio, TextField, Typography } from '@mui/material';
import React from 'react'
import { CreateChoice, CreateQuestion } from '@/types/index'

//We bake choice and question uids into setters
//question is baked in props 
//create a component for choices and bake it in

type QuestionCardProps = {
  question: CreateQuestion,
  
  changeQuestionImageUrl: (ImageUrl: string) => void,
  changeQuestionImageBlob: (blob: Blob) => void,
  changeChoice: (choiceUid: string, choice: string) => void,
  changeQuestion: (question: string) => void
  changeCorrectChoice: (choiceUid: string) => void
}

//Need to create ui element and method to set option as correct
const QuestionCard = ({question, changeQuestionImageUrl, changeQuestionImageBlob, changeChoice, changeQuestion, changeCorrectChoice}: QuestionCardProps) => {

  return (
    <Box>
      <TextField value={question.question} onChange={(e) => changeQuestion(e.target.value)}>{question.question}</TextField>
      <Grid container>
        {question.choices.map((choice) => {
          return (
          <Grid key={choice.uid}>
            <Radio checked={choice.is_answer}></Radio>
            <TextField value={choice.choice} onChange={(e) => {changeChoice(choice.uid, e.target.value)}}></TextField>
          </Grid>)
        })}

      </Grid>
    </Box>
  )
}

export default QuestionCard;
