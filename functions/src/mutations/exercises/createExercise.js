import { db } from "../../firebase.js";

export const createExercise = async (_, { input }, context) => {
  if (!context.user) throw new Error("Unauthorized");
  
  try {
    const { name, bodyPart, description, equipment, preview, video } = input;
    const exerciseId = crypto.randomUUID();

    const newExercise = {
      id: exerciseId,
      author: context.user.uid,
      authorName: context.user.name,
      name,
      bodyPart,
      description,
      equipment,
      preview,
      video,
    };

    console.log(newExercise);
    
    await db.collection("exercises").doc(exerciseId).set(newExercise);
    return { success: true, message: "Вправа створена" };
  } catch (error) {
    console.error("❌ Помилка створення вправи:", error);
    throw new Error("Не вдалося створити вправу");
  }
};