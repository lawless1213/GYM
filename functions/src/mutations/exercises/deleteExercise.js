import { db } from "../../firebase.js";
import { GraphQLError } from "graphql";
import {  doc, getDoc } from "firebase/firestore";
// import { deleteDoc, doc, getDoc } from "firebase/firestore";
// import { getStorage, ref, deleteObject } from "firebase/storage";

export const deleteExercise = async (_, { input }, context) => {
	console.log("User:", context.user);
	console.log("Is user null or undefined?", !context.user);

  if (!context.user) {
    throw new GraphQLError("Unauthorized");
  }
	
  const { id } = input;
  // const { id, author, preview, video } = input;

	console.log(input);

	const exerciseRef = doc(db, "exercises", id);
	const exerciseDoc = await getDoc(exerciseRef);
	if (!exerciseDoc.exists()) {
		console.log("Document not found!");
	}

	// console.log("Firestore Instance:", db);
	// console.log("Document Path:", `exercises/${id}`);

  // if (context.user.uid !== author) {
  //   throw new GraphQLError("Permission denied");
  // }

  // try {
	// 	await deleteDoc(doc(db, "exercises", id));
	
	// 	const storage = getStorage();
	
	// 	if (preview) {
	// 		const previewRef = ref(storage, new URL(preview).pathname);
	// 		await deleteObject(previewRef);
	// 	}
	
	// 	if (video) {
	// 		const videoRef = ref(storage, new URL(video).pathname);
	// 		await deleteObject(videoRef);
	// 	}
	
	// 	return { success: true, message: "Вправа видалена" };
	// } catch (error) {
	// 	console.error("Error deleting exercise:", error);
	// 	if (error instanceof Error) {
	// 		throw new GraphQLError(error.message);  // Викидає конкретну помилку
	// 	} else {
	// 		throw new GraphQLError("Помилка при видаленні вправи");
	// 	}
	// }
};
