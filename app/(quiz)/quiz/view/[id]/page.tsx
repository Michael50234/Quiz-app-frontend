'use client';

import LoadingSpinner from '@/components/loadingSpinner'
import { ErrorResponse, QuizDetailViewResponse } from '@/types'
import { Avatar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material'
import React, { use, useEffect, useState } from 'react'

// Allow user to pick the number of questions

const QuizView = ({params}: { params: Promise<{ id: string }>}) => {
  const quizId = use(params).id;
  const [quizData, setQuizData] = useState<QuizDetailViewResponse | null>(null);
  const [numSelectedQuestions, setNumSelectedQuestions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadQuiz();
      } catch(error) {
        // TODO: Change this to snackbar error and redirect
        console.warn(error)
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [])

  const loadQuiz = async () => {
    const access_token = localStorage.getItem("access_token");

    const response = await fetch(`http://127.0.0.1:8000/quizzes/quiz/${quizId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${access_token}`
      }
    });

    if(!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error("Failed to fetch quiz");
    }

    const data: QuizDetailViewResponse = await response.json();
    console.log(data);

    setQuizData(data);
  }

  return (
    <Box sx={{
      backgroundColor: "var(--bg-dark)",
      minHeight: "100vh",
      width: "100vw",
      px: "10px",
    }}>
      <Toolbar></Toolbar>
      {
        loading ? (
          <LoadingSpinner />
        ) : (
          <Container sx={{
            width: "100vh",
            height: "90vh",
          }}>
            <Stack spacing={2} sx={{
              height: "100%",
              backgroundColor: "white",
            }}>
              <Box sx={{
                display: "flex",
              }}>
                <Box component="img" src={ quizData?.cover_image_url || "/placeholder.jpg"} sx={{
                  height: "450px",
                  aspectRatio: "9 / 12",
                }} />
                
                <Stack>
                  <Typography>Description</Typography>
                  <Box></Box>
                  <Typography>Tags</Typography>
                  <Box></Box>
                </Stack>
              </Box>
              {/* Owner avatar and nickname */}            
              <Box>
                <Avatar></Avatar>
              </Box>
            </Stack>
          </Container>
        )

      }
      
    </Box>
  )
}

export default QuizView;
