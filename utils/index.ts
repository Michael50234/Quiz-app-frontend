import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "@/config/firebase.config";
import { CreateQuiz, EditQuiz } from "@/types";

export async function saveImageInFirebase(
  croppedImageBlob: Blob,
  save_path: string,
): Promise<string> {
  try {
    //Define where you want to store the image
    const imageRef = ref(storage, save_path);

    //Store the image
    await uploadBytes(imageRef, croppedImageBlob);

    //Get link to the storage location
    const downloadURL = await getDownloadURL(imageRef);

    return downloadURL;
  } catch (error) {
    throw Error("Failed to save image to firebase");
  }
}

export function validateQuiz(quiz: EditQuiz | CreateQuiz) {
  // Check that the quiz has a title
  if (!quiz.title) {
    throw new Error("Quiz must have a title");
  }

  for (const questionObject of quiz.questions) {
    // Check the question has a description
    if (!questionObject.question) {
      throw new Error("Question descriptions cannot be blank");
    }

    // Check that every question has a choice marked correct
    let existsCorrectChoice = false;
    for (const choice of questionObject.choices) {
      if (choice.is_answer) {
        existsCorrectChoice = true;
      }

      // Check that all choices have a description
      if (!choice.choice) {
        throw new Error("All choices must have a description");
      }
    }

    if (!existsCorrectChoice) {
      throw new Error("All questions must have an answer");
    }
  }

  return true;
}
