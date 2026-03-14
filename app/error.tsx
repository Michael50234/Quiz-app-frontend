'use client';

import { Box, Button, Typography } from "@mui/material";

export default function Error({
    error,
    reset,
} : {
    error: Error,
    reset: () => void
}) {
    return (
        <Box>
            <Typography>{`Something went wrong: ${error.message}`}</Typography>
            <Button onClick={reset}>
                Try Again
            </Button>
        </Box>
    )
}