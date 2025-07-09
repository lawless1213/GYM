import { getUserData } from "../services/userService.js";
import { getExercises } from "../services/exercisesService.js";
import { getFilters } from "../services/filterService.js";
import { getPersonalExercises } from "../services/exercisePersonalService.js";
import { removeFromBookmarks } from "../mutations/exercises/removeFromBookmarks.js";
import { addToBookmarks } from "../mutations/exercises/addToBookmarks.js";
import { deleteExercise } from "../mutations/exercises/deleteExercise.js";
import { createExercise } from "../mutations/exercises/createExercise.js";
import { updateExercise } from "../mutations/exercises/updateExercise.js";
import { getUserWorkouts } from "../services/workoutService.js";
import { createWorkout } from "../mutations/workouts/createWorkout.js";
import { db } from "../firebase.js";
import { deleteWorkout } from "../mutations/workouts/deleteWorkout.js";
import { updateWorkout } from "../mutations/workouts/updateWorkout.js";
import { getUserSchedule } from "../services/scheduleService.js";

export const resolvers = {
  Query: {
    message: () => "Hello from GraphQL on Firebase!",
    getUserData: (_, __, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      return getUserData(context.user);
    },
    getExercises,
    getPersonalExercises: (_, args, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      return getPersonalExercises(_, args, context);
    },
    getUserSchedule: async (_, { startDate, endDate }, context) => {
      if (!context.user) throw new Error("Unauthorized");
      return getUserSchedule(context.user.uid, startDate, endDate);
    },
    getFilters,
    getUserWorkouts
  },
  Mutation: {
    createExercise: (_, args, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      return createExercise(_, args, context);
    },
    updateExercise: (_, args, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      return updateExercise(_, args, context);
    },
    deleteExercise: (_, args, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      return deleteExercise(_, args, context);
    },
    addToBookmarks: (_, args, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      return addToBookmarks(_, args, context);
    },
    removeFromBookmarks: (_, args, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      return removeFromBookmarks(_, args, context);
    },
    createWorkout: (_, args, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      return createWorkout(_, args, context);
    },
    updateWorkout: (_, args, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      return updateWorkout(_, args, context);
    },
    deleteWorkout: (_, args, context) => {
      if (!context.user) {
        throw new Error("Unauthorized");
      }
      return deleteWorkout(_, args, context);
    },
  },
  WorkoutExercise: {
    exercise: async (parent) => {
      console.log('Resolving exercise for:', parent.exerciseId);
      
      if (!parent.exerciseId) return null;
      
      const exerciseDoc = await db.collection("exercises")
        .doc(parent.exerciseId)
        .get();
      
      if (!exerciseDoc.exists) {
        console.log('Exercise not found:', parent.exerciseId);
        return null;
      }
      
      const exerciseData = {
        id: exerciseDoc.id,
        ...exerciseDoc.data()
      };
      console.log('Found exercise:', exerciseData);
      
      return exerciseData;
    }
  }
};