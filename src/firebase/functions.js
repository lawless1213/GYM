import { ref, uploadBytes, getDownloadURL, deleteObject  } from "firebase/storage";
import { db, storage } from "./firebase";
import { v4 as uuidv4 } from 'uuid';
import { collection, doc, query, where, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";


export const getToken = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    console.error("❌ Користувач неавторизований!");
    return null;
  }

  const token = await user.getIdToken();
  return token;
};

export const FirebaseService = {
  async uploadFile(file, folder) {
    if (!file) return null;
    
    const uniqueName = `${uuidv4()}_${file.name}`;
    const storageRef = ref(storage, `${folder}/${uniqueName}`);
    
    const metadata = {
      cacheControl: "public, max-age=31536000, immutable", 
      contentType: file.type,
    };
  
    await uploadBytes(storageRef, file, metadata);
    return await getDownloadURL(storageRef);
  },

  async deleteFile(fileUrl) {
    if (!fileUrl) return;
    const storageRef = ref(storage, fileUrl);
    try {
        await deleteObject(storageRef);
    } catch (error) {
        console.warn("Помилка при видаленні файлу:", error);
    }
  },

  async updateExercise(exerciseId, updatedData, imageFile = null, videoFile = null) {
    const exerciseRef = doc(db, "exercises", exerciseId);
    const exerciseDoc = await getDoc(exerciseRef);
    
    if (!exerciseDoc.exists()) throw new Error("Exercise not found");
  
    const existingData = exerciseDoc.data();

    const updatedExercise = { ...existingData, ...updatedData };
  
    try {
      if (existingData.preview) await this.deleteFile(existingData.preview);
      updatedExercise.preview = null;
      if (imageFile) updatedExercise.preview = await this.uploadFile(imageFile, "preview");
      
      if (existingData.video) await this.deleteFile(existingData.video);
      updatedExercise.video = null;
      if (videoFile) updatedExercise.video = await this.uploadFile(videoFile, "video");
      
      await updateDoc(exerciseRef, updatedExercise);
      return updatedExercise;
    } catch (error) {
      console.error("Error updating exercise:", error);
      throw error;
    }
  },
};
