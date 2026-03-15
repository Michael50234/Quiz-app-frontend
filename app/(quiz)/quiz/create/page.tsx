'use client';

import React, { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth"

import { CreateQuiz, CreateQuizResponse, Tag, EditQuizResponse, ErrorResponse } from '@/types/index';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Toolbar } from '@mui/material';
import DescriptionPage from '@/components/createQuizPage/descriptionPage';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from '@/config/firebase.config';
import QuestionsPage from '@/components/createQuizPage/questionsPage';
import { useRouter } from 'next/navigation';

const page = () => {
  const router = useRouter();
  const [saveDialogOpen, setSaveDialogOpen] = useState<boolean>(false);
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

  useEffect(() => {
    const loadData = async () => {
      await fetchTags();
    }
    try {
      loadData();
    } catch(error) {
      console.warn(error);
    }

    
  }, []);

  //Fetch all available tags from db
  const fetchTags = async () => {
      const token = localStorage.getItem("access_token");

      const response = await fetch("http://127.0.0.1:8000/quizzes/tags", {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
          },
      });

      if(!response.ok) {
          const error: ErrorResponse = await response.json();
          throw new Error("Failed to fetch tags")
      }

      const data: { tags: Tag[] } = await response.json()
      
      setTags(data.tags);
      return data.tags
  }

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

  //Saves quiz to database and the images to firebase 
  const saveQuiz = async () => {
    try{
      const token = localStorage.getItem("access_token");

      let pageDataCopy: CreateQuiz = {
        ...pageData
      };

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
        body: JSON.stringify(saveRequestData)
      });

      const data: CreateQuizResponse = await response.json();

      if(!response.ok){
        throw new Error("Creating Quiz Failed");
      }

      //Add ids to the questions and quiz
      pageDataCopy = {
        ...pageDataCopy,
        id: data.quiz_id,
        questions: pageDataCopy.questions.map((question) => ({
          id: data.question_ids[question.uid],
          ...question
        }))
      }

      //Get firebase uid
      const auth = getAuth();
      const uid = auth.currentUser?.uid;

      if(pageDataCopy.coverImageBlob){
        const coverImageUrl = await saveImageInFirebase(pageDataCopy.coverImageBlob, `/users/${uid}/quizzes/${data.quiz_id}/icon.jpg`);
        pageDataCopy = {
          ...pageDataCopy,
          cover_image_url: coverImageUrl
        }
      } 

      //Add question images to firebase and save link in pageData
      for(let questionObject of pageData.questions){
        if(!questionObject.questionImageBlob) continue;
        const questionImageUrl = await saveImageInFirebase(questionObject.questionImageBlob, `/users/${uid}/quizzes/${data.question_ids[questionObject.uid]}/questions/${questionObject.id}.jpg`);
        pageDataCopy = {
          ...pageDataCopy,
          questions: pageDataCopy.questions.map((question) => question.uid === questionObject.uid ? {
            ...question,
            question_image_url: questionImageUrl
          } : question)
        };
      }

      //Save new firebase image urls in db
      let {id: quiz_id, coverImageBlob: _, ...updateRequestData} = pageDataCopy;

      updateRequestData = {
        ...updateRequestData,
        questions: updateRequestData.questions.map((question) => {
          const {questionImageBlob, ...cleanedQuestion} = question;
          
          return cleanedQuestion;
        })
      };

      const updateResponse = await fetch(`http://127.0.0.1:8000/quizzes/quiz/${quiz_id}/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "Application/Json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateRequestData),
      });

      const updateData: EditQuizResponse = await updateResponse.json();

      if(!updateResponse.ok){
        throw new Error("Updating Quiz Failed")
      } else {
        console.log("Successfully saved quiz")
      }

      router.push("/quiz/view/all");
    } catch(error) {
      console.warn(error)
    }
  }

  return (
    <Box sx={{
      backgroundColor: "var(--bg-dark)",
      minHeight: "100vh"
    }}>
      <Toolbar></Toolbar>
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
      <Box sx={{
        position: "fixed",
        bottom: "0px",
        left: "0px",
        right: "0px",
        height: "60px",
        backgroundColor: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px"
      }}>
        <Button variant="contained" disabled={page !== "questions"}onClick={addNewQuestion}>Add New Question</Button>
        <Button variant="contained" onClick={() => setSaveDialogOpen(true)}>Save</Button>
        <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
          <DialogTitle>Confirm Save</DialogTitle>
          <DialogContent>
              <DialogContentText>
                Are you sure you want to save your changes? This action cannot be undone.
              </DialogContentText>
              <DialogActions>
                <Button onClick={saveQuiz}>Save</Button>
              </DialogActions>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  )
}

export default page;
