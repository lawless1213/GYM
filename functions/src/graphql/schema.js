import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar Upload

  type Mutation {
    addToBookmarks(exerciseId: ID!): MutationResponse!
    removeFromBookmarks(exerciseId: ID!): MutationResponse!
    deleteExercise(input: DeleteExerciseInput!): MutationResponse!
    createExercise(input: CreateExerciseInput!): MutationResponse!
    uploadFile(file: Upload!, folder: String!): String!
  }

  type Query {
    message: String
    getUserData: User
    getExercises(filters: ExerciseFilter): [Exercise]
    getPersonalExercises(uid: String!): [Exercise]
		getFilters(name: String!): Filter
  }

  type MutationResponse {
    success: Boolean!
    message: String!
  }

  input DeleteExerciseInput {
    id: ID!
    author: String!
    preview: String
    video: String
  }

  input CreateExerciseInput {
    id: String
    name: String!
    bodyPart: [String!]!
    description: String!
    equipment: [String!]!
    
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
  }

	type Filter {
    id: ID!
    name: String!
    values: [String!]!
  }
	
`;