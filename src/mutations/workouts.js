import { gql } from "@apollo/client";

export const CREATE_WORKOUT = gql`
	mutation AddToWorkouts($input: CreateWorkoutInput!) {
		addToWorkouts(input: $input) {
			success
			message
			__typename
		}
	}
`;