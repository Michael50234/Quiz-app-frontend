'use client';

import LoadingSpinner from '@/components/loadingSpinner';
import ProtectedPage from '@/components/ProtectedPage';
import { useToast } from '@/components/toastProvider';
import { ErrorResponse, SubmissionResponse } from '@/types';
import { Box, Stack, Toolbar, Typography } from '@mui/material'
import { useEffect, useState } from 'react';

const page = () => {
    const [submissions, setSubmissions] = useState<SubmissionResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const { showError, showSuccess } = useToast();

    useEffect(() => {
        const loadData = async () => {
            try {
                await fetchSubmissions();
            } catch(error) {
                showError("Failed to load submissions")
            } finally {
                setLoading(false)
            }
        }

        loadData();
    }, []);

    // Fetchs all submissions for user
    const fetchSubmissions = async () => {
        const access_token = localStorage.getItem("access_token")

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/quizzes/submission`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        });

        if(!response.ok) {
            const error: ErrorResponse = await response.json();
            throw new Error(error.detail);
        }

        const data: { submissions: SubmissionResponse[] } = await response.json();
        setSubmissions(data.submissions);
    }

    return (
        <Box 
            sx={{
                backgroundColor: "var(--bg-dark)",
                width: "100%",
                minHeight: " 100vh",
                overflowX: "hidden"
            }}
        >
            <Toolbar />
            <ProtectedPage>
                { loading ? (
                    <LoadingSpinner />
                ) : (
                    <Stack 
                        sx={{
                            width: "100%"
                        }}
                        alignItems="center"
                        justifyContent="center"
                        spacing={4}
                    >
                        <Typography sx={{
                            pt: "10px",
                            fontSize: "2rem",
                            fontWeight: "600",
                        }}>
                            Submissions
                        </Typography>
                        <Stack spacing={2} 
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                width: "100%"
                            }}
                        >
                            {submissions.map((submission) => {
                                return (
                                    <Stack 
                                        alignItems="center"
                                        justifyContent="center"
                                        sx={{
                                            width: "40%",
                                            backgroundColor: "var(--bg-light)",
                                            borderRadius: "10px",
                                            height: "100px",
                                            boxShadow: "0px 2px 10px 1px rgba(0,0,0, 0.1), 0px 10px 50px 5px rgba(0,0,0, 0.08)",
                                        }}
                                        key={submission.id}
                                    >
                                        <Typography sx={{ fontWeight: "600" }}>{submission.quiz_title}</Typography>
                                        <Typography>Score: {`${submission.score} / ${submission.number_of_questions}`}</Typography>
                                        <Typography sx={{
                                            color: "var(--text-muted)",
                                            fontSize: "0.9rem"
                                        }}>Played On {submission.submission_time}</Typography>
                                    </Stack>
                                )
                            })}
                        </Stack>
                    </Stack>
                )}
            </ProtectedPage>
        </Box>
    )
}

export default page
