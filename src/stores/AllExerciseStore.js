import { makeAutoObservable } from 'mobx';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export class AllExerciseStore {
	items = [];

	constructor(rootStore) {
		this.rootStore = rootStore;
		this.loadItems();
		makeAutoObservable(this);
	}

	loadItems = async () => {
		try {
			const exercisesCollection = collection(db, "exercises"); // Задаємо колекцію
			const querySnapshot = await getDocs(exercisesCollection); // Отримуємо всі документи
			const exercises = [];
	
			querySnapshot.forEach((doc) => {
				exercises.push({ id: doc.id, ...doc.data() }); // Додаємо ID та дані до масиву
			});
	
			console.log("Exercises:", exercises);
			this.items = exercises;
		} catch (e) {
			console.error("Error fetching exercises: ", e);
		}
	};

	// addExercises = async () => {
	// 	const exercisesRef = doc(db, "exercises", "yourDocumentId"); // Вказати ID документа
	// 	await setDoc(exercisesRef, {
	// 		exercises: [
	// 			{
	// 				name: "Push-up",
	// 				description: "A basic push-up exercise for chest and arms.",
	// 				category: "Strength",
	// 				image: "https://example.com/images/pushup.png"
	// 			}
	// 		]
	// 	});
	// };
	
}