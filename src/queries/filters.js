import { gql } from "@apollo/client";

export const GET_FILTERS = gql`
  query GetFilters($name: String!) {
    getFilters(name: $name) {
      values
    }
  }
`;
