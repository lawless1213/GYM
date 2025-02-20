import { getUsers } from "../services/usersService.js";
import { getExercises } from "../services/exercisesService.js";
import { getFilters } from "../services/filterService.js";

export const resolvers = {
  Query: {
    message: () => "Hello from GraphQL on Firebase!",
    getUsers,
    getExercises,
		getFilters,
  },
};