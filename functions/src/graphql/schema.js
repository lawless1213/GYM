import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    message: String
    getUserData: User
    getExercises(filters: ExerciseFilter): [Exercise]
    getPersonalExercises(uid: String!): [Exercise]
    getFilters(name: String!): Filter
    getUserWorkouts: [Workout]!
  }

  type Mutation {
    addToBookmarks(exerciseId: ID!): UpdateExerciseResponse!
    removeFromBookmarks(exerciseId: ID!): UpdateExerciseResponse!
    deleteExercise(input: DeleteExerciseInput!): MutationResponse!
    createExercise(input: CreateExerciseInput!): UpdateExerciseResponse!
    updateExercise(input: UpdateExerciseInput!): UpdateExerciseResponse!
  }

  type MutationResponse {
    success: Boolean!
    message: String!
  }

  type UpdateExerciseResponse {
    success: Boolean!
    message: String!
    exercise: Exercise!
    bookmarks: [String!]!
  }

  input CreateExerciseInput {
    id: String
    name: String!
    bodyPart: [String!]!
    description: String!
    equipment: [String!]!
    preview: String
    video: String
    createdAt: String
    type: String!
    valuePerSet: Int!
    caloriesPerSet: Int!
  }

  input UpdateExerciseInput {
    id: String!
    name: String!
    bodyPart: [String!]!
    description: String!
    equipment: [String!]!
    preview: String
    video: String
    type: String!
    valuePerSet: Int!
    caloriesPerSet: Int!
  }

  input DeleteExerciseInput {
    id: ID!
    author: String!
    preview: String
    video: String
  }

  input ExerciseFilter {
    bodyPart: [String]
    equipment: [String]
  }

  type User {
    bookmarks: [Exercise]!
  }

  type Exercise {
    id: ID!
    name: String!
    author: String!
    authorName: String!
    bodyPart: [String!]!
    description: String!
    equipment: [String!]!
    preview: String!
    video: String!
    isBookmarked: Boolean!
    createdAt: String!
    type: String!
    valuePerSet: Int!
    caloriesPerSet: Int!
  }

	type Filter {
    id: ID!
    name: String!
    values: [String!]!
  }

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
	
`;