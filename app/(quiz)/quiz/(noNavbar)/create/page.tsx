'use client';

import { CreateQuiz, Tag } from '@/types/index';
import React, { useEffect, useState } from 'react';
import ProfileCrop from '@/components/crop/profileCrop';
import { Box, Button, Container, Stack } from '@mui/material';
import DescriptionPage from '@/components/descriptionPage';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from '@/config/firebase.config';
import QuestionsPage from '@/components/questionsPage';

const page = () => {
  const [page, setPage] = useState<string>("description");
  const [pageData, setPageData] = useState<CreateQuiz>({
    title: "",
    is_public: false,
    cover_image_url: "/placeholder.jpg",
    description: "",
    questions: [{
      uid: crypto.randomUUID(),
      question: "",
      question_image_url: "/placeholder.jpg",
      choices: [{
        uid: crypto.randomUUID(),
        choice: "",
        is_answer: false
      }, 
      {
        uid: crypto.randomUUID(),
        choice: "",
        is_answer: false
      }, 
      {
        uid: crypto.randomUUID(),
        choice: "",
        is_answer: false
      },
      {
        uid: crypto.randomUUID(),
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
    .then(data => {
      if(data.tags){
        setTags(data.tags)
    }});
  }, []);

  const SaveImagesInFirebase = async (croppedImageBlob: Blob, save_path: string): Promise<(string | void)> => {
    try{    
          //Define where you want to store the image
          const imageRef = ref(storage, save_path);
            
          //Store the image
          await uploadBytes(imageRef, croppedImageBlob);

          //Get link to the storage location
          const downloadURL = await getDownloadURL(imageRef);

          return downloadURL
      } catch(error) {
          return;
      }
  }

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
    }));

  const changeCoverImageBlob = (blob: Blob) => {
      setPageData((prev) => ({
      ...prev,
      coverImageBlob: blob
    }));
  };

  const changeQuestionImageUrl = (uid: string, newUrl: string): void => {
    setPageData((prev) => 
      ({
        ...prev,
        questions: prev.questions.map((question) => {
          return question.uid != uid ? question : {
            ...question,
            question_image_url: newUrl
          }
        })
      })
    );
  }

  const changeQuestionImageBlob = (uid: string, blob: Blob): void => {
    setPageData((prev) => 
      ({
        ...prev,
        questions: prev.questions.map((question) => {
          return question.uid != uid ? question : {
            ...question,
            questionImageBlob: blob
          }
        })
      })
    );
  }

  const changeChoice = (questionUid: string, choiceUid: string, newChoice: string) => {
    setPageData((prev) => 
      ({
        ...prev,
        questions: prev.questions.map((question) => {
          return question.uid != questionUid? question : {
            ...question,
            choices: question.choices.map((choice) => {
              return choice.uid != choiceUid ? choice : 
              {
                ...choice,
                choice: newChoice
              }
            })
          }
        })
      })
    );
  }

  const changeQuestion = (uid: string, newQuestion: string) => {
    setPageData((prev) => 
      ({
        ...prev,
        questions: prev.questions.map((question) => {
          return question.uid != uid ? question : {
            ...question,
            question: newQuestion
          }
        })
      })
    )
  }

  const changeCorrectChoice = (questionUid: string, choiceUid: string) => {
    setPageData((prev) => ({
      ...prev,
      questions: prev.questions.map((question) => {
        return question.uid != questionUid ? question : {
          ...question,
          choices: question.choices.map((choice) => {
            return choice.uid === choiceUid ? {
              ...choice,
              is_answer: true
            } : {
              ...choice,
              is_answer: false
            }
          })
        }
      })
    }))
  }

  const addNewQuestion = () => {
    setPageData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          uid: crypto.randomUUID(),
          question: "",
          question_image_url: "/placeholder.jpg",
          choices: [{
            uid: crypto.randomUUID(),
            choice: "",
            is_answer: false
          }, 
          {
            uid: crypto.randomUUID(),
            choice: "",
            is_answer: false
          }, 
          {
            uid: crypto.randomUUID(),
            choice: "",
            is_answer: false
          },
          {
            uid: crypto.randomUUID(),
            choice: "",
            is_answer: false
          }]
        }
      ]
    }))
  }

  const deleteQuestion = (uid: string) => {
    setPageData((prev) => ({
      ...prev,
      questions: prev.questions.filter((question) => question.uid != uid)
    }))
  }

  return (
    <Box sx={{
      backgroundColor: "var(--background)",
      minHeight: "100vh"
    }}>
      <Box sx={{
        height: "100%",
         pl: "20px", 
         pr: "20px"}}>
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
            changeCoverImageUrl={changeCoverImageUrl}
            changeCoverImageBlob={changeCoverImageBlob}
            tagIds={pageData.tag_ids} 
            tags={tags} 
            changeTagIds={changeTagIds} 
            title={pageData.title} 
            coverImageUrl={pageData.cover_image_url} 
            changeTitle={changeTitle} 
            isPublic={pageData.is_public} 
            changeIsPublic={changePublicStatus} 
            description={pageData.description} 
            changeDescription={changeDescription}>
          </DescriptionPage> : 
          <QuestionsPage
            deleteQuestion={deleteQuestion}
            addNewQuestion={addNewQuestion}
            questions={pageData.questions} 
            changeQuestionImageUrl={changeQuestionImageUrl}
            changeQuestionImageBlob={changeQuestionImageBlob}
            changeChoice={changeChoice} 
            changeQuestion={changeQuestion}
            changeCorrectChoice={changeCorrectChoice}>
          </QuestionsPage>
        }
      </Box>
    </Box>
  )
}

export default page;
