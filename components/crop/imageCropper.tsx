'use client';

import { Box, Button, IconButton } from '@mui/material';
import style from './ImageCropper.module.css';
import React, { useCallback, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Cropper from 'react-easy-crop';
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from '@/config/firebase.config';


const ImageCropper = ({handleDialogClose, savePath, setURL, cropShape, aspectRatio}: {handleDialogClose: () => void, savePath: string, setURL: (url: string) => void, cropShape: "rect" | "round" | undefined, aspectRatio: number}) => {
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

    const onSave = async (save_path: string) => {
        try{
            if(!image || !croppedAreaPixels) return;

            const cropped_img: Blob = await getCroppedImage(image, croppedAreaPixels)
            
            //Define where you want to store the image
            const imageRef = ref(storage, save_path);
            
            //Store the image
            await uploadBytes(imageRef, cropped_img);

            //Get link to the storage location
            const downloadURL = await getDownloadURL(imageRef);

            //Saves url in db and UI
            setURL(downloadURL)
            handleDialogClose()
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
                <Button disabled={!croppedAreaPixels || !image} onClick={() => onSave(savePath)}>Save Image</Button>
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
