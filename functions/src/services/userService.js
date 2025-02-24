import { db } from "../firebase.js";

export const getUserData = async (user) => {
  console.log("📌 getUserData викликано! User:", user);

  try {
    if (!user) {
      console.error("❌ Немає користувача");
      throw new Error("Unauthorized");
    }

    const userDoc = await db.collection("users").doc(user.uid).get();
    if (!userDoc.exists) {
      console.error("❌ Документ користувача не знайдено в Firestore");
      throw new Error("User document not found");
    }

    const userData = userDoc.data();
    console.log("✅ Дані користувача:", userData);

    const bookmarksRefs = userData?.bookmarks ?? [];

    // Отримуємо всі вправи за посиланнями
    const bookmarks = await Promise.all(
      bookmarksRefs.map(async (ref) => {
        const exerciseDoc = await db.doc(ref).get();
        if (!exerciseDoc.exists) {
          console.warn(`⚠️ Вправа не знайдена: ${ref}`);
          return null;
        }
        return { id: exerciseDoc.id, ...exerciseDoc.data() };
      })
    );

    // Фільтруємо `null` значення
    return { bookmarks: bookmarks.filter((b) => b !== null) };
  } catch (error) {
    console.error("❌ Помилка отримання користувача:", error);
    throw new Error("Failed to fetch user");
  }
};