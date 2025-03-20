import { db } from "../firebase.js";

export const getExercises = async (_, { filters }, context) => {
  try {
    let query = db.collection("exercises");

    if (filters) {
      if (filters.bodyPart && filters.bodyPart.length > 0) {
        query = query.where("bodyPart", "array-contains-any", filters.bodyPart);
      }
      if (filters.equipment && filters.equipment.length > 0) {
        query = query.where("equipment", "array-contains-any", filters.equipment);
      }
    }

    // Додаємо сортування за датою створення в спадаючому порядку
    query = query.orderBy("createdAt", "desc");

    const snapshot = await query.get();
    let exercises = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

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