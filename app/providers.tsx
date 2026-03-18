"use client";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { theme } from "./theme";
import Navbar from "@/components/navbar";
import { usePathname } from 'next/navigation';
import { useEffect } from "react";

//Only show navbar for these addresses
const navbarAddresses = new Set<string>(['/profile', '/quiz/create', '/quiz/view/all', '/profile'])
const viewQuizPagePattern = /^\/quiz\/view\/\d+$/
const editQuizPagePattern = /^\/quiz\/edit\/\d+$/

export function Providers({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      { (navbarAddresses.has(pathName) || viewQuizPagePattern.test(pathName) || editQuizPagePattern.test(pathName)) && <Navbar></Navbar>}
      {children}
    </ThemeProvider>
  );
}