'use client';

import React, { useState } from 'react';
import { AppBar, Box, Button, Toolbar} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const [page, setPage] = useState("All-Quizzes");
    const router = useRouter();
    //Implement this
    const logoutHandler = () => {
        fetch("http://127.0.0.1:8000/accounts/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`
            },
            body: JSON.stringify({
                refresh: localStorage.getItem("refresh_token")
            })
        })
        
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("access_token");

        router.push("/");
    }

    return (
        <div>
            <AppBar sx={{
                    top: 0,
                    backgroundColor: "var(--navbar)",
                }}>
                <Toolbar variant="dense">
                    <Button onClick={() => setPage("All-Quizzes")} variant={page == "All-Quizzes" ? "contained" : "text"}sx={{
                        color: "white",
                        fontWeight: 600,
                        mr: "10px",
                        p: "8px",
                        pt: "3px",
                        pb: "3px"
                    }}><Link href="/quiz/view/all">All Quizzes</Link></Button>
                    <Button variant={ page == "My-Quizzes" ? "contained" : "text" }onClick={() => setPage("My-Quizzes")} sx={{
                        color: "white",
                        fontWeight: 600,
                        mr: "auto",
                        p: "8px",
                        pt: "3px",
                        pb: "3px"
                    }}><Link href="/quiz/view/my-quizzes">My Quizzes</Link></Button>
                    <Button onClick={logoutHandler} sx={{
                        color: "white",
                        fontWeight: 600,
                        p: "8px",
                        pt: "3px",
                        pb: "3px"
                    }}>Logout</Button>
                </Toolbar>
            </AppBar>
        </div>
  )
};

export default Navbar;
