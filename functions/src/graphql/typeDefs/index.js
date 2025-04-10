import { mergeTypeDefs } from "@graphql-tools/merge";

import common from "./common.js";
import user from "./user.js";
import exercise from "./exercise.js";
import workout from "./workout.js";
import filter from "./filter.js";

export const typeDefs = mergeTypeDefs([
  common,
  user,
  exercise,
  workout,
  filter
]);