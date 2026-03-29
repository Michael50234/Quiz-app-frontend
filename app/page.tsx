'use client';

import { useContext, useState } from "react";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/config/firebase.config";

import { Box, Button, ButtonGroup, Container, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { ErrorResponse, User } from "@/types";
import { useUser } from "@/components/userProvider";

export default function Login() {
  const [page, setPage] = useState<string>("Sign-up");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const { loadUser } = useUser();


  function redirectToHome() {
    router.replace('/quiz/view/all')
  }

//Get a firebase token from the backend and send it to firebase auth to get a id_token, which is stored in your client (creates a session in firebase sdk)
  const firebaseLogin = async (): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/accounts/firebase-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
      }
    })
    
    const { firebase_token } = await response.json()

    const userCredential = await signInWithCustomToken(auth, firebase_token)
  }

  const handleLogin = async (username: string, password: string): Promise<void> => {
    try {
      let response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/accounts/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      //alert user of error
      if (!response.ok) {
        const error: ErrorResponse = await response.json()
        throw new Error(error.detail)
      }

      let data1 = await response.json();
      
    
      //store jwt tokens in local storage
      localStorage.setItem("access_token", data1.access);
      localStorage.setItem("refresh_token", data1.refresh);

      const token = localStorage.getItem("access_token")

      // Change the user in the global user state
      loadUser();

      // Log into firebase
      await firebaseLogin()

      // TODO: Add a successful snackbar message here

      redirectToHome();
    }
    catch(error) {
      // TODO: Make this set the snackbar state instead
      console.error(error);
    }
  };

  const handleSignup = async (username: string, password: string): Promise<void> => {
    try {
      let response  = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/accounts/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      //alert user of error
      if(!response.ok){
        const error: ErrorResponse = await response.json();
        throw new Error(error.detail);
      }

      let data1: { access: string, refresh: string } = await response.json();

      //Store jwt tokens in local storage
      localStorage.setItem("access_token", data1.access);
      localStorage.setItem("refresh_token", data1.refresh);

      const token = localStorage.getItem("access_token")

      // Change the user in the global user state
      loadUser();

      // Log the user into firebase
      await firebaseLogin()

      redirectToHome();

      // TODO: Add a successful snackbar message here
    }
    catch(error) {
      // TODO: Make this set the snack bar state instead
      alert(error);
    }
  };


  return (
    <>
      <Box sx={{
        backgroundColor: "var(--bg-dark)",
        minHeight: "100vh",
        minWidth: "100vw",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        display: "flex",
        alignItems: "center"
      }}>
        <Container sx={{
          borderRadius: "10px",
          backgroundColor: "var(--bg)",
          color: "black",
          width: "30%",
          alignItems: "center",
          padding: "20px",
        }}>
          <Stack spacing={4} justifyContent="center" alignItems="center" sx={{
            padding: "15px",
            width: "100%"
          }}>
            <ButtonGroup sx={{
              width: "100%"
            }}>
              <Button 
                size="large" 
                fullWidth 
                onClick={() => setPage("Login")} 
                variant={page === "Login" ? "contained" : "outlined"}
                color="secondary"
                sx={{
                  fontSize: "1.3rem",
                }}>Login</Button>
              <Button 
                size="large" 
                fullWidth 
                onClick={() => setPage("Sign-up")} 
                variant={page === "Login" ? "outlined" : "contained"}
                color="secondary"
                sx={{
                  fontSize: "1.3rem"
                }}
              >
                Sign-up
              </Button>
            </ButtonGroup>
            <Stack spacing={1} alignContent="center">
              <Typography textAlign="center" variant="h3" sx={{
                fontWeight: 600,
                fontSize: "4rem",
              }}>{page === "Login" ? "Login" : "Signup"} </Typography>
              <Typography variant="h6" color="var(--text-muted)" sx={{
                fontSize: "1.3rem",
                fontWeight: 500,
                textAlign: "center"
              }}>Welcome to my quiz app!</Typography>
            </Stack>
            <Stack spacing={2}>
              <TextField 
                variant="outlined" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                label="Username" />
              <TextField 
                type="password" 
                variant="outlined" 
                label="Password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} />
            </Stack>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              onClick={() => {
                if(page == "Login") {
                  handleLogin(username, password);
                }
                else {
                  handleSignup(username, password);
                }
              }}
              sx={{
                fontSize: "1.3rem",
              }}
            >Submit</Button>
          </Stack>
        </Container>
      </Box>
    </>
  )
}

