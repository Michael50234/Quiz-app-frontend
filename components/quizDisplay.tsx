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

const QuizDisplayGrid = ({quizzes} : { quizzes: Quiz[]}) => {
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
        <div style={{
            marginLeft: "40px",
            marginRight: "40px"
        }}>
            <Grid container spacing={1}>
                {quizList.map((quiz) => {
                    return <Grid key={quiz.uid} size={2}><QuizCard quiz={quiz} uid={quiz.uid}></QuizCard></Grid>
                })}
            </Grid>
        </div>
    )
}

export default QuizDisplayGrid;
