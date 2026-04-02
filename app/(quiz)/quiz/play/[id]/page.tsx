"use client";

import ErrorPage from "@/components/errorPage";
import LoadingSpinner from "@/components/loadingSpinner";
import ProtectedPage from "@/components/ProtectedPage";
import QuestionPage from "@/components/quizPlayPage/questionPage";
import QuizResultPage from "@/components/quizPlayPage/quizResultPage";
import { useToast } from "@/components/toastProvider";
import { ErrorResponse, PlayQuiz } from "@/types";
import { Box, keyframes, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useMemo } from "react";

type Animation = "in" | "out";

const page = () => {
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [checkAnswerLoading, setCheckAnswerLoading] = useState<boolean>(false);

  const quiz_id = useParams().id;

  const [quizData, setQuizData] = useState<null | PlayQuiz>(null);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const numQuestions = useMemo(() => {
    return (quizData?.questions ?? []).length;
  }, [quizData]);

  const [selectedChoiceId, setSelectedChoiceId] = useState<null | number>(null);
  const [correctChoiceId, setCorrectChoiceId] = useState<number | null>(null);

  const [animation, setAnimation] = useState<Animation>("in");

  // There are 2 types of pages. question and quizResult.
  const [page, setPage] = useState<string>("question");

  // Redirect user to quiz view page if the quiz has no questions
  useEffect(() => {
    if (quizData && numQuestions === 0) {
      router.replace("/quiz/view/all");
    }

    showError("This quiz has no questions");
  }, [loading]);

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchQuiz();
      } catch (error) {
        showError("Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const showNextQuestion = () => {
    // If the current question is the last question, move to the result page
    if (questionIndex === numQuestions - 1) {
      setPage("quizResult");
      return;
    }

    // Reset question states
    setCorrectChoiceId(null);
    setSelectedChoiceId(null);

    // Change to next question index
    // Use timeout to control animations
    setAnimation("out");
    setTimeout(() => {
      setAnimation("in");
      setQuestionIndex((prev) => {
        return prev + 1;
      });
    }, 600);
  };

  const checkQuestion = async (selectedChoiceId: number) => {
    try {
      setCheckAnswerLoading(true);

      const access_token = localStorage.getItem("access_token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/quizzes/check-question/${selectedChoiceId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      if (!response.ok) {
        const error: ErrorResponse = await response.json();
        throw new Error("Failed to check Answer");
      }

      const data: { correct_choice_id: number } = await response.json();
      const correctChoiceId = data.correct_choice_id;

      setCorrectChoiceId(correctChoiceId);

      if (correctChoiceId === selectedChoiceId) {
        setScore((prev) => prev + 1);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      setCheckAnswerLoading(false);
    }
  };

  const fetchQuiz = async () => {
    const access_token = localStorage.getItem("access_token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/quizzes/quiz/${quiz_id}/play`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error(error.detail);
    }

    const data: PlayQuiz = await response.json();

    setQuizData(data);
  };

  return (
    <Box
      sx={{
        overflow: "hidden",
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
          padding: "10px",
        }}
      >
        <Typography sx={{ ml: "5px" }}>
          Score: {`${score} / ${numQuestions}`}
        </Typography>
        <Typography
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            color: "variant",
          }}
        >
          Current Question: {questionIndex + 1}
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: "var(--bg-dark)",
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ProtectedPage>
          {loading ? (
            <LoadingSpinner />
          ) : quizData ? (
            page === "question" ? (
              <QuestionPage
                checkQuestion={checkQuestion}
                selectedChoiceId={selectedChoiceId}
                setSelectedChoiceId={setSelectedChoiceId}
                correctChoiceId={correctChoiceId}
                checkAnswerLoading={checkAnswerLoading}
                questionData={quizData?.questions[questionIndex]}
                animation={animation}
                showNextQuestion={showNextQuestion}
              />
            ) : (
              <QuizResultPage
                quiz_id={Number(quiz_id)}
                quizName={quizData?.title ?? ""}
                score={score}
                numQuestions={numQuestions}
                coverImageUrl={quizData?.cover_image_url ?? "/placeholder.jpg"}
              />
            )
          ) : (
            <ErrorPage errorMessage="Quiz Not Found" />
          )}
        </ProtectedPage>
      </Box>
    </Box>
  );
};

export default page;
