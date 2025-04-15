import { gql } from "@apollo/client";

export const CREATE_WORKOUT = gql`
  mutation CreateWorkout($input: CreateWorkoutInput!) {
    createWorkout(input: $input) {
      success
      message
      workout {
        id
        name
        color
        calories
      }
    }
  }
`;