import { db, storage } from "../../firebase.js";

export const deleteExercise = async (_, { input }, context) => {
  if (!context.user) throw new Error("Unauthorized");

  const { id, author, preview, video } = input;
  const exerciseRef = db.collection("exercises").doc(id);
  const exerciseDoc = await exerciseRef.get();

  if (!exerciseDoc.exists) return;
  if (context.user.uid !== author) throw new Error("Permission denied");

  try {
    await exerciseRef.delete();

    const extractStoragePath = (url) => {
      try {
        const decodedPath = decodeURIComponent(url.split("/o/")[1].split("?")[0]);
        return decodedPath;
      } catch (err) {
        console.error("❌ Error extracting storage path:", err);
        return null;
      }
    };

    if (preview) {
      const previewPath = extractStoragePath(preview);
      console.log("📂 Видаляємо файл:", previewPath);
      if (previewPath) {
        try {
          await storage.file(previewPath).delete();
        } catch (err) {
          console.error("❌ Error deleting preview:", err);
        }
      }
    }

    if (video) {
      const videoPath = extractStoragePath(video);
      console.log("📂 Видаляємо файл:", videoPath);
      if (videoPath) {
        try {
          await storage.file(videoPath).delete();
        } catch (err) {
          console.error("❌ Error deleting video:", err);
        }
      }
    }

    return { success: true, message: "Вправа видалена" };
  } catch (error) {
    console.error("❌ Error deleting exercise:", error);
    throw new Error(error.message || "Помилка при видаленні вправи");
  }
};
