import { db } from "../../firebase.js";
import { v4 as uuidv4 } from 'uuid';

export const createWorkout = async (_, { input }, context) => {
  if (!context.user) throw new Error("Unauthorized");
	
	try {
		const newId = uuidv4();
		const userRef = db.collection("users").doc(context.user.uid);

		const workout = {
			...input,
			id: newId,
		}

		await userRef.set(
			{
				workouts: {
					[newId]: workout
				}
			},
			{ merge: true }
		);

		return {
      success: true,
      message: "Програму створено",
      workout: workout,
    };
	} catch (error) {
		console.error("❌ Помилка створення програми:", error);
    throw new Error("Не вдалося створити програму");
	}
}