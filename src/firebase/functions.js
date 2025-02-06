import { ref, uploadBytes, getDownloadURL, deleteObject  } from "firebase/storage";
import { db, storage } from "./firebase";
import { v4 as uuidv4 } from 'uuid';
import { collection, doc, query, where, getDoc, getDocs } from "firebase/firestore";

export const FirebaseService = {
  async uploadFile(file, folder) {
    if (!file) return null;
    const uniqueName = `${uuidv4()}_${file.name}`;
    const storageRef = ref(storage, `${folder}/${uniqueName}`);
    await uploadBytes(storageRef, file);
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
    const conditions = Object.entries(filters)
      .filter(([_, value]) => value)
      .map(([key, value]) => where(key, "==", value));

    const q = conditions.length > 0 ? query(collection(db, "exercises"), ...conditions) : collection(db, "exercises");
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};
