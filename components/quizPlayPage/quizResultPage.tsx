import { Box, Button, keyframes, Stack, Typography } from '@mui/material';

type QuizResultPageProps = {
  quizName: string,
  numQuestions: number,
  score: number,
  coverImageUrl: string,
}

const resultAnimation = keyframes`
  0% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  100% {
    transform; scale(1);
    opacity: 1;
  }
`;

const QuizResultPage = ({numQuestions, quizName, coverImageUrl, score} : QuizResultPageProps) => {
  return (
    <Stack spacing={3.5} sx={{
      backgroundColor: "var(--bg)",
      height: "80%",
      alignItems: "center",
      animation: `${resultAnimation} 0.7s ease-in-out`,
      p: "30px",
      borderRadius: "40px",
    }}>
      <Typography sx={{ fontSize: "3rem", fontWeight: 600}}>Results</Typography>
      <Stack alignItems="center" spacing={2}>
        <Box component="img" src={coverImageUrl} sx={{
          width: "350px",
          aspectRatio: "9 / 12"
        }}/>
        <Stack spacing={1}>
          <Typography textAlign="center" sx={{ fontSize: "1.5rem"}}>Quiz Name: {quizName}</Typography>
          <Typography textAlign="center" sx={{ fontSize: "1.5rem"}}>Score: {`${score} / ${numQuestions}`}</Typography>
        </Stack>
      </Stack>
      <Button variant="contained" color="primary">Return To Quiz Dashboard</Button>
    </Stack>
  )
}

export default QuizResultPage;
