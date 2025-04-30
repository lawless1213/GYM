import { db } from "../firebase.js";

export const getExercises = async (_, { filters }, context) => {
  try {
    let query = db.collection("exercises");

    // Додаємо сортування за датою створення в спадаючому порядку
    query = query.orderBy("createdAt", "desc");

    const snapshot = await query.get();
    let exercises = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Застосовуємо фільтри на клієнтській стороні
    if (filters) {
      if (filters.bodyPart && filters.bodyPart.length > 0) {
        exercises = exercises.filter(exercise => 
          exercise.bodyPart.some(part => filters.bodyPart.includes(part))
        );
      }
      if (filters.equipment && filters.equipment.length > 0) {
        exercises = exercises.filter(exercise => 
          exercise.equipment.some(item => filters.equipment.includes(item))
        );
      }
    }

    // Якщо користувач авторизований, перевіряємо чи є вправи в улюблених
    if (context.user) {
      const userDoc = await db.collection("users").doc(context.user.uid).get();
      const userData = userDoc.data();
      const bookmarkedIds = userData?.bookmarks || [];

      // Додаємо поле isBookmarked до кожної вправи
      exercises = exercises.map(exercise => ({
        ...exercise,
        isBookmarked: bookmarkedIds.includes(exercise.id)
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
    console.error("Error fetching exercises:", error);
    throw new Error("Failed to fetch exercises");
  }
};