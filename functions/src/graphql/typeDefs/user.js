import { gql } from "apollo-server-express";

export default gql`
  type User {
    bookmarks: [Exercise]!
  }

  extend type Query {
    getUserData: User
  }
`;