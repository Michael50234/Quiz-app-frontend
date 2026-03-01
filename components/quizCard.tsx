'use client';

import { Box, Button, Card, CardContent, Typography } from '@mui/material';
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
        height: "500px",
        width: "100%",
        backgroundColor: "var(--bg)",
      }}>
        <CardContent sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%"
        }}>
          <Box sx={{
            minHeight: "64px"
          }}>
            <Typography variant="h5" sx={{
              fontWeight: 600,
            }}>
              {quiz.title}
            </Typography>
          </Box>
          <Box component="img" src='/Mambo.png' sx={{
            aspectRatio: 9/12,
            width: "100%",
            borderRadius: "20px"
          }}></Box>
        <Box sx={{
          display: "flex",
          mt: "10px",
          gap: 0.6,
          justifyContent: "center",
        }}>
          <Button color={'secondary'} variant="contained">Edit</Button>
          <Button variant="contained">Play</Button>
        </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default QuizCard;
