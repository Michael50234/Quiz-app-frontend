'use client';

import { Box, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import QuizCard from '@/components/quizCard';
import QuizDisplayGrid from '@/components/quizDisplayGrid';
import { DisplayQuiz, QueryParameters, Tag } from '@/types'

type Quiz = {
  id: number
  title: string
  owner: {
    id: number
    nickname: string
  }
  tags: { name: string }[]
}

//Later on this should come from a db query
const QuizList: Quiz[] = [
  {
    "id": 1,
    "title": "Intro to Algebra",
    "owner": {
      "id": 3,
      "nickname": "michael"
    },
    "tags": [
      { "name": "math" },
      { "name": "algebra" }
    ]
  },
  {
    "id": 2,
    "title": "World Geography Basics",
    "owner": {
      "id": 5,
      "nickname": "alex"
    },
    "tags": [
      { "name": "geography" },
      { "name": "world" }
    ]
  },
  {
    "id": 3,
    "title": "Physics: Motion & Forces",
    "owner": {
      "id": 7,
      "nickname": "sam"
    },
    "tags": [
      { "name": "physics" },
      { "name": "mechanics" }
    ]
  },
  {
    "id": 3,
    "title": "Physics: Motion & Forces",
    "owner": {
      "id": 7,
      "nickname": "sam"
    },
    "tags": [
      { "name": "physics" },
      { "name": "mechanics" }
    ]
  },
  {
    "id": 3,
    "title": "Physics: Motion & Forces",
    "owner": {
      "id": 7,
      "nickname": "sam"
    },
    "tags": [
      { "name": "physics" },
      { "name": "mechanics" }
    ]
  },
  {
    "id": 3,
    "title": "Physics: Motion & Forces",
    "owner": {
      "id": 7,
      "nickname": "sam"
    },
    "tags": [
      { "name": "physics" },
      { "name": "mechanics" }
    ]
  }
]

const pages = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [quizzes, setQuizzes] = useState<DisplayQuiz[]>([]);
  const [queryParameters, setQueryParamerers] = useState<QueryParameters>({});
  const [tags, setTags] = useState<Array<Tag>>()

  useEffect(() => {
    fetchQuizzes();
    fetchTags();
    setLoading(false);
  }, [])

  const fetchQuizzes = async () => {
    const access_token = localStorage.getItem("access_token");

    const response = await fetch("http://127.0.0.1:8000/quizzes/public-quizzess", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`
      }
    });

    const data = await response.json();

    if(!response.ok){
      throw new Error("Failed to fetch quizzes");
    }
    setQuizzes(data);
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
    const data = await response.json();

    if(!response.ok) {
      throw new Error("Failed to fetch quizzes");
    }

    setTags(data);
  }

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
  });

  return (
    <Box sx={{
      mt: "10px",
      pl: "10px",
      pr: "10px",
      minHeight: "100vh",
      width: "100vw",
      backgroundColor: "var(--bg-dark)",
    }}>
      <Toolbar variant="dense"></Toolbar>
      
      <QuizDisplayGrid quizzes={quizzes}></QuizDisplayGrid>
    </Box>
  )
}

export default pages

