import { Box, keyframes, Stack } from '@mui/material';

const resultAnimation = keyframes`
  0% {
    transform: scale(50%);
    opacity: 0.4;
  }
  100% {
    transform; scale(100%);
    opacity: 1;
  }
`;

const QuizResultPage = () => {
  return (
    <Stack sx={{
      backgroundColor: "var(--bg)",
      height: "500px",
      width: "300px",
      alignItems: "center",
      animation: `${resultAnimation} 0.7s ease-in-out`
    }}>
      Results
    </Stack>
  )
}

export default QuizResultPage;
