import { useQuery } from "@apollo/client";
import { GET_EXERCISES, GET_PERSONAL_EXERCISES } from "../queries/exercises";
import { GET_USER } from "../queries/user";
import { groupNames } from "../services/exerciseService";

export const useExercises = (group, filters, currentUser) => {
  let query, variables;

  // Якщо користувач не авторизований і намагається отримати закладки або персональні вправи,
  // повертаємо порожній масив
  if (!currentUser && (group === groupNames.BOOKMARKS || group === groupNames.PERSONAL)) {
    return {
      exercises: [],
      loading: false,
      error: null
    };
  }

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

  const { data, loading, error } = useQuery(query, { 
    variables,
    // Пропускаємо запит для закладок і персональних вправ якщо користувач не авторизований
    skip: !currentUser && (group === groupNames.BOOKMARKS || group === groupNames.PERSONAL)
  });

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
