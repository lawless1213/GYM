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
        description: workout.description || '',
        exercises: validExercises
      };
    });
  } catch (error) {
    console.error("Error fetching user workouts:", error);
    throw new Error("Failed to fetch workouts");
  }
};

export const getWorkoutById = async (workoutId, userId) => {
  if (!workoutId || !userId) return null;

  try {
    const userDoc = await db.collection("users").doc(userId).get();
    const userData = userDoc.data();
    const workout = userData?.workouts?.[workoutId];
    if (!workout) return null;

    const exercisesArray = workout.exercises || [];
    const exercises = Array.isArray(exercisesArray)
      ? exercisesArray
      : Object.values(exercisesArray);

    const validExercises = exercises
      .filter(exercise => exercise && exercise.exerciseId && typeof exercise.exerciseId === 'string')
      .map(exercise => ({
        exerciseId: exercise.exerciseId,
        sets: Number(exercise.sets) || 0,
        valuePerSet: Number(exercise.valuePerSet) || 0,
        caloriesPerSet: Number(exercise.caloriesPerSet) || 0
      }));

    return {
      id: workoutId,
      name: workout.name || '',
      color: workout.color || '#000000',
      calories: Number(workout.calories) || 0,
      description: workout.description || '',
      exercises: validExercises
    };
  } catch (error) {
    console.error("Error fetching workout by id:", error);
    return null;
  }
};