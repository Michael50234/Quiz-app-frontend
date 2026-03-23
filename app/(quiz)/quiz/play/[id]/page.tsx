'use client';

import LoadingSpinner from "@/components/loadingSpinner";
import QuestionPage from "@/components/quizPlayPage/questionPage";
import QuizResultPage from "@/components/quizPlayPage/quizResultPage";
import { ErrorResponse, PlayQuiz } from "@/types";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState, use, useRef, useMemo } from "react";

const page = () => {
    const [loading, setLoading] = useState<boolean>(true);

    const quiz_id = useParams().id;

    const [quizData, setQuizData] = useState<null | PlayQuiz>(null);
    const [questionIndex, setQuestionIndex] = useState<number>(0);
    const [numCorrectQuestions, setNumCorrectQuestions] = useState<number>(0)
    const numQuestions = useMemo(() => {
        return (quizData?.questions ?? []).length;
    }, [quizData])

    // There are 2 types of pages. question and quizResult.
    const [page, setPage] = useState<string>("question");

    const showNextQuestion = () => {
        setQuestionIndex((prev) => {
            return prev + 1
        });
    }

    // Fetch data
    useEffect(() => {
        const loadData = async () => {
            try {
                await fetchQuiz()
            } catch(error) {
                console.warn(error)
                // TODO: Use snackbar to show error here and redirect
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const fetchQuiz = async () => {
        const access_token = localStorage.getItem("access_token");
        const response = await fetch(`http://127.0.0.1:8000/quizzes/quiz/${quiz_id}/play`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}` 
            }
        });

        if(!response.ok) {
            const error: ErrorResponse = await response.json();
            throw new Error(error.detail)
        }

        const data: PlayQuiz = await response.json();
        console.log(data);
        setQuizData(data);
    }

    return ( 
        <Box 
            sx={{
                backgroundColor: "var(--bg-dark)",
                minHeight: "100vh",
                width: "100vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Box 
                sx={{
                    display: "flex",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "var(--bg)",
                    padding: "10px"
                }}
            >
                <Typography>Score: {`${numCorrectQuestions} / ${numQuestions}`}</Typography>
                <Typography sx={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: "variant"
                }}>Current Question: {questionIndex + 1}</Typography>
            </Box>
            {loading ? (
                <LoadingSpinner />
            ) : (
                page === "question" ? (<QuestionPage questionData={quizData?.questions[questionIndex]} />) : (<QuizResultPage />)
            )}
        </Box>
    )
}

export default page
