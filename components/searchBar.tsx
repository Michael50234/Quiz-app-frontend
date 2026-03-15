'use client';

import { Box, InputAdornment, TextField } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'
import SearchIcon from '@mui/icons-material/Search';

type SearchBarProps = { 
    searchBarText: string,
    setSearchBarText: Dispatch<SetStateAction<string>>
}

const SearchBar = ({ searchBarText, setSearchBarText }: SearchBarProps) => {
  return (
    <TextField placeholder="Search..." value={searchBarText} onChange={(e) => setSearchBarText(e.target.value)} variant="outlined" sx={{
        width: "300px",
        "& .MuiInputBase-root": {
            borderRadius: "200px",
            height: "40px",
            fontSize: "1rem"
        },
    }}
    slotProps={{
      input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
      }
    }} />
  )
}

export default SearchBar;
