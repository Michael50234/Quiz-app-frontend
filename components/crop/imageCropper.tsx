'use client';

import { Box, Button, IconButton } from '@mui/material';
import style from './ImageCropper.module.css'
import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import Cropper from 'react-easy-crop';

const ImageCropper = ({handleDialogClose}: {handleDialogClose: () => void}) => {
    const [image, setImage] = useState<null | string>(null);
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);


    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if(!file) {
            return;
        }

        const image_url = URL.createObjectURL(file);
        setImage(image_url);
        


    }

    return (
        <Box sx={{
            width: "100%",
            padding: "5px",
        }}>
            <Box sx={{display: "flex"}}>
                <Button component="label" sx={{
                    mr: "auto",
                    textTransform: "none",
                    justifyContent: "flex-start"
                
                }}>
                    <span>Choose An Image</span>
                    <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={onSelectFile}
                    ></input>
                </Button>
                <IconButton onClick={handleDialogClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box sx={{
                position: "relative",
                height: "400px",
                width: "100%",
            }}>
                {image != null ? (
                    <Cropper 
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                    >

                    
                    </Cropper>
                ) : 
                <img src="/placeholder.jpg" style={{objectFit: "cover", height: "100%", width: "100%"}}></img>}

            </Box>
        </Box>
    )
};

export default ImageCropper;
