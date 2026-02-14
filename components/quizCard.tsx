'use client';

import { Box, Card, CardContent, Typography } from '@mui/material';
import React from 'react';

type Quiz = {
  id?: number,
  uid?: string,
  title: string,
  owner: {
    id: number,
    nickname: string,
  },
  tags: { name: string }[]
}

const QuizCard = ({quiz, uid}: { quiz: Quiz, uid: string | undefined}) => {
  return ( 
    <Box>
      <Card sx={{
        height: "100%",
        width: "100%",
        backgroundColor: "var(--primary-light)" 
      }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{
            fontWeight: 600
          }}>
            {quiz.title}
          </Typography>
          <Box component="img" src='/Mambo.png' sx={{
            width: "100%",
            borderRadius: "20px"
          }}></Box>

        </CardContent>
      </Card>
    </Box>
  )
}

export default QuizCard;
