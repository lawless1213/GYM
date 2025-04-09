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
};
