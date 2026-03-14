import LoadingSpinner from '@/components/loadingSpinner'
import { Box, Button, Toolbar } from '@mui/material'
import React from 'react'

const pages = () => {
  return (
    <Box>
      <Toolbar></Toolbar>
      <LoadingSpinner></LoadingSpinner>
    </Box>
  )
}

export default pages
