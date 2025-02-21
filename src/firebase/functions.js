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

  async getExercisesByGroup(group, userId, filters = {}) {
    if (!userId && group !== 'all') return [];

    if (group === "personal") {
      return this.getExercisesByAuthor(userId);
    } else if (group === "bookmarks") {
      return this.getBookmarkedExercises(userId);
    } else {
      return this.getAllExercises(filters);
    }
  },

  async getExercisesByAuthor(userId) {
    const q = query(collection(db, "exercises"), where("author", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getBookmarkedExercises(userId) {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) return [];
  
    let bookmarks = userDoc.data().bookmarks;

    if (!Array.isArray(bookmarks)) return [];
    bookmarks = bookmarks.filter(path => typeof path === "string");
  
    const docs = await Promise.all(bookmarks.map(path => getDoc(doc(db, path))));
    return docs.filter(doc => doc.exists()).map(doc => ({ id: doc.id, ...doc.data() }));
  }
  ,

  async getAllExercises(filters) {
    if (!filters.name || !Array.isArray(filters.values) || filters.values.length === 0) {
        console.log("Фільтр не задано або він порожній, отримуємо всі вправи...");
        const snapshot = await getDocs(collection(db, "exercises"));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    console.log("Filter key:", filters.name);
    console.log("Filter values:", JSON.stringify(filters.values, null, 2));

    // Використовуємо "array-contains" або "array-contains-any"
    const condition = filters.values.length === 1
        ? where(filters.name, "array-contains", filters.values[0])
        : where(filters.name, "array-contains-any", filters.values);

    const q = query(collection(db, "exercises"), condition);

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}


};
