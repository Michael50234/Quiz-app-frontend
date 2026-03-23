'use client';

import LoadingSpinner from "@/components/loadingSpinner";
import QuestionPage from "@/components/quizPlayPage/questionPage";
import QuestionResultPage from "@/components/quizPlayPage/questionResultPage";
import QuizResultPage from "@/components/quizPlayPage/quizResultPage";
import { ErrorResponse, PlayQuiz } from "@/types";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect, useState, use, useRef } from "react";

const page = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const quiz_id = useParams().id;
    const [quizData, setQuizData] = useState<null | PlayQuiz>(null);
    const questionIndex = useRef<number>(0);
    // There are 3 types of pages. question, questionResult, and quizResult.
    const [page, setPage] = useState<string>("question")

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
            {loading ? (
                <LoadingSpinner />
            ) : (
                page === "question" ? (<QuestionPage />) : (
                    page === "questionResult" ? (<QuestionResultPage />) : (<QuizResultPage />)
                )
            )}
        </Box>
    )
}

export default page
