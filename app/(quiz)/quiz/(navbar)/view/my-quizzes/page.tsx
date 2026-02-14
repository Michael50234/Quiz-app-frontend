import React from 'react';
import { Typography, Grid, Box, Toolbar } from '@mui/material';
import QuizDisplay from '@/components/quizDisplay';

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

const page = () => {
  return (
    <Box sx={{
      mt: "10px",
      pl: "10px",
      pr: "10px",
      height: "minmax(100vh, auto)",
      width: "100vw",
      backgroundColor: "var(--background)",
    }}>
      <Toolbar variant="dense"></Toolbar>
      
      <QuizDisplay quizzes={QuizList}></QuizDisplay>
    </Box>
  )
}

export default page
