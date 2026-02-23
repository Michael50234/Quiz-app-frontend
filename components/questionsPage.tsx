import React from 'react'
import QuestionCard from '@/components/questionCard';
import { CreateQuestion } from '@/types/index'

type QuestionsPageProps = {
  questions: CreateQuestion,
  changeQuestionImageUrl: (questionUid: string, newUrl: string) => void, 
  changeQuestionImageBlob: (questionUid: string, blob: Blob) => void, 
  changeChoice: (questionUid: string, choiceUid: string, newChoice: string) => void, 
  changeQuestion: (newQuestion: string) => void, 
  changeCorrectChoice: (questionUid: string, choiceUid: string) => void
}

const QuestionsPage = ({questions, changeQuestionImageUrl, changeQuestionImageBlob, changeChoice, changeQuestion, changeCorrectChoice}: QuestionsPageProps) => {
  return (
    <div>
      <QuestionCard question={} changeQuestionImageUrl={} changeQuestionImageBlob={} changeChoice={} changeQuestion={} changeCorrectChoice={}></QuestionCard>
    </div>
  )
}

export default QuestionsPage;
