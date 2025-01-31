import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import { v4 as uuidv4 } from 'uuid';

export const uploadFile = async (file, folder) => {
  if (!file) return null;
  const uniqueName = `${uuidv4()}_${file.name}`;
  const storageRef = ref(storage, `${folder}/${uniqueName}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};