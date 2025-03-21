import { db } from "../../firebase.js";

export const createExercise = async (_, { input }, context) => {
  if (!context.user) throw new Error("Unauthorized");

  try {
    let exerciseRef;
    
    if (input.id && input.id.trim()) {
      exerciseRef = db.collection("exercises").doc(input.id);
    } else {
      exerciseRef = db.collection("exercises").doc();
    }

    const authorName = context.user.name;

    const exercise = {
      ...input,
      id: exerciseRef.id,
      author: context.user.uid,
      authorName,
      createdAt: new Date().toISOString()
    };

    delete exercise.id;
    
    await exerciseRef.set(exercise);

    return {
      success: true,
      message: "Вправу створено",
      exercise: {
        id: exerciseRef.id,
        ...exercise,
        isBookmarked: false
      }
    };
  } catch (error) {
    console.error("❌ Помилка створення вправи:", error);
    throw new Error("Не вдалося створити вправу");
  }
};