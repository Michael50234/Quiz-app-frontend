"use client";

import {
  Box,
  Button,
  FormControlLabel,
  Stack,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import QuizCard from "@/components/quizCard";
import QuizDisplayGrid from "@/components/quizDisplayGrid";
import { DisplayQuiz, ErrorResponse, QueryParameters, Tag } from "@/types";
import TagFilter from "@/components/tagFilter";
import SearchField from "@/components/searchBar";
import LoadingSpinner from "@/components/loadingSpinner";
import ProtectedPage from "@/components/ProtectedPage";
import ErrorPage from "@/components/errorPage";
import Link from "next/link";

type Quiz = {
  id: number;
  title: string;
  owner: {
    id: number;
    nickname: string;
  };
  tags: { name: string }[];
};

const pages = () => {
  // Used to indicate whether there was an issue loading the resources
  const [resourceLoadingError, setResourceLoadingError] =
    useState<boolean>(false);

  // Loading states
  const [isQuizListLoading, setIsQuizListLoading] = useState<boolean>(true);
  const [isTagsLoading, setIsTagsLoading] = useState<boolean>(true);

  // Resource states
  const [quizzes, setQuizzes] = useState<DisplayQuiz[]>([]);
  const [tags, setTags] = useState<Array<Tag>>([]);

  // Search params states
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  // True means show all quizzes. False means show only users quizzes.
  const [quizViewMode, setQuizViewMode] = useState<boolean>(true);

  // Fetch tags from server
  useEffect(() => {
    const loadTags = async () => {
      try {
        setIsTagsLoading(true);
        await fetchTags();
      } catch (error) {
        setResourceLoadingError(true);
      } finally {
        setIsTagsLoading(false);
      }
    };

    loadTags();
  }, []);

  // Fetch quizzes from server
  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setIsQuizListLoading(true);
        await fetchQuizzes();
      } catch (error) {
        // TODO: Show toast to users for errors after implementation
        // Also add a redirect here as the page cannot work without quizzes
      } finally {
        setIsQuizListLoading(false);
      }
    };

    loadQuizzes();
  }, [debouncedSearch, selectedTagIds, quizViewMode]);

  // Set debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  const fetchQuizzes = async () => {
    const access_token = localStorage.getItem("access_token");

    // Create query parameters using URLSearchParams
    const searchParameters = new URLSearchParams();

    // Add all selectedTagIds to query parameters
    for (const tagId of selectedTagIds) {
      searchParameters.append("tagId", `${tagId}`);
    }

    // Add search bar text to query parameters
    // Only add it if it is a non-empty string
    if (debouncedSearch.trim()) {
      searchParameters.append("searchText", debouncedSearch);
    }

    // Change the endpoint the request is sent to based on view mode
    const address = quizViewMode ? "public-quizzes" : "user-quizzes";

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/quizzes/${address}?${searchParameters.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error("Failed to fetch quizzes");
    }

    const data: { quizzes: DisplayQuiz[] } = await response.json();
    setQuizzes(data.quizzes);
  };

  const fetchTags = async () => {
    const access_token = localStorage.getItem("access_token");
    console.log(process.env.NEXT_PUBLIC_BACKEND_URL);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/quizzes/tags`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    if (!response.ok) {
      const error: ErrorResponse = await response.json();
      throw new Error("Failed to fetch quizzes");
    }

    const data: { tags: Tag[] } = await response.json();

    setTags(data.tags);
  };

  const deleteQuizHandler = async (id: number) => {
    const access_token = localStorage.getItem("access_token");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/quizzes/quiz/${id}/delete`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    if (!response.ok) {
      // TODO: Change this with snackbar
      console.error("Failed to delete quiz");
      return;
    }

    // TODO: success message with snackbar

    setQuizzes((prev) => {
      return prev.filter((quiz) => {
        return quiz.id !== id;
      });
    });
  };

  return (
    <Box
      sx={{
        mt: "10px",
        pl: "10px",
        pr: "10px",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "var(--bg-dark)",
      }}
    >
      {/* Push Content down to prevent it from being covered by navbar and search bar */}
      <Toolbar variant="dense"></Toolbar>
      <Box
        sx={{
          height: "70px",
        }}
      />
      <Stack
        direction="row"
        gap={3}
        sx={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          width: "fit-content",
          borderRadius: "100px",
          position: "fixed",
          top: "60px",
          left: "50vw",
          transform: "translateX(-50%)",
          zIndex: 10,
          mt: "10px",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <FormControlLabel
          onChange={(e) => setQuizViewMode((prev) => !prev)}
          checked={Boolean(quizViewMode)}
          control={<Switch />}
          label={quizViewMode ? "All Quizzes" : "My Quizzes"}
          sx={{
            width: "145px",
            ml: "3px",
          }}
        />
        <SearchField search={search} setSearch={setSearch}></SearchField>
        <TagFilter
          tags={tags}
          selectedTagIds={selectedTagIds}
          setSelectedTagIds={setSelectedTagIds}
        ></TagFilter>
      </Stack>
      <ProtectedPage>
        {isQuizListLoading || isTagsLoading ? (
          <LoadingSpinner />
        ) : !resourceLoadingError ? (
          <>
            <QuizDisplayGrid
              deleteQuizHandler={deleteQuizHandler}
              quizzes={quizzes}
            />
          </>
        ) : (
          <ErrorPage errorMessage="Failed to load quizzes" />
        )}
      </ProtectedPage>
    </Box>
  );
};

export default pages;
