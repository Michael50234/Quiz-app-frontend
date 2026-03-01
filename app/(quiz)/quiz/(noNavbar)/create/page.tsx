'use client';

import React, { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth"

import { CreateQuiz, Tag } from '@/types/index';
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

  const saveImageInFirebase = async (croppedImageBlob: Blob, save_path: string): Promise<(string)> => {
    try{    
          //Define where you want to store the image
          const imageRef = ref(storage, save_path);
            
          //Store the image
          await uploadBytes(imageRef, croppedImageBlob);

          //Get link to the storage location
          const downloadURL = await getDownloadURL(imageRef);

          return downloadURL
      } catch(error) {
          throw Error("Failed to save image to firebase");
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

  const saveQuiz = async () => {
    const token = localStorage.getItem("access_token");
    let {
      coverImageBlob,
      ...saveRequestData
    } = pageData;

    saveRequestData = {
      ...saveRequestData,
      questions: saveRequestData.questions.map((question) => {
        if(question.questionImageBlob) {
          const {
            questionImageBlob, ...cleanedQuestionData
          } = question;

          return cleanedQuestionData;
        }
        return question;
      })
    }

    //Save quiz and get the ids for the quiz and questions
    const response = await fetch("http://127.0.0.1:8000/quizzes/create-quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(pageData)
    });

    const data: {
      quiz_id: number,
      question_ids: Record<string, number>,
      detail: string
    } = await response.json();

    //Add ids to the current data
    //Work here
    
    //Get firebase uid
    const auth = getAuth();
    const uid = auth.currentUser?.uid;


    if(!pageData.coverImageBlob) return;
    //Add cover image to firebase and save link in page data
    const coverImageUrl = await saveImageInFirebase(pageData.coverImageBlob, `/users/${uid}/quizzes/${data.quiz_id}/icon.jpg`)
    setPageData((prev) => ({
      ...prev,
      coverImageUrl: coverImageUrl
    }))

    //Add question images to firebase and save link in page data
    for(let questionObject of pageData.questions){
      if(!questionObject.questionImageBlob) return;

      const question_id = data.question_ids[questionObject.uid]
      const questionImageUrl = await saveImageInFirebase(questionObject.questionImageBlob, `/users/${uid}/quizzes/${data.quiz_id}/questions/${question_id}.jpg`)
      setPageData((prev) => ({
        ...prev,
        questions: prev.questions.map((question) => question.uid === questionObject.uid ? {
          ...question,
          question_image_url: questionImageUrl
        } : question)
      }))
    }

    //Now we need to save the new image urls in the database

  }


  return (
    <Box sx={{
      backgroundColor: "var(--bg-dark)",
      minHeight: "100vh"
    }}>
      <Box sx={{
          minHeight: "100vh",
          pl: "20px", 
          pr: "20px",
          display: "flex",
          flexDirection: "column"}}>
        <Container>
          <Stack 
            direction="row" 
            justifyContent={"center"} 
            spacing={2} 
            sx={{
              p: "10px",
            }}>
            <Button 
              sx={{ 
                width: "120px",
                "&.MuiButton-contained": {
                  backgroundColor: "var(--secondary)",
                  "&:hover": {
                      backgroundColor: "var(--secondary-hover)",
                  },
                  color: "hsl(0, 0%, 5%)",
                },
                "&.MuiButton-outlined": {
                  border: "1px solid HSLA(39, 59%, 73%, 0.5)",
                  color: "hsl(0, 0%, 35%)"
                }
              }} 
              variant={page === "description" ? "contained" : "outlined"} 
              onClick={() => setPage("description")}>Description
            </Button>
            <Button 
              sx={{ 
                width: "120px",
                "&.MuiButton-contained": {
                  backgroundColor: "var(--secondary)",
                  "&:hover": {
                      backgroundColor: "var(--secondary-hover)",
                  },
                  color: "hsl(0, 0%, 5%)",
                },
                "&.MuiButton-outlined": {
                  border: "1px solid HSLA(39, 59%, 73%, 0.5)",
                  color: "hsl(0, 0%, 35%)"
                }
              }} 
              variant={page === "questions" ? "contained" : "outlined"} 
              onClick={() => setPage("questions")}>Questions
            </Button>
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
