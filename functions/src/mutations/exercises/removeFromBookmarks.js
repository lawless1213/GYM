import { db } from "../../firebase.js";
import { FieldValue } from 'firebase-admin/firestore';

export const removeFromBookmarks = async (_, { exerciseId }, context) => {
  if (!context.user) throw new Error("Unauthorized");
  
  try {
    const userRef = db.collection("users").doc(context.user.uid);
    const exerciseRef = db.collection("exercises").doc(exerciseId);
    
    // Отримуємо дані вправи
    const exerciseDoc = await exerciseRef.get();
    if (!exerciseDoc.exists) {
      throw new Error("Вправа не знайдена");
    }
    const exercise = { id: exerciseDoc.id, ...exerciseDoc.data() };

    // Видаляємо вправу з улюблених
    await userRef.update({
      bookmarks: FieldValue.arrayRemove(exerciseId)
    });

    // Отримуємо оновлений список закладок
    const userDoc = await userRef.get();
    const userData = userDoc.data();
    const bookmarks = userData?.bookmarks || [];

    // Перетворюємо референси в ID
    const bookmarkIds = bookmarks.map(bookmark => {
      if (typeof bookmark === 'string') return bookmark;
      return bookmark.id || bookmark;
    });

    return { 
      success: true, 
      message: "Вправу видалено з улюблених",
      exercise: {
        ...exercise,
        isBookmarked: false
      },
      bookmarks: bookmarkIds
    };
  } catch (error) {
    console.error("❌ Помилка видалення з улюблених:", error);
    throw new Error("Не вдалося видалити з улюблених");
  }
};
