import { db } from "../../firebase.js";

export const updateWorkout = async (_, { input }, context) => {
  if (!context.user) throw new Error("Unauthorized");

  try {
    const userRef = db.collection("users").doc(context.user.uid);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    if (!userData?.workouts?.[input.id]) {
      throw new Error("Workout not found");
    }

    const updatedWorkout = {
      ...userData.workouts[input.id],
      ...input,
    };

    await userRef.set(
      {
        workouts: {
          ...userData.workouts,
          [input.id]: updatedWorkout,
        },
      },
      { merge: true }
    );

    return {
      success: true,
      message: "Програму оновлено",
      workout: updatedWorkout,
    };
  } catch (error) {
    console.error("❌ Помилка оновлення програми:", error);
    throw new Error("Не вдалося оновити програму");
  }
};