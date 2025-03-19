import { db, storage } from "../../firebase.js";

export const updateExercise = async (_, { input }, context) => {
	if (!context.user) throw new Error("Unauthorized");
	
	const { id, name, bodyPart, description, equipment, preview, video } = input;
	const exerciseRef = db.collection("exercises").doc(id);
  const exerciseDoc = await exerciseRef.get();
	
  if (!exerciseDoc.exists) return;
	const exerciseData = exerciseDoc.data();
	
	if (context.user.uid !== exerciseData.author) throw new Error("Permission denied");
	
	try {
		const extractStoragePath = (url) => {
      try {
        const decodedPath = decodeURIComponent(url.split("/o/")[1].split("?")[0]);
        return decodedPath;
      } catch (err) {
        console.error("❌ Error extracting storage path:", err);
        return null;
      }
    };

		if (exerciseData.preview && exerciseData.preview !== preview) {
			const previewPath = extractStoragePath(exerciseData.preview);
			console.log("📂 Видаляємо файл:", exerciseData.preview);
			if (exerciseData.preview) {
				try {
					await storage.file(previewPath).delete();
				} catch (err) {
					console.error("❌ Error deleting preview:", err);
				}
			}
		}

		if (exerciseData.video && exerciseData.video !== video) {
			const videoPath = extractStoragePath(exerciseData.video);
			console.log("📂 Видаляємо файл:", exerciseData.video);
			if (exerciseData.video) {
				try {
					await storage.file(videoPath).delete();
				} catch (err) {
					console.error("❌ Error deleting preview:", err);
				}
			}
		}

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
		await exerciseRef.set(newExercise, { merge: true });

		return { success: true, message: "Вправа відредагована", exercise: newExercise };
	} catch (error) {
		console.error("❌ Помилка редагування вправи:", error);
		throw new Error("Не вдалося відредагувати вправу");
	}
};