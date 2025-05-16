import { gql } from "apollo-server-express";

export default gql`
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
    caloriesPerUnit: Int!
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

  type UpdateExerciseResponse {
    success: Boolean!
    message: String!
    exercise: Exercise!
    bookmarks: [String!]!
  }

  type MutationResponse {
    success: Boolean!
    message: String!
  }

  extend type Query {
    getExercises(filters: ExerciseFilter): [Exercise]
    getPersonalExercises(uid: String!): [Exercise]
  }

  extend type Mutation {
    addToBookmarks(exerciseId: ID!): UpdateExerciseResponse!
    removeFromBookmarks(exerciseId: ID!): UpdateExerciseResponse!
    deleteExercise(input: DeleteExerciseInput!): MutationResponse!
    createExercise(input: CreateExerciseInput!): UpdateExerciseResponse!
    updateExercise(input: UpdateExerciseInput!): UpdateExerciseResponse!
  }
`;
