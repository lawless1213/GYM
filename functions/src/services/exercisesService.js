import { db } from "../firebase.js";

export const getExercises = async (_, { filters }) => {
  try {
    if (!filters || Object.keys(filters).length === 0) {
      const snapshot = await db.collection("exercises").get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

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
    const commonExercises = allResults.reduce((acc, curr) => {
      return acc.filter(exercise => curr.some(item => item.id === exercise.id));
    });

    // Повертаємо тільки спільні записи
    return commonExercises;

  } catch (error) {
    console.error("Error fetching exercises:", error);
    throw new Error("Failed to fetch exercises");
  }
};