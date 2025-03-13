import { db } from "../../firebase.js";
// import { FirebaseService } from "../../firebaseFunctions.js";

export const createExercise = async (_, { input }, context) => {
  if (!context.user) throw new Error("Unauthorized");

  console.log("спроба створити вправу");
  
  try {
    // const [previewPath, videoPath] = await Promise.all([
    //   preview ? FirebaseService.handleFileUpload(preview, "preview") : null,
    //   video ? FirebaseService.handleFileUpload(video, "video") : null
    // ]);

    const { name, bodyPart, description, equipment } = input;
    const exerciseId = crypto.randomUUID();

    const newExercise = {
      author: context.user.uid,
      authorName: context.user.name,
      name,
      bodyPart,
      description,
      equipment,
      id: exerciseId,
      preview: "",
      video: "",
      // preview: previewPath ?? "",
      // video: videoPath ?? "",
    };

    console.log(newExercise);
    

    await db.collection("exercises").doc(exerciseId).set(newExercise);
    return { success: true, message: "Вправа створена" };
  } catch (error) {
    console.error("❌ Помилка створення вправи:", error);
    throw new Error("Не вдалося створити вправу");
  }
};