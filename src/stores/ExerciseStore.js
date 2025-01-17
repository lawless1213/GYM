import { makeAutoObservable } from 'mobx';
import { collection, doc, DocumentReference, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export class ExerciseStore {
	allExercises = [];
	bookmarks = [];

	constructor(rootStore, currentUser) {
		this.rootStore = rootStore;
		this.currentUser = currentUser;
		this.loadAllExercises();
		this.loadBookmarks();
		makeAutoObservable(this);
	}

	loadAllExercises = async () => {
		try {
			const exercisesCollection = collection(db, "exercises");
			const querySnapshot = await getDocs(exercisesCollection);
			const exercises = [];
	
			querySnapshot.forEach((doc) => {
				exercises.push({ id: doc.id, ...doc.data() });
			});

			this.allExercises = exercises;
		} catch (e) {
			console.error("Error fetching exercises: ", e);
		}
	};

	loadBookmarks = async () => {
    if (!this.currentUser) return;

    try {
      const userRef = doc(db, 'users', this.currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const favorites = userDoc.data().bookmarks || [];
        const bookmarks = [];
				
				for (const favoriteRef of favorites) {
					if (favoriteRef instanceof DocumentReference) {
							try {
									const exerciseDoc = await getDoc(favoriteRef);
			
									if (exerciseDoc.exists()) {
											bookmarks.push({ id: favoriteRef.id, ...exerciseDoc.data() });
									} else {
											console.warn(`Document not found for reference: ${favoriteRef.path}`);
									}
							} catch (error) {
									console.error("Error fetching document:", error);
							}
					} else {
							console.error("Unexpected data format in bookmarks:", favoriteRef);
					}
			}

        this.bookmarks = bookmarks;
      }
    } catch (e) {
      console.error("Error loading bookmarks: ", e);
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