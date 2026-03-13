'use client';

import { Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

import { EditQuiz, EditQuizResponse, Tag, ErrorResponse, QuizDetailViewResponse, SnackbarState } from '@/types';
import DescriptionPage from '@/components/editQuizPage/descriptionPage';
import QuestionsPage from '@/components/editQuizPage/questionsPage';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/config/firebase.config';
import { getAuth } from 'firebase/auth';
import { useParams, useRouter } from 'next/navigation'

const page = () => {
    const [page, setPage] = useState<string>("description")
    const [pageData, setPageData] = useState<EditQuiz | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [tags, setTags] = useState<Tag[]>([]);
    const router = useRouter()
    const [errorSnackbar, setErrorSnackbar] = useState<SnackbarState>({
        open: false,
        message: "",
        retry: null
    })

    //Get quizId from route parameters
    const params = useParams()
    const quizId = Number(params.id)

    //Fetch quiz data
    const fetchQuiz = async (tags: Tag[]) => {
        const access_token = localStorage.getItem("access_token");

        const response = await fetch(`http://127.0.0.1:8000/quizzes/quiz/${quizId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
        });

        if(!response.ok){
            const error: ErrorResponse = await response.json();
            throw new Error("Fetching Quiz Data Failed");
        }

        const data: QuizDetailViewResponse = await response.json();
        
        let newPageData: EditQuiz = {
            id: data.id,
            title: data.title,
            cover_image_url: data.cover_image_url,
            is_public: data.is_public,
            description: data.description,
            tag_ids: data.tags?.map((quizTag) => {
                const selectedTag = tags.find((tag) => {
                    return tag.name === quizTag.name;
                })
                
                if(!selectedTag) {
                    throw new Error("Tag id from quiz is not valid")
                }

                return selectedTag.id
            }) ?? [],
            questions: data.questions?.map((question) => {
                return {
                    uid: crypto.randomUUID(),
                    id: question.id,
                    question: question.question,
                    question_image_url: question.question_image_url,
                    choices: question.choices.map((choice) => {
                        return {
                            id: choice.id,
                            uid: crypto.randomUUID(),
                            choice: choice.choice,
                            is_answer: choice.is_answer
                        }
                    })
                }
            }) ?? []
        }

        setPageData(newPageData);
    }

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

    useEffect(() => {
        const loadData = async () => {
            const tags = await fetchTags()
            await fetchQuiz(tags)
        }

        try {
            loadData();
        } catch(error) {
            //TODO: create an error.tsx page and let this propogate
            console.warn(error);
        } finally {
            setLoading(false);
        }
    }, [])
    

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
        setPageData((prev) => {
            if(prev === null) return null;
            return {
                ...prev,
                tag_ids: newValue
            };
        });

    const changeTitle = (newTitle: string) => 
        setPageData((prev) => {
            if(prev === null) return null;

            return {
                ...prev,
                title: newTitle,
            };
        });
    

    const changePublicStatus = (is_public: boolean) => 
        setPageData((prev) => {
            if(!prev) return null;

            return {
                ...prev,
                is_public: is_public
            };
        });

    const changeDescription = (description: string) =>
    setPageData((prev) => {
        if(!prev) return null;

        return {
            ...prev,
            description: description
        };
    });

    const changeCoverImageUrl = (newUrl: string) => 
    setPageData((prev) => {
        if(!prev) return null;
        return {
            ...prev,
            cover_image_url: newUrl
        };
    });

    const changeCoverImageBlob = (blob: Blob) =>
        setPageData((prev) => {
            if(!prev) return null;
            return {
                ...prev,
                coverImageBlob: blob
            };
        });


    const changeQuestionImageUrl = (uid: string, newUrl: string): void => {
        setPageData((prev) => {
            if(!prev) return null;

            return {
                ...prev,
                questions: prev.questions.map((question) => {
                    return question.uid != uid ? question : {
                        ...question,
                        question_image_url: newUrl
                    }
                })
            };
        });
    }

    const changeQuestionImageBlob = (uid: string, blob: Blob): void =>
        setPageData((prev) => {
            if(!prev) return null;

            return {
                ...prev,
                questions: prev.questions.map((question) => {
                    return question.uid != uid ? question : {
                        ...question,
                        questionImageBlob: blob
                    }
                })
            };
        });


    const changeChoice = (questionUid: string, choiceUid: string, newChoice: string) =>
        setPageData((prev) => {
            if(!prev) return null;

            return {
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
            };
        });

    const changeQuestion = (uid: string, newQuestion: string) => 
        setPageData((prev) => {
            if(!prev) return null;

            return {
                ...prev,
                questions: prev.questions.map((question) => {
                    return question.uid != uid ? question : {
                    ...question,
                    question: newQuestion
                    }
                })
            };
        });

    const changeCorrectChoice = (questionUid: string, choiceUid: string) =>
        setPageData((prev) => {
            if(!prev) return null;

            return {
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
            }
        })

    const addNewQuestion = () => 
        setPageData((prev) => {
            if(!prev) return null;
            return {
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
            }}
        )

    const deleteQuestion = (uid: string) => 
    setPageData((prev) => {
        if(!prev) return null;

        return {
            ...prev,
            questions: prev.questions.filter((question) => question.uid != uid)
        }
    })

    //Update the quiz in the database and store new images into firebase
    const saveQuiz = async () => {
        try {
            const token = localStorage.getItem("access_token");
            
            if(!pageData) return;

            let pageDataCopy = {
                ...pageData
            };
            
            let { coverImageBlob, cover_image_url, ...updateData } = pageDataCopy;

            updateData = {
                ...updateData,
                questions: updateData.questions.map((question) => {
                    let { questionImageBlob, question_image_url, ...cleanedQuestion } = question;

                    return cleanedQuestion
                })
            };

            //Create the new questions added to the quiz and get their id
            let response = await fetch(`http://127.0.0.1:8000/quizzes/${quizId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            let data: EditQuizResponse = await response.json();

            if(!response.ok){
                throw new Error("Updating Quiz Failed")
            }

            //Add returned question ids to pageDataCopy
            pageDataCopy = {
                ...pageDataCopy,
                questions: pageDataCopy.questions.map((question) => {
                    return {
                        ...question,
                        id: data["question_ids"][question.uid]
                    }
                })
            }


            const auth = getAuth();
            const uid = auth.currentUser?.uid;

            // Save images in firebase

            // Save cover images
            if(pageDataCopy.coverImageBlob) {
                pageDataCopy.cover_image_url = await saveImageInFirebase(pageDataCopy.coverImageBlob, `users/${uid}/quizzes/${quizId}/icon.jpg`)
            }
            
            // Save question images
            pageDataCopy.questions = await Promise.all(pageDataCopy.questions.map(async (question) => {
                if(question.questionImageBlob) {
                    const new_image_url = await saveImageInFirebase(question.questionImageBlob, `/users/${uid}/quizzes/${quizId}/questions/${data["question_ids"][question.uid]}.jpg`)

                    return {
                        ...question,
                        question_image_url: new_image_url
                    }
                }

                return question
            }));
            
            ({ coverImageBlob, ...updateData } =  pageDataCopy);
            
            updateData = {
                ...updateData,
                questions: updateData.questions.map((question) => {
                    const { questionImageBlob, ...cleanedQuestion } = question
                    return cleanedQuestion
                })
            }

            // Save new firebase image urls in firebase
            response = await fetch(`http://127.0.0.1:8000/quizzes/${quizId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            })

            data = await response.json()

            if(!response.ok) {
                throw new Error("Failed to save quiz")
            }

            setPageData(pageDataCopy)
            router.push('/quiz/')
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
            { loading ? (
                <Typography>Loading ...</Typography>
            ) : pageData ? (<Box sx={{
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
                    saveQuiz={saveQuiz}
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
            </Box>) : (
                <Typography>Quiz not found</Typography>
            )}
        </Box>
    )
}


export default page;
