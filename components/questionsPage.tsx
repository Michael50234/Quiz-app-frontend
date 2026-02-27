import React from 'react'
import QuestionCard from '@/components/questionCard';
import { CreateQuestion } from '@/types/index'
import { Button, Stack } from '@mui/material';

type QuestionsPageProps = {
  questions: CreateQuestion[],
  addNewQuestion: () => void

  changeQuestionImageUrl: (questionUid: string, newUrl: string) => void, 
  changeQuestionImageBlob: (questionUid: string, blob: Blob) => void, 
  changeChoice: (questionUid: string, choiceUid: string, newChoice: string) => void, 
  changeQuestion: (uid: string, newQuestion: string) => void, 
  changeCorrectChoice: (questionUid: string, choiceUid: string) => void,
  deleteQuestion: (uid: string) => void
}

const QuestionsPage = ({deleteQuestion, addNewQuestion, questions, changeQuestionImageUrl, changeQuestionImageBlob, changeChoice, changeQuestion, changeCorrectChoice}: QuestionsPageProps) => {
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
      <Button onClick={addNewQuestion}>Add New Question</Button>
      <Button>Save</Button>
    </Stack>
    
  )
}

export default QuestionsPage;
