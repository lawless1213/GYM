import { CREATE_WORKOUT } from "../mutations/workouts";
import client from "../providers/apolloClient";
import { getAuth } from "firebase/auth";

const workoutService = {
	// ----------- Create workout
	async createWorkout( workout ) {
		const currentUser = getAuth().currentUser;
    if (!currentUser) return false;

		try {
			const { data }  = await client.mutate({
				mutation: CREATE_WORKOUT,
				variables: {input: workout}
			})

			return data?.createWorkout || null;
		} catch (error) {
			console.error("Error creating workout:", error);
      return null;
		}
	},
	// -----------
}

export default workoutService;