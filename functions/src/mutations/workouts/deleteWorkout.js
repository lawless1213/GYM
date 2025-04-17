import { db } from "../../firebase.js";

export const deleteWorkout = async(_, {input: { id }}, context) => {
	if (!context.user) {
    throw new Error("Unauthorized");
  }

	try {
    const userRef = db.collection("users").doc(context.user.uid);
    const userDoc = await userRef.get();
    const currentWorkouts = userDoc.data()?.workouts || [];

    const updatedWorkouts = currentWorkouts.filter(workout => workout.id !== id);

    await userRef.update({
      workouts: updatedWorkouts
    });

    return { success: true, message: "Програму видалено" };
  } catch (error) {
    console.error("❌ Помилка видалення програми:", error);
    throw new Error("Не вдалося видалити програму");
  }

}