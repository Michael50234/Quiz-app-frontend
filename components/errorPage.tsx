import { Box, Button, Typography } from "@mui/material"
import Link from "next/link"

const ErrorPage = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <Box sx={{
        width: "100%",
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    }}>
        <Typography sx={{
            fontSize: "3rem",
            fontWeight: 600
        }}>{errorMessage}</Typography>
        <Button><Link href="/quiz/view/all">Return To The View Quiz Page</Link></Button>
    </Box>
  )
}

export default ErrorPage
