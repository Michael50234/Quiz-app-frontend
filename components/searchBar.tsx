"use client";

import { Box, InputAdornment, TextField } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";
import SearchIcon from "@mui/icons-material/Search";

type SearchBarProps = {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
};

const SearchField = ({ search, setSearch }: SearchBarProps) => {
  return (
    <TextField
      placeholder="Search..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      variant="outlined"
      sx={{
        width: "300px",
        "& .MuiInputBase-root": {
          borderRadius: "200px",
          height: "40px",
          fontSize: "1rem",
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default SearchField;
