import { db } from "../../firebase.js";
import { GraphQLError } from "graphql";

export const removeFromBookmarks = async (_, { exerciseId }, context) => {
  if (!context.user) {
    console.error("❌ Користувач відсутній у контексті");
    throw new GraphQLError("Unauthorized");
  }

  const userRef = db.collection("users").doc(context.user.uid);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    throw new GraphQLError("Користувач не знайдений");
  }

  const userData = userDoc.data();
  const currentBookmarks = userData.bookmarks || [];

  const updatedBookmarks = currentBookmarks.filter(ref => ref.id !== exerciseId);

  if (updatedBookmarks.length === currentBookmarks.length) {
    throw new GraphQLError("Вправа не знайдена в обраному");
  }

  await userRef.update({
    bookmarks: updatedBookmarks,
  });

  return { success: true, message: "Вправа видалена з обраного" };
};
