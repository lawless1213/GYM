import { db, storage } from "../../firebase.js";

export const deleteExercise = async (_, { input: { id, author, preview, video } }, context) => {
  if (!context.user || context.user.uid !== author) {
    throw new Error("Unauthorized");
  }

  try {
    // Видаляємо вправу з закладок усіх користувачів
    const usersSnapshot = await db.collection("users").get();
    const batch = db.batch();

    usersSnapshot.docs.forEach(doc => {
      const userData = doc.data();
      if (userData.bookmarks && userData.bookmarks.includes(id)) {
        batch.update(doc.ref, {
          bookmarks: userData.bookmarks.filter(bookmarkId => bookmarkId !== id)
        });
      }
    });

    await batch.commit();

    // Видаляємо файли з Storage якщо вони є
    if (preview) {
      try {
        const previewFile = storage.file(preview.split("/").pop());
        await previewFile.delete();
      } catch (error) {
        console.error("❌ Помилка видалення preview:", error);
      }
    }

    if (video) {
      try {
        const videoFile = storage.file(video.split("/").pop());
        await videoFile.delete();
      } catch (error) {
        console.error("❌ Помилка видалення video:", error);
      }
    }

    // Видаляємо документ вправи
    await db.collection("exercises").doc(id).delete();

    return {
      success: true,
      message: "Вправу успішно видалено"
    };
  } catch (error) {
    console.error("❌ Помилка видалення вправи:", error);
    throw new Error("Не вдалося видалити вправу");
  }
};
