import { gql } from "apollo-server-express";

export default gql`
  type Workout {
    id: ID!
    name: String!
    color: String!
    calories: Int!
    exercises: [WorkoutExercise!]!
  }

  type WorkoutExercise {
    exerciseId: ID!
    exercise: Exercise!
    sets: Int!
    valuePerSet: Int!
    caloriesPerSet: Int!
  }

	input CreateWorkoutInput {
    id: String
    name: String!
    calories: Int!
		description: String!
		color: String!
  }

	type WorkoutResponse {
    success: Boolean!
    message: String!
    workout: Workout!
  }

  extend type Query {
    getUserWorkouts: [Workout]!
  }

	extend type Mutation {
    createWorkout(input: CreateWorkoutInput!): WorkoutResponse!
  }
`;