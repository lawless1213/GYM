import { db } from "../../firebase.js";

export const updateExercise = async (_, { input }, context) => {
	if (!context.user) throw new Error("Unauthorized");
	if (context.user.uid !== author) throw new Error("Permission denied");
	
	try {
		const { id, name, bodyPart, description, equipment, preview, video } = input;

		const newExercise = {
			id,
			author: context.user.uid,
			authorName: context.user.name,
			name,
			bodyPart,
			description,
			equipment,
			preview,
			video,
		};

		console.log(newExercise);
		
		// await db.collection("exercises").doc(exerciseId).set(newExercise);
		return { success: true, message: "Вправа відредагована" };
	} catch (error) {
		console.error("❌ Помилка редагування вправи:", error);
		throw new Error("Не вдалося відредагувати вправу");
	}
};