'use client'

import React, { useState } from 'react';
import ProfileCrop from '@/components/crop/profileCrop';
import { Box, Button, Container, Stack } from '@mui/material';

const DescriptionPage = ({}) => {
  return (
    <div>
        <Container sx={{width: "70%", border: "2px solid black", height: "500px"}}>
          <Stack direction={"row"} sx={{height: "100%"}}>
            <img src={coverURL} style={{height: '100%', objectFit: "cover"}}></img>
          <Stack>

          </Stack>
          </Stack>
        </Container>
    </div>
  )
}

export default DescriptionPage;
