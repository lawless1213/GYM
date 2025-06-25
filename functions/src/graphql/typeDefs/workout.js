import { gql } from "apollo-server-express";

export default gql`
  type Workout {
    id: ID!
    name: String!
    color: String!
    calories: Int!
    description: String!
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
    exercises: [WorkoutExerciseInput!]
  }

  input WorkoutExerciseInput {
    exerciseId: String!
    sets: Int!
    valuePerSet: Int!
    caloriesPerSet: Int!
  }

  input DeleteWorkoutInput {
    id: String
  }

  input UpdateWorkoutInput {
    id: String!
    name: String!
    calories: Int!
    description: String!
    color: String!
    exercises: [WorkoutExerciseInput!]
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
    updateWorkout(input: UpdateWorkoutInput!): WorkoutResponse!
    deleteWorkout(input: DeleteWorkoutInput!): MutationResponse! 
  }
`;