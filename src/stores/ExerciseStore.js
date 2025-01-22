import { makeAutoObservable, runInAction } from 'mobx';
import { collection, doc, query, where, DocumentReference, getDoc, getDocs, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase/firebase";

export class ExerciseStore {
  allExercises = [];
  bookmarks = [];
  filters = {};
  isBookmarks = false;

  constructor(rootStore, currentUser) {
    this.rootStore = rootStore;
    this.currentUser = currentUser;
		this.loadBookmarks();
		
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setFilters = (name, value) => {
    runInAction(() => {
      this.filters[name] = value.toLowerCase();
    });

    this.loadExercises();
  };

  setIsBookmarks(value) {
    runInAction(() => {
      this.isBookmarks = value;
    });
    this.loadItems();
  }

  loadItems = async () => {
    if (this.isBookmarks) {
      await this.loadBookmarks();
    } else {
      await this.loadExercises();
    }
  };

  loadExercises = async () => {
    try {
      const exercisesCollection = collection(db, "exercises");

      const conditions = Object.entries(this.filters)
        .filter(([_, value]) => value)
        .map(([key, value]) => where(key, "==", value));

      const exercisesQuery = conditions.length > 0 
        ? query(exercisesCollection, ...conditions) 
        : exercisesCollection;

      const querySnapshot = await getDocs(exercisesQuery);
      const exercises = [];

      querySnapshot.forEach((doc) => {
        exercises.push({ id: doc.id, ...doc.data() });
      });

      runInAction(() => {
        this.allExercises = exercises;
      });
    } catch (e) {
      console.error("Error fetching exercises: ", e);
    }
  };

  loadBookmarks = async () => {
		if (!this.currentUser) return;
	
		try {
			const userRef = doc(db, "users", this.currentUser.uid);
			const userDoc = await getDoc(userRef);
	
			if (userDoc.exists()) {
				const favorites = userDoc.data().bookmarks || [];
				const bookmarks = [];
	
				for (const favoriteRef of favorites) {
					const exerciseDoc = await getDoc(favoriteRef);
	
					if (exerciseDoc.exists()) {
						bookmarks.push({ id: favoriteRef.id, ...exerciseDoc.data() });
					} else {
						console.warn(`Document not found for reference: ${favoriteRef.path}`);
					}
				}
	
				runInAction(() => {
					this.bookmarks = bookmarks;
				});
			}
		} catch (e) {
			console.error("Error loading bookmarks: ", e);
		}
	};

  toggleBookmark = async (id) => {
		if (!this.currentUser) return;
	
		try {
			const exercisePath = `exercises/${id}`;
			const userRef = doc(db, "users", this.currentUser.uid);
	
			if (this.isFavorite(id)) {
				await updateDoc(userRef, {
					bookmarks: arrayRemove(doc(db, exercisePath)), // Використовуємо DocumentReference
				});
	
				runInAction(() => {
					this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
				});
			} else {
				await updateDoc(userRef, {
					bookmarks: arrayUnion(doc(db, exercisePath)), // Використовуємо DocumentReference
				});

				const exerciseDoc = await getDoc(doc(db, exercisePath));
	
				if (exerciseDoc.exists()) {
					runInAction(() => {
						this.bookmarks.push({ id: exerciseDoc.id, ...exerciseDoc.data() });
					});
				}
			}
		} catch (error) {
			console.error("Error updating bookmarks:", error);
		}
	};

  isFavorite = (id) => {
		return this.bookmarks.some(bookmark => bookmark.id === id);
	};
}