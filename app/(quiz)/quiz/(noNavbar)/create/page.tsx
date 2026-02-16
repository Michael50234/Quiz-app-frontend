'use client';

import React, { useState } from 'react';
import ProfileCrop from '@/components/crop/profileCrop';
import { Box, Button, Container, Stack } from '@mui/material';
import DescriptionPage from '@/components/descriptionPage';

const page = () => {
  const [page, setPage] = useState<string>("description")
  const [pageData, setPageData] = useState('/placeholder.jpg')

  return (
    <Box sx={{
      backgroundColor: "var(--background)",
      minHeight: "100vh",
    }}>
      <Box sx={{height: "100%", pl: "20px", pr: "20px"}}>
        <Container>
          <Stack direction="row" justifyContent={"center"} spacing={2} sx={{
            p: "10px",
          }}>
            <Button sx={{ width: "120px"}}variant={page === "description" ? "contained" : "outlined"} onClick={() => setPage("description")}>Description</Button>
            <Button sx={{ width: "120px"}} variant={page === "questions" ? "contained" : "outlined"} onClick={() => setPage("questions")}>Questions</Button>
          </Stack>
        </Container>
        <DescriptionPage></DescriptionPage>
      </Box>
    </Box>
  )
}

export default page
