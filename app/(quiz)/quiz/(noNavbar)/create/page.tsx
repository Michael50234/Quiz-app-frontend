'use client';

import { CreateQuiz, Tag } from '@/types/index';
import React, { useEffect, useState } from 'react';
import ProfileCrop from '@/components/crop/profileCrop';
import { Box, Button, Container, Stack } from '@mui/material';
import DescriptionPage from '@/components/descriptionPage';

const page = () => {
  const [page, setPage] = useState<string>("description");
  const [pageData, setPageData] = useState<CreateQuiz>({
    title: "",
    is_public: false,
    cover_image_url: "/placeholder.jpg",
    description: "",
    questions: [{
      question: "",
      question_image_url: "",
      choices: [{
        choice: "",
        is_answer: false
      }, 
      {
        choice: "",
        is_answer: false
      }, 
      {
        choice: "",
        is_answer: false
      },
      {
        choice: "",
        is_answer: false
      }]
    }],
    tag_ids: []
  });

  const [tags, setTags] = useState<Tag[]>([]);

  //Fetch all available tags from db
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    console.log(token)

    fetch("http://127.0.0.1:8000/quizzes/tags", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
    .then((res) => res.json())
    .then(data => setTags(data.tags));
  }, []);


  const changeTagIds = (newValue: number[]) => 
    setPageData((prev) => ({
      ...prev,
      tag_ids: newValue
    }));

  const changeTitle = (newTitle: string) => 
    setPageData((prev) => ({
      ...prev,
      title: newTitle,
    }));
  

  const changePublicStatus = (is_public: boolean) => 
    setPageData((prev) => ({
      ...prev,
      is_public: is_public
    }));

  const changeDescription = (description: string) =>
    setPageData((prev) => ({
      ...prev,
      description: description
    }));

  const changeCoverImageUrl = (newUrl: string) => 
    setPageData((prev) => ({
      ...prev,
      cover_image_url: newUrl
    }))

  return (
    <Box sx={{
      backgroundColor: "var(--background)",
      minHeight: "100vh"
    }}>
      <Box sx={{height: "100%", pl: "20px", pr: "20px"}}>
        <Container>
          <Stack direction="row" justifyContent={"center"} spacing={2} sx={{
            p: "10px",
          }}>
            <Button sx={{ width: "120px"}} variant={page === "description" ? "contained" : "outlined"} onClick={() => setPage("description")}>
              Description
            </Button>
            <Button sx={{ width: "120px"}} variant={page === "questions" ? "contained" : "outlined"} onClick={() => setPage("questions")}>Questions</Button>
          </Stack>
        </Container>
        { page === "description" ? 
          <DescriptionPage 
            tagIds={pageData.tag_ids} 
            tags={tags} 
            changeTagIds={changeTagIds} 
            title={pageData.title} 
            coverImageUrl={pageData.cover_image_url} 
            changeCoverImageUrl={changeCoverImageUrl}
            changeTitle={changeTitle} 
            isPublic={pageData.is_public} 
            changeIsPublic={changePublicStatus} 
            description={pageData.description} 
            changeDescription={changeDescription}>
          </DescriptionPage> : 
          <></>
        }
      </Box>
    </Box>
  )
}

export default page;
