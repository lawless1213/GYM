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

export const DELETE_WORKOUT = gql`
  mutation DeleteWorkout($input: DeleteWorkoutInput!) {
    deleteWorkout(input: $input) {
      success
      message
    }
  }
`;