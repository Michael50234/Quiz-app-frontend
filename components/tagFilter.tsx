"use state";

import React, { useMemo, useState } from 'react'
import QuizCard from '@/components/quizCard';
import { Dispatch, SetStateAction } from "react"
import { Tag } from '@/types'
import { Autocomplete, Box, Button, Chip, Menu, MenuItem, TextField } from '@mui/material';

type TagFilterProps = {
    tags: Tag[],
    selectedTagIds: number[],
    setSelectedTagIds: Dispatch<SetStateAction<number[]>>
}

const TagFilter = ({ tags, selectedTagIds, setSelectedTagIds }: TagFilterProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = useMemo(() => Boolean(anchorEl), [anchorEl])
    // Use a hash map for quick lookups of tag names from tag ids
    const tagIdToNameMap = useMemo(() => {
        let map: Record<number, string> = {}

        for(const tag of tags) {
            map[tag.id] = tag.name
        };

        return map;
    }, [tags])

    const tagnameToIdMap = useMemo(() => {
        let map: Record<string, number> = {}

        for(const tag of tags) {
            map[tag.name] = tag.id
        };

        return map;
    }, [tags])

    const menuCloseHandler = () => {
        setAnchorEl(null);
    };

    return (
        <Box>
            <Button onClick={(e) => setAnchorEl(e.currentTarget)}>Select Filter Tags</Button>
            <Menu
                open={open}
                anchorEl={anchorEl}
                onClose={menuCloseHandler} 
            >
                <MenuItem>
                    <Autocomplete
                        multiple
                        options={tags.map((tag) => {
                            return tag.name;
                        })}
                        renderInput={(params) => {
                            return <TextField {...params} label="Filter Tags" placeholder="Select Filter Tags"></TextField>
                        }}
                        renderValue={(value, params) => {
                            return value.map((tagName) => {
                                return <Chip variant="filled" label={tagName}></Chip>
                            })
                        }}
                        value={selectedTagIds.map((tagId) => {
                            return tagIdToNameMap[tagId];
                        })}
                        onChange={(e, value) => {
                            const tagIds = value.map((tagName) => {
                                return tagnameToIdMap[tagName]
                            })
                            setSelectedTagIds(tagIds)
                        }}
                        sx={{
                            width: "300px"
                        }}
                    >
                    </Autocomplete>
                </MenuItem>

            </Menu>
        </Box>
    )
}

export default TagFilter;
