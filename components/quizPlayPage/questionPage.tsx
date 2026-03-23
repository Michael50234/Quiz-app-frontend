import { Box, Grid, Stack, Typography } from '@mui/material'
import React from 'react'

const QuestionPage = () => {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{
        width: "60%",
    }}>
        <Typography>Question</Typography>
        <Box></Box>
        <Grid container>
            <Grid size={6} sx={{ textAlign: "center"}}>Option 1</Grid>
            <Grid size={6} sx={{ textAlign: "center"}}>Option 2</Grid>
            <Grid size={6} sx={{ textAlign: "center"}}>Option 3</Grid>
            <Grid size={6} sx={{ textAlign: "center"}}>Option 4</Grid>
        </Grid>
    </Stack>
  )
}

export default QuestionPage;
