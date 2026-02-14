'use client';

import React, { useEffect, useState } from 'react';
import QuizCard from '@/components/quizCard';
import { Grid } from '@mui/material';

type Quiz = {
    uid?: string,
    id?: number,
    title: string,
    owner: {
        id: number
        nickname: string
    },
    tags: { name: string }[]
}

const QuizDisplay = ({quizzes} : { quizzes: Quiz[]}) => {
    const [quizList, setQuizList] = useState<Quiz[]>([]);

    useEffect(() => {
        //Later on QuizList use fetch
        setQuizList(quizzes.map((quiz) => {
          return {
            ...quiz,
            uid: crypto.randomUUID()
          }
        }))
    }, []);

    return (
        <div>
            <Grid container spacing={1}>
                {quizList.map((quiz) => {
                    return <Grid key={quiz.uid} size={3}><QuizCard quiz={quiz} uid={quiz.uid}></QuizCard></Grid>
                })}
            </Grid>
        </div>
    )
}

export default QuizDisplay;
