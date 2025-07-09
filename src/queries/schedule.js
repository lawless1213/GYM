import { gql } from "@apollo/client";

export const GET_USER_SCHEDULE = gql`
	query GetUserSchedule($startDate: String!, $endDate: String!) {
		getUserSchedule(startDate: $startDate, endDate: $endDate) {
			date
			workouts {
				completed
				note
				time
				workoutId
			}
		}
	}
`; 