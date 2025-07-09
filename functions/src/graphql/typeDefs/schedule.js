import { gql } from "apollo-server-express";

export default gql`
		type ScheduleWorkout {
		completed: Boolean
		note: String
		time: String
		workoutId: ID!
		workout: Workout
	}

	type ScheduleDay {
		date: String!
		workouts: [ScheduleWorkout!]!
	}

	extend type Query {
		getUserSchedule(startDate: String!, endDate: String!): [ScheduleDay!]!
	}
`;