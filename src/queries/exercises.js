import { gql } from "@apollo/client";

export const GET_EXERCISES = gql`
  query GetExercises {
    getExercises {
      id
      name
      author
      authorName
      bodyPart
      description
      equipment
			preview
			video
    }
  }
`;