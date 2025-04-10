import { gql } from "apollo-server-express";

export default gql`
  type Filter {
    id: ID!
    name: String!
    values: [String!]!
  }

  extend type Query {
    getFilters(name: String!): Filter
  }
`;