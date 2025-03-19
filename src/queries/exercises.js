import { gql } from "@apollo/client";

export const GET_EXERCISES = gql`
  query GetExercises($filters: ExerciseFilter) {
    getExercises(filters: $filters) {
      id
      name
      author
      authorName
      bodyPart
      description
      equipment
      preview
      video
      isBookmarked
    }
  }
`;

export const GET_PERSONAL_EXERCISES = gql`
  query GetPersonalExercises($uid: String!) {
    getPersonalExercises(uid: $uid) {
      id
      name
      author
      authorName
      bodyPart
      description
      equipment
			preview
			video
      isBookmarked
    }
  }
`;