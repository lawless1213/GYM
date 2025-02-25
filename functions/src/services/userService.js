import { db } from "../firebase.js";

export const getUserData = async (user) => {
  if (!user || !user.uid) {
    console.error("❌ Недійсний користувач:", user);
    throw new Error("Invalid user object");
  }

  console.log("📌 getUserData викликано! User:", user);

  try {
    // 🔥 Адмінський SDK використовує `db.collection().doc()`
    const userRef = db.collection("users").doc(user.uid);
    const userDoc = await userRef.get(); // Firestore Admin SDK використовує `.get()`, а не `getDoc()`

    if (!userDoc.exists) {
      console.error("❌ Документ користувача не знайдено в Firestore");
      return { bookmarks: [] }; // Повертаємо порожній масив, щоб уникнути помилок
    }

    const userData = userDoc.data();
    console.log("✅ Дані користувача:", userData);

    const bookmarksRefs = userData?.bookmarks ?? [];

    const bookmarks = await Promise.all(
      bookmarksRefs.map(async (exerciseRef) => {
        const exercisePath = exerciseRef?.path; // Отримуємо шлях
        if (!exercisePath) {
          console.warn(`⚠️ Некоректний референс:`, exerciseRef);
          return null;
        }

        try {
          const exerciseRef = db.doc(exercisePath); // Використовуємо повний шлях
          const exerciseDoc = await exerciseRef.get();

          if (!exerciseDoc.exists) {
            console.warn(`⚠️ Вправа не знайдена: ${exercisePath}`);
            return null;
          }

          return { id: exerciseDoc.id, ...exerciseDoc.data() };
        } catch (error) {
          console.error(`❌ Помилка отримання документа для ${exercisePath}:`, error);
          return null;
        }
      })
    );

    return { bookmarks: bookmarks.filter((b) => b !== null) };
  } catch (error) {
    console.error("❌ Помилка отримання даних користувача:", error);
    return { bookmarks: [] };
  }
};
