import { db } from "../firebase.js";

export const getUserData = async (user) => {
  if (!user || !user.uid) {
    console.error("❌ Недійсний користувач:", user);
    throw new Error("Invalid user object");
  }

  try {
    const userRef = db.collection("users").doc(user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.error("❌ Документ користувача не знайдено в Firestore");
      return { bookmarks: [] };
    }

    const userData = userDoc.data();
    const bookmarkIds = userData?.bookmarks || [];

    // Отримуємо дані вправ за їх ID
    const bookmarks = await Promise.all(
      bookmarkIds.map(async (exerciseId) => {
        try {
          const exerciseDoc = await db.collection("exercises").doc(exerciseId).get();
          
          if (!exerciseDoc.exists) {
            console.warn(`⚠️ Вправа не знайдена: ${exerciseId}`);
            return null;
          }

          return {
            id: exerciseDoc.id,
            ...exerciseDoc.data(),
            isBookmarked: true
          };
        } catch (error) {
          console.error(`❌ Помилка отримання документа для ${exerciseId}:`, error);
          return null;
        }
      })
    );

    return { bookmarks: bookmarks.filter(b => b !== null) };
  } catch (error) {
    console.error("❌ Помилка отримання даних користувача:", error);
    return { bookmarks: [] };
  }
};
