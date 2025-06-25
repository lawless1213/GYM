import client from "../providers/apolloClient";
import { CREATE_WORKOUT, DELETE_WORKOUT, UPDATE_WORKOUT } from "../mutations/workouts";
import { GET_USER_WORKOUTS } from "../queries/workouts";
import { getAuth } from "firebase/auth";

const workoutService = {
	// ----------- Create workout
	async createWorkout( workout ) {
		const currentUser = getAuth().currentUser;
    if (!currentUser) return false;

		let newWorkout = workout;

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

	// ----------- Create workout
	async updateWorkout( workout ) {
		const currentUser = getAuth().currentUser;
    if (!currentUser) return false;

		try {
			const { data } = await client.mutate({
				mutation: UPDATE_WORKOUT,
				variables: { input: workout },
				update(cache, { data: { updateWorkout } }) {
					if (updateWorkout?.success) {
						// Оновлюємо кеш для getUserWorkouts
						try {
							const existingData = cache.readQuery({
								query: GET_USER_WORKOUTS,
							});

							if (existingData?.getUserWorkouts) {
								cache.writeQuery({
									query: GET_USER_WORKOUTS,
									data: {
										getUserWorkouts: existingData.getUserWorkouts.map(w =>
											w.id === workout.id ? updateWorkout.workout : w
										),
									},
								});
							}
						} catch (e) {
							console.log('Error updating GET_USER_WORKOUTS cache:', e);
						}
					}
				}
			});

			return data?.updateWorkout || null;
		} catch (error) {
			console.error("Error updating workout:", error);
			return null;
		}
	},
	// -----------

	// ----------- Delete Workout
  async deleteWorkout({ id }) {
    const currentUser = getAuth().currentUser;
    if (!currentUser) return false;
		
    try {
      const { data } = await client.mutate({
        mutation: DELETE_WORKOUT,
        variables: { input: { id } },
        update(cache) {
					cache.evict({ id: `Workout:${id}` });
					cache.gc();
				}
      });

      return data?.deleteWorkout || null;
    } catch (error) {
      console.error("Error deleting Workout:", error);
      return null;
    }
  },
	// -----------
}

export default workoutService;