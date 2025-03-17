import { useQuery } from "@apollo/client";
import { GET_EXERCISES, GET_PERSONAL_EXERCISES } from "../queries/exercises";
import { GET_USER } from "../queries/user";
import { groupNames } from "../stores/ExerciseStore";

export const useExercises = (group, filters, currentUser) => {
  let query, variables;

  switch (group) {
    case groupNames.BOOKMARKS:
      query = GET_USER;
      variables = {};
      break;
    case groupNames.PERSONAL:
      query = GET_PERSONAL_EXERCISES;
      variables = { uid: currentUser?.uid };
      break;
    default:
      query = GET_EXERCISES;
      variables = { filters };
  }

  const { data, loading, error } = useQuery(query, { variables });

  return {
    exercises:
      group === groupNames.BOOKMARKS
        ? data?.getUserData?.bookmarks || []
        : group === groupNames.PERSONAL
        ? data?.getPersonalExercises || []
        : data?.getExercises || [],
    loading,
    error
  };
};
