'use client';

import { Box, Stack, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import QuizCard from '@/components/quizCard';
import QuizDisplayGrid from '@/components/quizDisplayGrid';
import { DisplayQuiz, ErrorResponse, QueryParameters, Tag } from '@/types'
import TagFilter from '@/components/tagFilter';
import SearchBar from '@/components/searchBar';

type Quiz = {
  id: number
  title: string
  owner: {
    id: number
    nickname: string
  }
  tags: { name: string }[]
}

const pages = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [quizzes, setQuizzes] = useState<DisplayQuiz[]>([]);
  const [queryParameters, setQueryParamerers] = useState<QueryParameters>({});
  const [tags, setTags] = useState<Array<Tag>>()

  useEffect(() => {
    const loadData = async () => {
      await fetchQuizzes();
      await fetchTags();
    }

    try {
      loadData();
    } catch(error) {
      throw new Error(error instanceof Error ? error.message : "An error has occured");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQuizzes = async () => {
    const access_token = localStorage.getItem("access_token");

    const response = await fetch("http://127.0.0.1:8000/quizzes/public-quizzes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`
      }
    });

    if(!response.ok){
      const error: ErrorResponse = await response.json();
      throw new Error("Failed to fetch quizzes");
    }
    
    const data: { quizzes: DisplayQuiz[] } = await response.json();

    setQuizzes(data.quizzes);
    console.log(quizzes)
  };

  const fetchTags = async () => {
    const access_token = localStorage.getItem("access_token");

    const response = await fetch("http://127.0.0.1:8000/quizzes/tags", {
      method: "GET", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`
      }
    });

    if(!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error("Failed to fetch quizzes");
    }

    const data: { tags: Tag[]} = await response.json();

    setTags(data.tags);
  }

  const deleteQuizHandler = async (id: number) => {
    const access_token = localStorage.getItem("access_token")

    const response = await fetch(`http://127.0.0.1:8000/quizzes/quiz/${id}/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`
      }
    })

    if(!response.ok) {
      // TODO: Change this with snackbar
      console.error("Failed to delete quiz")
      return
    }

    // TODO: success message with snackbar

    setQuizzes((prev) => {
      return prev.filter((quiz) => {
        return quiz.id !== id;
      })
    });
  }

  return <Box sx={{
      mt: "10px",
      pl: "10px",
      pr: "10px",
      minHeight: "100vh",
      width: "100vw",
      backgroundColor: "var(--bg-dark)",
    }}>{loading ? (<h1 style={{margin: "50px"}}>
        ...Loading
      </h1>) 
    : (<>
        <Toolbar variant="dense"></Toolbar>
        <Stack direction="row">
          <SearchBar></SearchBar>
          <TagFilter></TagFilter>
        </Stack>
        <QuizDisplayGrid deleteQuizHandler={deleteQuizHandler} quizzes={quizzes}></QuizDisplayGrid>
      </>)} 
    </Box>
}

export default pages

