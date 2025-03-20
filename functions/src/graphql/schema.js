import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    message: String
    getUserData: User
    getExercises(filters: ExerciseFilter): [Exercise]
    getPersonalExercises(uid: String!): [Exercise]
    getFilters(name: String!): Filter
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
  }

  input UpdateExerciseInput {
    id: String!
    name: String!
    bodyPart: [String!]!
    description: String!
    equipment: [String!]!
    preview: String
    video: String
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
  }

	type Filter {
    id: ID!
    name: String!
    values: [String!]!
  }
	
`;