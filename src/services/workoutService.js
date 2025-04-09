import { CREATE_WORKOUT } from "../mutations/workouts";
import client from "../providers/apolloClient";
import { getAuth } from "firebase/auth";

const workoutService = {
	// ----------- Create workout
	async createExercise() {
		const currentUser = getAuth().currentUser;
    if (!currentUser) return false;

		try {
			console.log('create');
			
		} catch (error) {
			console.error("Error creating workout:", error);
      return null;
		}
	},
	// -----------
}

export default workoutService;