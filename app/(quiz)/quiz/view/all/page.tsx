'use client';

import { Box, Button, FormControlLabel, Stack, Switch, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import QuizCard from '@/components/quizCard';
import QuizDisplayGrid from '@/components/quizDisplayGrid';
import { DisplayQuiz, ErrorResponse, QueryParameters, Tag } from '@/types'
import TagFilter from '@/components/tagFilter';
import SearchField from '@/components/searchBar';
import LoadingSpinner from '@/components/loadingSpinner';

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
  const [tags, setTags] = useState<Array<Tag>>([]);
  const [searchBarText, setSearchBarText] = useState<string>("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  // True means show all quizzes. False means show only users quizzes.
  const [quizViewMode, setQuizViewMode] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchQuizzes();
        await fetchTags();
      } catch(error) {
        throw new Error(error instanceof Error ? error.message : "An error has occurred");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const fetchQuizzes = async () => {
    const access_token = localStorage.getItem("access_token");

    const response = await fetch("http://127.0.0.1:8000/quizzes/public-quizzes", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${access_token}`
      }
    });

    if(!response.ok){
      const error: ErrorResponse = await response.json();
      throw new Error("Failed to fetch quizzes");
    }
    
    const data: {quizzes: DisplayQuiz[]} = await response.json();

    setQuizzes(data.quizzes);
    console.log(quizzes)
  };

  const fetchTags = async () => {
    const access_token = localStorage.getItem("access_token");

    const response = await fetch("http://127.0.0.1:8000/quizzes/tags", {
      method: "GET", 
      headers: {
        "Authorization": `Bearer ${access_token}`
      }
    });

    if(!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error("Failed to fetch quizzes");
    }

    const data: {tags: Tag[]} = await response.json();

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

  const onSearch = async () => {
    try {
      setLoading(true);
      const access_token = localStorage.getItem("access_token");

      // Create query parameters using URLSearchParams
      const searchParameters = new URLSearchParams();

      // Add all selectedTagIds to query parameters
      for(const tagId of selectedTagIds) {
        searchParameters.append("tagId", `${tagId}`);
      }

      // Add search bar text to query parameters
      // Only add it if it is a non-empty string
      if(searchBarText.trim()) {
        searchParameters.append("searchText", searchBarText);
      }
      
      // Change the endpoint the request is sent to based on view mode
      const address = quizViewMode ? "public-quizzes" : "user-quizzes";

      const response = await fetch(`http://127.0.0.1:8000/quizzes/${address}?${queryParameters.toString()}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${access_token}`
        }
      });

      if(!response.ok) {
        const error: ErrorResponse = await response.json();
        throw new Error("Failed to search for quizzes");
      }

      const data: {quizzes: DisplayQuiz[]} = await response.json();
      setQuizzes(data.quizzes);
    } catch(error) {
      // TODO: Show error message on snackbar here
      console.warn(error)
    } finally {
      setLoading(false);
    }
  }


  return <Box sx={{
      mt: "10px",
      pl: "10px",
      pr: "10px",
      minHeight: "100vh",
      width: "100vw",
      backgroundColor: "var(--bg-dark)",
    }}>
      <Stack direction="row" gap={3} sx={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          width: "fit-content",
          borderRadius: "100px",
          position: "fixed",
          top: "60px",
          left: "50vw",
          transform: "translateX(-50%)",
          zIndex: 10,
          mt: "10px",
          alignItems: "center",
          padding: "10px"
        }}>
          <FormControlLabel onChange={(e) => setQuizViewMode((prev) => !prev)} checked={Boolean(quizViewMode)} control={<Switch />} label={quizViewMode ? "All Quizzes" : "My Quizzes"} sx={{
            width: "145px",
            ml: "3px"
          }}/>
          <SearchField searchBarText={searchBarText} setSearchBarText={setSearchBarText}></SearchField>
          <TagFilter tags={tags} selectedTagIds={selectedTagIds} setSelectedTagIds={setSelectedTagIds}></TagFilter>
          <Button onClick={onSearch}disabled={loading} variant="contained" color="primary" sx={{
            borderRadius: "30px",
            "&:hover": {
              backgroundColor: "var(--primary-hover)"
            }
          }}>Search</Button>
      </Stack>
      {loading ? (
        <LoadingSpinner />
      ) : (<>
        <Toolbar variant="dense"></Toolbar>
        <Box sx={{
          height: "70px"
        }}></Box>
        <QuizDisplayGrid deleteQuizHandler={deleteQuizHandler} quizzes={quizzes}></QuizDisplayGrid>
      </>)} 
    </Box>
}

export default pages

