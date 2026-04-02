"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { DisplayQuiz } from "@/types";
import { useRouter } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";
import { useUser } from "./userProvider";

type QuizCard = {
  quiz: DisplayQuiz;
  deleteQuizHandler: (id: number) => Promise<void>;
  id: number;
};

const QuizCard = ({ quiz, id, deleteQuizHandler }: QuizCard) => {
  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id;
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const editQuizHandler = () => {
    router.push(`/quiz/edit/${id}`);
  };

  return (
    <Box>
      <Card
        sx={{
          height: "560px",
          width: "290px",
          backgroundColor: "var(--bg)",
          boxShadow:
            "0px 2px 10px 1px rgba(0,0,0, 0.1), 0px 10px 50px 5px rgba(0,0,0, 0.08)",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            height: "560px",
          }}
        >
          <Box
            sx={{
              minHeight: "100px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <IconButton
              disabled={userId !== quiz.owner.id}
              onClick={() => setDeleteDialogOpen(true)}
              sx={{ ml: "auto", mt: "5px", mb: "5px", height: "10px" }}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
            <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this quiz? This action cannot
                  be undone.
                </DialogContentText>
                <DialogActions>
                  <Button onClick={handleDeleteDialogClose}>
                    Cancel Action
                  </Button>
                  <Button
                    onClick={async () => {
                      setDeleteLoading(true);
                      await deleteQuizHandler(quiz.id);
                      setDeleteLoading(false);
                    }}
                    sx={{
                      color: "error.main",
                      height: "40px",
                    }}
                  >
                    {deleteLoading ? <CircularProgress /> : "Delete"}
                  </Button>
                </DialogActions>
              </DialogContent>
            </Dialog>
            <Typography
              variant="h5"
              sx={{
                mb: "5px",
                fontWeight: 600,
              }}
            >
              {quiz.title}
            </Typography>
            <Typography sx={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Created by {quiz.owner.nickname}
            </Typography>
          </Box>
          <Box
            component="img"
            src={quiz.cover_image_url}
            sx={{
              display: "block",
              aspectRatio: 9 / 12,
              width: "255px",
              borderRadius: "20px",
            }}
          />
          <Box
            sx={{
              display: "flex",
              mt: "10px",
              gap: 0.6,
              justifyContent: "center",
            }}
          >
            <Button
              color="secondary"
              variant="contained"
              onClick={(e) => {
                editQuizHandler();
              }}
              disabled={userId != quiz.owner.id}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              onClick={() => router.push(`/quiz/view/${id}`)}
            >
              Play
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default QuizCard;
