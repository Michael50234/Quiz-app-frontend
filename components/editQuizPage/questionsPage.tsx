'use client'

import React, { useState } from 'react'
import QuestionCard from '@/components/createQuizPage/questionCard';
import { EditQuestion } from '@/types/index'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';

type QuestionsPageProps = {
  questions: EditQuestion[],
  addNewQuestion: () => void

  changeQuestionImageUrl: (questionUid: string, newUrl: string) => void, 
  changeQuestionImageBlob: (questionUid: string, blob: Blob) => void, 
  changeChoice: (questionUid: string, choiceUid: string, newChoice: string) => void, 
  changeQuestion: (uid: string, newQuestion: string) => void, 
  changeCorrectChoice: (questionUid: string, choiceUid: string) => void,
  deleteQuestion: (uid: string) => void,
  saveQuiz: () => Promise<void>
}

const QuestionsPage = ({saveQuiz, deleteQuestion, addNewQuestion, questions, changeQuestionImageUrl, changeQuestionImageBlob, changeChoice, changeQuestion, changeCorrectChoice}: QuestionsPageProps) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState<boolean>(false);
  return (
    <Stack spacing={2}>
      {questions.map((question) => {
        return (
          <QuestionCard 
            deleteQuestion={() => deleteQuestion(question.uid)}
            key={question.uid}
            question={question}
            changeQuestionImageUrl={(newUrl) => {
              changeQuestionImageUrl(question.uid, newUrl);
            }}
            changeQuestionImageBlob={(blob) => {
              changeQuestionImageBlob(question.uid, blob);
            }}
            changeChoice={(choiceUid, newChoice) => {
              changeChoice(question.uid, choiceUid, newChoice);
            }}
            changeQuestion={(newQuestion) => {
              changeQuestion(question.uid, newQuestion)
            }}
            changeCorrectChoice={(choiceUid) => {
              changeCorrectChoice(question.uid, choiceUid)
            }}>
          </QuestionCard>
        )
      })}
      <Box sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2
      }}>
        <Button variant="contained" onClick={addNewQuestion}>Add New Question</Button>
        <Button variant="contained" onClick={() => setSaveDialogOpen(true)}> Save</Button>
        <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
          <DialogTitle>Confirm Save</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to save your changes? This action cannot be undone.
            </DialogContentText>
            <DialogActions>
              <Button onClick={saveQuiz}>Save</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </Box>
    </Stack>
  )
}

export default QuestionsPage;
