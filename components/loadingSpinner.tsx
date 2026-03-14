import React from 'react'
import styles from './loadingSpinner.module.css'
import { Box, Toolbar } from '@mui/material'

const LoadingSpinner = () => {
  return (
    <Box sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: "0px",
        left: "0px",
        right: "0px"
    }}>
        <div className={styles.spinner}></div>
    </Box>
  )
}

export default LoadingSpinner
