import { gql } from "@apollo/client";

export const ADD_TO_BOOKMARKS = gql`
  mutation AddToBookmarks($exerciseId: ID!) {
    addToBookmarks(exerciseId: $exerciseId) {
      success
      message
    }
  }
`;

export const REMOVE_FROM_BOOKMARKS = gql`
  mutation RemoveFromBookmarks($exerciseId: ID!) {
    removeFromBookmarks(exerciseId: $exerciseId) {
      success
      message
    }
  }
`;