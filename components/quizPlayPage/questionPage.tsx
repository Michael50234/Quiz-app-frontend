import { PlayQuestion } from '@/types'
import { Box, Grid, Stack, Typography } from '@mui/material'

type QuestionPageProps = {
  questionData: PlayQuestion | undefined
}

const QuestionPage = ({ questionData }: QuestionPageProps) => {
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
