import { db, storage } from "../../firebase.js";
import { ref, deleteObject } from "firebase/storage";

export const deleteExercise = async (_, { input }, context) => {
  if (!context.user) throw new Error("Unauthorized");
  
	const { id, author, preview, video } = input;

  const exerciseRef = db.collection("exercises").doc(id);
  const exerciseDoc = await exerciseRef.get();

  if (!exerciseDoc.exists) return;
  
  if (context.user.uid !== author) throw new Error("Permission denied");

  try {
		await exerciseRef.delete();
	
		if (preview)await deleteObject(ref(storage, new URL(preview).pathname));
	
		if (video) {
			const videoRef = ref(storage, new URL(video).pathname);
			await deleteObject(videoRef);
		}
	
		return { success: true, message: "Вправа видалена" };
	} catch (error) {
		console.error("Error deleting exercise:", error);
		if (error instanceof Error) {
			throw new Error(error.message);  // Викидає конкретну помилку
		} else {
			throw new Error("Помилка при видаленні вправи");
		}
	}
};
