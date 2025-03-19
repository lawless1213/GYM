import { db } from "../firebase.js";

export const getPersonalExercises = async (_, { uid }, context) => {
	try {
    const exercisesRef = db.collection("exercises"); // Отримуємо посилання на колекцію
    const querySnapshot = await exercisesRef.where("author", "==", uid).get(); // Фільтруємо по автору

    let exercises = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Перевіряємо чи є вправи в улюблених
    if (context.user) {
      const userDoc = await db.collection("users").doc(context.user.uid).get();
      const userData = userDoc.data();
      const bookmarkedExercises = userData?.bookmarks || [];

      // Додаємо поле isBookmarked до кожної вправи
      exercises = exercises.map(exercise => ({
        ...exercise,
        isBookmarked: bookmarkedExercises.some(bookmarked => bookmarked.id === exercise.id)
      }));
    } else {
      // Якщо користувач не авторизований, встановлюємо isBookmarked в false
      exercises = exercises.map(exercise => ({
        ...exercise,
        isBookmarked: false
      }));
    }

    return exercises;
  } catch (error) {
    console.error("❌ Помилка отримання вправ користувача:", error);
    throw new Error("Не вдалося отримати вправи");
  }
};