import { db } from "../firebase.js";

export const getUsers = async () => {
	try {
		const snapshot = await db.collection("users").get();
  	return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	} catch (error) {
		console.error("Error fetching users:", error);
		throw new Error("Failed to fetch users");
	}
};