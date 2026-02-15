'use client';

import { Box, Button, IconButton } from '@mui/material';
import style from './ImageCropper.module.css'
import React, { useCallback, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import Cropper from 'react-easy-crop';


//Create cropped image and then save to firebase storage
//Create save button which toggles disabled state

const ImageCropper = ({handleDialogClose}: {handleDialogClose: () => void}) => {
    const [image, setImage] = useState<null | string>(null);
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Record<string, number> | null>(null);

    const getCroppedImage = (imageSrc: string, cropArea: Record<string, number>) => {
        return new Promise((resolve) => {
            const image = new Image();
            image.src = imageSrc;


            image.onload = () => {
                //Creates a canvas
                const canvas = document.createElement("canvas");
                canvas.width = cropArea['width'];
                canvas.height = cropArea['height'];
                
                //Ctx is used to draw on the canvas
                const ctx = canvas.getContext("2d");

                if(!ctx){
                    return;
                }
                
                //Draws the cropped image onto the canvas
                ctx.drawImage(
                    image, 
                    cropArea.x,
                    cropArea.y,
                    cropArea.width,
                    cropArea.height,
                    0,
                    0,
                    cropArea.width,
                    cropArea.height
                )
                
                //Takes whatever is on the canvas and turns it into an image format then a blob
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, "image/jpeg")
            }
        })
    }

    const onCropComplete = useCallback((_, croppedPixels: Record<string, number>) => {
        setCroppedAreaPixels(croppedPixels);
    }, [])


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
                <Button>Save Image</Button>
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
                        onCropComplete={onCropComplete}
                    >

                    
                    </Cropper>
                ) : 
                <img src="/placeholder.jpg" style={{objectFit: "cover", height: "100%", width: "100%"}}></img>}

            </Box>
        </Box>
    )
};

export default ImageCropper;
