'use client';

import ErrorPage from '@/components/errorPage';
import LoadingSpinner from '@/components/loadingSpinner'
import ProtectedPage from '@/components/ProtectedPage';
import { useUser } from '@/components/userProvider';
import { ErrorResponse, QuizDetailViewResponse } from '@/types'
import { Avatar, Box, Button, Chip, Container, Stack, Toolbar, Typography } from '@mui/material'
import { useParams, useRouter } from 'next/navigation';
import React, { use, useEffect, useState } from 'react'

const QuizView = () => {
  const router = useRouter();
  const quizId = useParams().id;
  const [quizData, setQuizData] = useState<QuizDetailViewResponse | null>(null);
  const [numSelectedQuestions, setNumSelectedQuestions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUser();

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadQuiz();
      } catch(error) {
        // If the client fails to load the quiz, error page UI will be shown
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [])

  const loadQuiz = async () => {
    const access_token = localStorage.getItem("access_token");

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/quizzes/quiz/${quizId}`, {
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
      <ProtectedPage>
        {
          loading ? (
            <LoadingSpinner />
          ) : quizData ? (
            <Container sx={{
              width: "50vw",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "80vh"
            }}>
              <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ 
                width: "100%",
              }}>
                <Typography sx={{
                    fontWeight: "600",
                    fontSize: "2rem"
                }}>
                  {quizData?.title}
                </Typography>
                <Box sx={{
                  display: "flex",
                  gap: 2,
                  height: "60%",
                  width: "100%",
                  justifyContent: "center"
                }}>
                  <Box component="img" src={ quizData?.cover_image_url || "/placeholder.jpg"} sx={{
                    height: "450px",
                    aspectRatio: "9 / 12",
                  }} />
                  
                  <Stack spacing={1.5} sx={{
                    height: "450px",
                    flex: 1,
                  }}>
                    <Stack>
                      <Typography sx={{
                        fontWeight: "600",
                        fontSize: "1.3rem"
                      }}>
                        Description
                      </Typography>
                      <Typography sx={{
                        backgroundColor: "var(--muted-surface)",
                        borderRadius: "5px",
                        padding: "3px"
                      }}>{quizData?.description}</Typography>
                    </Stack>
                    <Stack spacing={0.5} sx={{
                      flex: 1
                    }}>
                      <Typography sx={{
                        fontWeight: "600",
                        fontSize: "1.3rem"
                      }}>
                        Tags
                      </Typography>
                      <Box sx={{
                        backgroundColor: "var(--muted-surface)",
                        padding: "5px",
                        borderRadius: "5px",
                        minHeight: "150px",
                        flex: "1"
                      }}>
                        {quizData?.tags.map((tag) => {
                          return <Chip key={tag.id} label={tag.name}/>
                        })}
                      </Box>
                    </Stack>
                    <Button variant="contained" onClick={() => router.push(`/quiz/play/${quizId}`)}>Play</Button>
                  </Stack>
                </Box>
                {/* Owner avatar and nickname */}            
                <Box sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  height: "object-fit"
                }}>
                  <Avatar src={ user?.profile_picture_url }></Avatar>
                  <Typography sx={{
                    fontSize: "0.9rem",
                    color: "var(--text-muted)"
                  }}>Created by {quizData?.owner.nickname}</Typography>
                </Box>
              </Stack>
            </Container>
          ) : (
            <ErrorPage errorMessage="Quiz Not Found"/>
          )
        }
      </ProtectedPage>
    </Box>
  )
}

export default QuizView;
