'use client';

import { Box, Button, IconButton } from '@mui/material';
import style from './ImageCropper.module.css';
import React, { useCallback, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Cropper from 'react-easy-crop';


const ImageCropper = ({handleDialogClose, changeImageUrl, cropShape, aspectRatio, changeImageBlob}: 
    {handleDialogClose: () => void, changeImageUrl: (url: string) => void, changeImageBlob: (blob: Blob) => void, cropShape: "rect" | "round" | undefined, aspectRatio: number}) => {
    
    const [image, setImage] = useState<null | string>(null);
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Record<string, number> | null>(null);

    //Creates cropped image from crop detials and original image
    const getCroppedImage = (imageSrc: string, cropArea: Record<string, number>): Promise<Blob> => {
        return new Promise((resolve, reject) => {
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
                    if(!blob) {
                        reject(new Error("Canvas is empty"))
                    } else {
                        resolve(blob);
                    }
                }, "image/jpeg")
            }
        })
    }

    //Saves crop details when user is done cropping
    const onCropComplete = useCallback((_ : Record<string, number>, croppedPixels: Record<string, number>): void => {
        setCroppedAreaPixels(croppedPixels);
    }, [])

    //Creates a url for the image uploaded
    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];

        if(!file) {
            return;
        }

        const image_url = URL.createObjectURL(file);
        setImage(image_url);
    }

    //Changes pass in the cropAreaPixels as a state from outside, also pass in the image link state as a prop
    const onSave = async () => {
        try{
            if(!image || !croppedAreaPixels) return;

            const croppedImgBlob: Blob = await getCroppedImage(image, croppedAreaPixels);
            const croppedImgUrl = URL.createObjectURL(croppedImgBlob);
            changeImageUrl(croppedImgUrl);
            changeImageBlob(croppedImgBlob);

        } catch(error) {
            return;
        }
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
                <Button disabled={!croppedAreaPixels || !image} onClick={() => onSave()}>Save Image</Button>
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
                        cropShape={cropShape}
                        aspect={aspectRatio}
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
