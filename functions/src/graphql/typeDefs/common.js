import { gql } from "apollo-server-express";

export default gql`
  type Query
  type Mutation

  extend type Query {
    message: String
  }
`;