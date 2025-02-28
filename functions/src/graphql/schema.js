import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Mutation {
    addToBookmarks(exerciseId: ID!): MutationResponse!
    removeFromBookmarks(exerciseId: ID!): MutationResponse!
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