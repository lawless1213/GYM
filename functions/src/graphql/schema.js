import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    message: String
    getUsers: [User]
    getExercises: [Exercise]
		getFilters(name: String!): Filter
  }

  type User {
    id: ID!
    name: String!
    email: String!
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