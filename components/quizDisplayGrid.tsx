"use client";

import React, { useEffect, useState } from "react";
import QuizCard from "@/components/quizCard";
import { Box, Grid, Stack } from "@mui/material";
import { DisplayQuiz } from "@/types";

type QuizDisplayGrid = {
  quizzes: DisplayQuiz[];
  deleteQuizHandler: (id: number) => Promise<void>;
};

const QuizDisplayGrid = ({ quizzes, deleteQuizHandler }: QuizDisplayGrid) => {
  return (
    <div
      style={{
        marginLeft: "40px",
        marginRight: "40px",
      }}
    >
      <Stack
        direction="row"
        sx={{ flexWrap: "wrap", alignItems: "flex-start", gap: 3 }}
      >
        {quizzes.map((quiz) => {
          return (
            <Box key={quiz.id}>
              <QuizCard
                deleteQuizHandler={deleteQuizHandler}
                quiz={quiz}
                id={quiz.id}
              ></QuizCard>
            </Box>
          );
        })}
      </Stack>
    </div>
  );
};

export default QuizDisplayGrid;
