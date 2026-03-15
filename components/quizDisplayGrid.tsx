'use client';

import React, { useEffect, useState } from 'react';
import QuizCard from '@/components/quizCard';
import { Grid } from '@mui/material';
import { DisplayQuiz } from '@/types';

type QuizDisplayGrid = {
    quizzes: DisplayQuiz[],
    deleteQuizHandler: (id: number) => Promise<void>,
}

const QuizDisplayGrid = ({quizzes, deleteQuizHandler} : QuizDisplayGrid) => {
    
    return (
        <div style={{
            marginLeft: "40px",
            marginRight: "40px"
        }}>
            <Grid container spacing={2}>
                {quizzes.map((quiz) => {
                    return <Grid key={quiz.id} size={2}><QuizCard deleteQuizHandler={deleteQuizHandler} quiz={quiz} id={quiz.id}></QuizCard></Grid>
                })}
            </Grid>
        </div>
    )
}

export default QuizDisplayGrid;
