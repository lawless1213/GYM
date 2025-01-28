import { makeAutoObservable, runInAction } from 'mobx';
import { collection, doc, query, where, DocumentReference, getDoc, getDocs, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const groupNames = {
	ALL: 'all',
	BOOKMARKS: 'bookmarks',
	PERSONAL: 'personal',
}

export class ExerciseStore {
  allExercises = { all: [], bookmarks: [], personal: [] };
	groupExercise = groupNames.ALL;
  filters = {};

  constructor(rootStore, currentUser) {
    this.rootStore = rootStore;
    this.currentUser = currentUser;
		
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setFilters = (name, value) => {
    runInAction(() => {
      this.filters[name] = value.toLowerCase();
    });

    this.loadExercises();
  };

  setGroupExercise(value) {
    runInAction(() => {
      this.groupExercise = value;
    });
    this.loadItems();
  }

  loadItems = async () => {
    switch (this.groupExercise) {
			case groupNames.BOOKMARKS:
				this.loadBookmarks();
				break;
			case groupNames.PERSONAL:
				this.loadPersonal();
				break;
			default:
				this.loadExercises();
				break;
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
				this.allExercises[groupNames.ALL] = exercises;
			});
		} catch (e) {
			console.error("Error fetching exercises: ", e);
		}
	};
	

	loadPersonal = async () => {
		if (!this.currentUser) return;

    try {
			const q = query(collection(db, "exercises"), where("author", "==", this.currentUser.uid));
			const querySnapshot = await getDocs(q);

			const exercises = [];
	
			querySnapshot.forEach((doc) => {
				exercises.push({ id: doc.id, ...doc.data() });
			});

			runInAction(() => {
				this.allExercises[groupNames.PERSONAL] = exercises;
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
	
				for (const favorite of favorites) {
					const favoriteRef = typeof favorite === "string" ? doc(db, favorite) : favorite; // Перетворення рядка на DocumentReference
					const exerciseDoc = await getDoc(favoriteRef);
			
					if (exerciseDoc.exists()) {
							bookmarks.push({ id: favoriteRef.id, ...exerciseDoc.data() });
					} else {
							console.warn(`Документ не знайдено: ${favoriteRef.path}`);
					}
			}
	
				runInAction(() => {
					this.allExercises[groupNames.BOOKMARKS] = bookmarks;
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
        const exerciseRef = doc(db, exercisePath);
        const userRef = doc(db, "users", this.currentUser.uid);

        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            await setDoc(userRef, { bookmarks: [] });
        }

        if (this.isFavorite(id)) {
            await updateDoc(userRef, {
                bookmarks: arrayRemove(exerciseRef.path),
            });

            runInAction(() => {
							this.allExercises[groupNames.BOOKMARKS] = this.allExercises[groupNames.BOOKMARKS].filter(bookmark => bookmark.id !== id);
            });
        } else {
            await updateDoc(userRef, {
                bookmarks: arrayUnion(exerciseRef.path),
            });

            const exerciseDoc = await getDoc(exerciseRef);
            if (exerciseDoc.exists()) {
                runInAction(() => {
									this.allExercises[groupNames.BOOKMARKS].push({ id: exerciseDoc.id, ...exerciseDoc.data() });
                });
            }
        }
    } catch (error) {
        console.error("Error updating bookmarks:", error);
    }
	};

  isFavorite = (id) => {
		return this.allExercises[groupNames.BOOKMARKS].some(bookmark => bookmark.id === id);
	};
}