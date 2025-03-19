import { db } from "../../firebase.js";

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
      bookmarks: db.FieldValue.arrayRemove(exercise)
    });

    return { 
      success: true, 
      message: "Вправу видалено з улюблених",
      exercise: {
        ...exercise,
        isBookmarked: false
      }
    };
  } catch (error) {
    console.error("❌ Помилка видалення з улюблених:", error);
    throw new Error("Не вдалося видалити з улюблених");
  }
};
