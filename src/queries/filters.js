import { gql } from "@apollo/client";

export const GET_FILTER = gql`
  query GetFilter($name: String!) {
    getFilter(name: $name) {
      values
    }
  }
`;
