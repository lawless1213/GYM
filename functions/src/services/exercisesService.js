import { db } from "../firebase.js";

export const getExercises = async (_, { filters }, context) => {
  try {
    let exercises = [];
    
    // Отримуємо вправи
    if (!filters || Object.keys(filters).length === 0) {
      const snapshot = await db.collection("exercises").get();
      exercises = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } else {
      // Додаємо фільтри
      const queries = Object.keys(filters).map(field => {
        const values = filters[field];
        if (values.length === 1) {
          return db.collection("exercises").where(field, "array-contains", values[0]).get();
        } else {
          return db.collection("exercises").where(field, "array-contains-any", values).get();
        }
      });
      
      const snapshots = await Promise.all(queries);

      // Масив масивів з об'єктами
      const allResults = snapshots.map(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Якщо немає результатів — повертаємо порожній масив
      if (allResults.length === 0) return [];

      // Беремо перший масив як основу та шукаємо об'єкти, які є у всіх інших
      exercises = allResults.reduce((acc, curr) => {
        return acc.filter(exercise => curr.some(item => item.id === exercise.id));
      });
    }

    // Якщо користувач авторизований, перевіряємо чи є вправи в улюблених
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
    console.error("Error fetching exercises:", error);
    throw new Error("Failed to fetch exercises");
  }
};