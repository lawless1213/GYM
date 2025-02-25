import { db } from "../firebase.js";

export const getPersonalExercises = async () => {
	try {
		const snapshot = await db.collection("exercises").get();
		return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	} catch (error) {
		console.error("Error fetching exercises:", error);
		throw new Error("Failed to fetch exercises");
	}
};