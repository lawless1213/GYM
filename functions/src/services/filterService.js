import { db } from "../firebase.js";

export const getFilters = async (_, { name }) => {
	try {
		const filtersDocRef = db.collection("exercisesParams").doc("filters");
		const docSnapshot = await filtersDocRef.get();

		if (!docSnapshot.exists) {
			throw new Error("Filters document not found");
		}

		const data = docSnapshot.data();
		if (!data[name]) {
			throw new Error(`Filter "${name}" not found`);
		}

		return {
			id: name,
			name,
			values: data[name] || []
		};
	} catch (error) {
		console.error("Error fetching filter:", error);
		throw new Error("Failed to fetch filter");
	}
};