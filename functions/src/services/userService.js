import { db } from "../firebase.js";

export const getUserData = async (user) => {
  console.log("📌 getUserData викликано! User:", user); // Лог користувача

  try {
    if (!user) {
      console.error("❌ Немає користувача");
      throw new Error('Unauthorized');
    }

    const snapshot = db.collection("users").doc(user.uid);
    const docSnapshot = await snapshot.get();

    if (!docSnapshot.exists) {
      console.error("❌ Документ користувача не знайдено в Firestore");
      throw new Error("User document not found");
    }

    const data = docSnapshot.data();
    console.log("✅ Дані користувача:", data);

    return { bookmarks: data?.bookmarks ?? [] };
  } catch (error) {
    console.error("❌ Помилка отримання користувача:", error);
    throw new Error("Failed to fetch user");
  }
};