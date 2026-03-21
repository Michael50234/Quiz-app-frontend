import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from '@/config/firebase.config';

export async function saveImageInFirebase(croppedImageBlob: Blob, save_path: string): Promise<(string)> {
    try {    
        //Define where you want to store the image
        const imageRef = ref(storage, save_path);
        
        //Store the image
        await uploadBytes(imageRef, croppedImageBlob);

        //Get link to the storage location
        const downloadURL = await getDownloadURL(imageRef);

        return downloadURL
    } catch(error) {
        throw Error("Failed to save image to firebase");
    }
}
