import React, { useState } from 'react'
import QuizCard from '@/components/quizCard';
import { Dispatch, SetStateAction } from "react"
import { Tag } from '@/types'

type TagFilterProps = {
    tags: Tag[],
    selectedTags: {name: string}[],
    setSelectedTags: Dispatch<SetStateAction<{ name: string }[]>>
}

const TagFilter = ({ tags, selectedTags, setSelectedTags }: TagFilterProps) => {

    return (
        <div>
        </div>
    )
}

export default TagFilter;
