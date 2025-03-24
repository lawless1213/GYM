import { db } from "../firebase.js";

export const getUserWorkouts = async (_, __, context) => {
  if (!context.user) {
    throw new Error("Unauthorized");
  }

  try {
    const userDoc = await db.collection("users")
      .doc(context.user.uid)
      .get();
    
    const userData = userDoc.data();
    const workouts = userData?.workouts || {};

    return Object.entries(workouts).map(([id, workout]) => {
      const exercisesArray = workout.exercises || [];
      const exercises = Array.isArray(exercisesArray) 
        ? exercisesArray 
        : Object.values(exercisesArray);

      // Фільтруємо тільки валідні вправи з exerciseId
      const validExercises = exercises
        .filter(exercise => exercise && exercise.exerciseId && typeof exercise.exerciseId === 'string')
        .map(exercise => ({
          exerciseId: exercise.exerciseId,
          sets: Number(exercise.sets) || 0,
          valuePerSet: Number(exercise.valuePerSet) || 0,
          caloriesPerSet: Number(exercise.caloriesPerSet) || 0
        }));

      return {
        id,
        name: workout.name || '',
        color: workout.color || '#000000',
        calories: Number(workout.calories) || 0,
        exercises: validExercises
      };
    }).filter(workout => workout.exercises.length > 0); // Повертаємо тільки тренування з валідними вправами
  } catch (error) {
    console.error("Error fetching user workouts:", error);
    throw new Error("Failed to fetch workouts");
  }
}; 