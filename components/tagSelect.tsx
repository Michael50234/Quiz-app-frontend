'use client'

import { CreateQuiz, Tag } from '@/types/index';
import { useState } from "react";
import { Autocomplete, TextField, Chip, Box } from "@mui/material";

export default function TagSelect({tags, tagIds, changeTagIds} : { tags: Tag[], tagIds: number[], changeTagIds: (newValue: number[]) => void}) {

  return (
    <Autocomplete
        fullWidth
        sx={{
            "& .MuiAutocomplete-inputRoot": {
                pt: "10px",
                pb: "10px"
            }
        }}
        multiple
        options={tags.map((tag) => tag.name)}
        value={tags
            .filter((tag) => tagIds.includes(tag.id))
            .map((filteredTag) => filteredTag.name)}
        
        onChange={(_, newValue) => changeTagIds(tags
            .filter((tag) => newValue.includes(tag.name))
            .map((tag) => tag.id)
        )}
        renderInput={(params) => (
            <TextField sx={{
                width: "100%"
            }} {...params} variant="filled" placeholder={tags.length === 0 ? "Select tags" : ""} />
        )}
        slotProps={{
            chip: {
                sx: {
                        backgroundColor: "var(--secondary-light)",
                        borderRadius: "2px",
                    },
                },
            }
        }
    />
  );
}