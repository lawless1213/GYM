import { db } from "../../firebase.js";
import { GraphQLError } from "graphql";


export const addToBookmarks = async (_, { exerciseId }, context) => {
  if (!context.user) {
    console.error("❌ Користувач відсутній у контексті");
    throw new GraphQLError("Unauthorized"); 
  }

  const userRef = db.collection("users").doc(context.user.uid);
  const exerciseRef = db.collection("exercises").doc(exerciseId);

  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    throw new GraphQLError("Користувач не знайдений");
  }

  const userData = userDoc.data();
  const currentBookmarks = userData.bookmarks || [];

  if (currentBookmarks.some(ref => ref.id === exerciseId)) {
    throw new GraphQLError("Ця вправа вже в обраному");
  }

  await userRef.update({
    bookmarks: [...currentBookmarks, exerciseRef],
  });

  return { success: true, message: "Вправа додана в обране" };
};