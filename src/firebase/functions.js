import { ref, uploadBytes, getDownloadURL, deleteObject  } from "firebase/storage";
import { storage } from "./firebase";
import { v4 as uuidv4 } from 'uuid';

export const uploadFile = async (file, folder) => {
  if (!file) return null;
  const uniqueName = `${uuidv4()}_${file.name}`;
  const storageRef = ref(storage, `${folder}/${uniqueName}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const deleteFile = async (fileUrl) => {
  if (!fileUrl) return;
  const storageRef = ref(storage, fileUrl);
  try {
      await deleteObject(storageRef);
  } catch (error) {
      console.warn("Помилка при видаленні файлу:", error);
  }
};