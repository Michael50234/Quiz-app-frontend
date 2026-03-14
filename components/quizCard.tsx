'use client';

import { Box, Button, Card, CardContent, CircularProgress, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import { DisplayQuiz } from '@/types'
import { useRouter } from 'next/navigation';
import DeleteIcon from '@mui/icons-material/Delete';

type QuizCard = {
  quiz: DisplayQuiz,
  deleteQuizHandler: (id: number) => Promise<void>,
  id: number
}

const QuizCard = ({quiz, id, deleteQuizHandler}: QuizCard) => {
  const router = useRouter();
  const userId = JSON.parse(localStorage.getItem("user") as string).id
  const [deleteLoading, setSaveLoading] = useState<boolean>(false)

  const editQuizHandler = () => {
    router.push(`/quiz/edit/${id}`)
  }

  return ( 
    <Box>
      <Card sx={{
        height: "550px",
        width: "100%",
        backgroundColor: "var(--bg)",
      }}>
        <CardContent sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%"
        }}>
          <Box sx={{ minHeight: "100px", display: "flex", flexDirection: "column"}}>
            <IconButton onClick={() => deleteQuizHandler(id)} sx={{ml: "auto", mt: "5px", mb: "5px", height: "10px"}} color="error">{ deleteLoading ? <CircularProgress /> : <DeleteIcon />}</IconButton>
            <Typography variant="h5" sx={{
              mb: "5px",
              fontWeight: 600,
            }}>
              {quiz.title}
            </Typography>
          </Box>
          <Box component="img" src={quiz.cover_image_url} sx={{
            display: "block",
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
            <Button color='secondary' variant="contained" onClick={(e) => {
              editQuizHandler();
            }
            }>Edit</Button>
            <Button variant="contained">Play</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default QuizCard;
