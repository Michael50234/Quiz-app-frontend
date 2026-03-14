'use client';

import { Box, TextField } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'

type SearchBarProps = { 
    searchBarText: string,
    setSearchBarText: Dispatch<SetStateAction<string>>
}

const SearchBar = ({ searchBarText, setSearchBarText }: SearchBarProps) => {
  return (
    <TextField value={searchBarText} onChange={(e) => setSearchBarText(e.target.value)} variant="outlined" sx={{
        width: "20%",
        "& .MuiInputBase-root": {
            borderRadius: "200px",
        },
    }}></TextField>
  )
}

export default SearchBar;
