import { db } from "../firebase.js";

export const getPersonalExercises = async (_, { uid }) => {
	try {
    const exercisesRef = db.collection("exercises"); // Отримуємо посилання на колекцію
    const querySnapshot = await exercisesRef.where("author", "==", uid).get(); // Фільтруємо по автору

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("❌ Помилка отримання вправ користувача:", error);
    throw new Error("Не вдалося отримати вправи");
  }
};