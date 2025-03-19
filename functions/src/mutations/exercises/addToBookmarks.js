import { db } from "../../firebase.js";

export const addToBookmarks = async (_, { exerciseId }, context) => {
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

    // Додаємо вправу до улюблених
    await userRef.update({
      bookmarks: db.FieldValue.arrayUnion(exercise)
    });

    return { 
      success: true, 
      message: "Вправу додано до улюблених",
      exercise: {
        ...exercise,
        isBookmarked: true
      }
    };
  } catch (error) {
    console.error("❌ Помилка додавання до улюблених:", error);
    throw new Error("Не вдалося додати до улюблених");
  }
};