import { gql } from "@apollo/client";

export const ADD_TO_BOOKMARKS = gql`
  mutation AddToBookmarks($exerciseId: ID!) {
    addToBookmarks(exerciseId: $exerciseId) {
      success
      message
      exercise {
        id
        name
        author
        authorName
        bodyPart
        description
        equipment
        preview
        video
        isBookmarked
        __typename
      }
      bookmarks
      __typename
    }
  }
`;

export const REMOVE_FROM_BOOKMARKS = gql`
  mutation RemoveFromBookmarks($exerciseId: ID!) {
    removeFromBookmarks(exerciseId: $exerciseId) {
      success
      message
      exercise {
        id
        name
        author
        authorName
        bodyPart
        description
        equipment
        preview
        video
        isBookmarked
        __typename
      }
      bookmarks
      __typename
    }
  }
`;

export const DELETE_EXERCISE = gql`
  mutation DeleteExercise($input: DeleteExerciseInput!) {
    deleteExercise(input: $input) {
      success
      message
    }
  }
`;

export const CREATE_EXERCISE = gql`
  mutation CreateExercise($input: CreateExerciseInput!) {
    createExercise(input: $input) {
      success
      message
      exercise {
        id
        name
        author
        authorName
        bodyPart
        description
        equipment
        preview
        video
        isBookmarked
        __typename
      }
      __typename
    }
  }
`;

export const UPDATE_EXERCISE = gql`
  mutation UpdateExercise($input: UpdateExerciseInput!) {
    updateExercise(input: $input) {
      success
      message
      exercise {
        id
        name
        author
        authorName
        bodyPart
        description
        equipment
        preview
        video
        isBookmarked
        __typename
      }
      __typename
    }
  }
`;