'use client'

import { useState } from "react";
import { Autocomplete, TextField, Chip, Box } from "@mui/material";

const tagOptions = ["Math", "Science", "History", "Programming"];

export default function TagSelect() {
  const [tags, setTags] = useState<string[]>([]);

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
        options={tagOptions}
        value={tags}
        onChange={(_, newValue) => setTags(newValue)}
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