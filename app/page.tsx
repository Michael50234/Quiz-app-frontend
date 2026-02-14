'use client';

import React, { useState } from "react";

import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/config/firebase.config";

import Image from "next/image";
import styles from "./page.module.css";
import { Box, Button, ButtonGroup, Container, Stack, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const [page, setPage] = useState<string>("Sign-up");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();


  function redirectToHome() {
    router.push('/quiz/view/all')
  }

//Get a firebase token from the backend and send it to firebase auth to get a id_token, which is stored in your client (creates a session in firebase sdk)
  const firebaseLogin = async (): Promise<void> => {
    const response = await fetch("http://127.0.0.1:8000/accounts/firebase-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`
      }
    })
    
    const { firebase_token } = await response.json()

    await signInWithCustomToken(auth, firebase_token)

  }

  const handleLogin = async (username: string, password: string): Promise<void> => {
    try {
      const response = await fetch("http://127.0.0.1:8000/accounts/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });
      const data = await response.json();

      //alert user of error
      if (!response.ok) {
        alert(data.detail);
        return;
      }
      //store jwt tokens in local storage
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      redirectToHome();
    }
    catch(error) {
      console.error(error);
    }
  };

  const handleSignup = async (username: string, password: string): Promise<void> => {
    try {
      const response  = await fetch("http://127.0.0.1:8000/accounts/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await response.json();

      //alert user of error
      if(!response.ok){
        alert(data.detail);
        return;
      }
      //Store jwt tokens in local storage
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      
      redirectToHome();
    }
    catch(error) {
      console.error(error);
    }
  };


  return (
    <>
      <Box sx={{
        backgroundColor: "var(--background)",
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
          backgroundColor: "white",
          color: "black",
          width: "40%",
          display: "flex",
          justifyContent: "center",
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
              <Button size="large" fullWidth onClick={() => setPage("Login")} variant={page === "Login" ? "contained" : "outlined"}>Login</Button>
              <Button size="large" fullWidth onClick={() => setPage("Sign-up")} variant={page === "Login" ? "outlined" : "contained"} >Sign-up</Button>
            </ButtonGroup>
            <Stack spacing={1} alignContent="center">
              <Typography textAlign="center" variant="h3" sx={{
                fontWeight: 800
              }}>{page === "Login" ? "Login" : "Signup"} </Typography>
              <Typography variant="h6" color="var(--text-muted)">Welcome to my quiz app!</Typography>
            </Stack>
            <Stack spacing={2}>
              <TextField variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)}label="Username" sx={{
                minWidth: "300px",
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                }
              }}>Username</TextField>
              <TextField variant="outlined" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                }
              }}>Password</TextField>
            </Stack>
            <Button variant="contained" size="large" onClick={() => {
                if(page == "Login") {
                  handleLogin(username, password);
                }
                else {
                  handleSignup(username, password);
                }

              }
            }>Submit</Button>
          </Stack>
        </Container>
      </Box>
    </>
  )
}

