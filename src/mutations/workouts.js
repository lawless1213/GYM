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
        description
        exercises {
          exerciseId
          sets
          valuePerSet
          caloriesPerSet
        }
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

export const UPDATE_WORKOUT = gql`
  mutation UpdateWorkout($input: UpdateWorkoutInput!) {
    updateWorkout(input: $input) {
      success
      message
      workout {
        id
        name
        color
        calories
        description
        exercises {
          exerciseId
          sets
          valuePerSet
          caloriesPerSet
        }
      }
    }
  }
`;