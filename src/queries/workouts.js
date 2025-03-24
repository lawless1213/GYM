import { gql } from "@apollo/client";

export const GET_USER_WORKOUTS = gql`
  query GetUserWorkouts {
    getUserWorkouts {
      id
      name
      color
      calories
      exercises {
        exerciseId
        exercise {
          id
          name
          description
          bodyPart
          equipment
          preview
          video
          type
          valuePerSet
          caloriesPerSet
        }
        sets
        valuePerSet
        caloriesPerSet
      }
    }
  }
`; 