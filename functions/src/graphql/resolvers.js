import { getUserData } from "../services/userService.js";
import { getExercises } from "../services/exercisesService.js";
import { getFilters } from "../services/filterService.js";
import { getPersonalExercises } from "../services/exercisePersonalService.js";
import { removeFromBookmarks } from "../mutations/exercises/removeFromBookmarks.js";
import { addToBookmarks } from "../mutations/exercises/addToBookmarks.js";
import { deleteExercise } from "../mutations/exercises/deleteExercise.js";

export const resolvers = {
  Query: {
    message: () => "Hello from GraphQL on Firebase!",
    getUserData: (_, __, context) => {
      if (!context.user) {
        console.error("❌ Користувач відсутній у контексті");
        throw new Error("Unauthorized"); // Якщо user відсутній у контексті
      }

      // console.log("👤 Користувач у контексті:", context.user);  // Лог користувача
      return getUserData(context.user);  // Передаємо користувача в сервіс
    },
    getExercises,
    getPersonalExercises,
		getFilters,
  },
  Mutation: {
    addToBookmarks,
    removeFromBookmarks,
    deleteExercise,
  },
};