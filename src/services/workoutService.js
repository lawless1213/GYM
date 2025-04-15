import client from "../providers/apolloClient";
import { CREATE_WORKOUT } from "../mutations/workouts";
import { GET_USER_WORKOUTS } from "../queries/workouts";
import { getAuth } from "firebase/auth";

const workoutService = {
	// ----------- Create workout
	async createWorkout( workout ) {
		const currentUser = getAuth().currentUser;
    if (!currentUser) return false;

		let newWorkout = workout.calories ? workout : {calories: 0, ...workout}

		try {
			const { data }  = await client.mutate({
				mutation: CREATE_WORKOUT,
				variables: {input: newWorkout},
				update(cache, { data: { createWorkout } }) {
					if (createWorkout.success) {
						const newWorkoutData = createWorkout.workout;
						
						// Оновлюємо кеш для всіх вправ
						try {
							const existingData = cache.readQuery({
								query: GET_USER_WORKOUTS,
							});

							cache.writeQuery({
								query: GET_USER_WORKOUTS,
								data: {
									getUserWorkouts: [...(existingData?.getUserWorkouts || []), newWorkoutData]
								}
							});
						} catch (e) {
							console.log('Error updating GET_USER_WORKOUTS cache:', e);
						}
					}
				}
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