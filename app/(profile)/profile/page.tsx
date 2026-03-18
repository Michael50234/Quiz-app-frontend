'use client';

import { Box, Toolbar, Typography } from '@mui/material'
import { User } from '@/types'
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/loadingSpinner' 

const page = () => {
  const [userData, setUserData] = useState<null | User>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {

  }, []);

  const loadUserData = async () => {
    const access_token = localStorage.getItem("access_token");
  }

  return (
    <Box sx={{
      backgroundColor: "var(--bg-light)",
      minHeight: "100vh",
      width: "100vw",
      pl: "20px",
      pr: "20px"
    }}>
      <Toolbar></Toolbar>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box>
          <Typography>Hello</Typography>
        </Box>
      )}
    </Box>
  )
}

export default page
