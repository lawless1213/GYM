import { db } from "../firebase.js";

export const getUserSchedule = async (userId, startDate, endDate) => {
  const scheduleRef = db.collection("users").doc(userId).collection("schedule");
  // Firestore: date у форматі YYYY-MM-DD
  const snapshot = await scheduleRef
    .where("date", ">=", startDate)
    .where("date", "<=", endDate)
    .get();

  const days = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    days.push({
      date: data.date,
      workouts: data.workouts || [],
    });
  });

  // Можна відсортувати за датою
  days.sort((a, b) => a.date.localeCompare(b.date));
   return days;
};