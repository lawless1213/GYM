import { makeAutoObservable, runInAction } from 'mobx';
import { collection, doc, query, where, getDoc, getDocs, setDoc, updateDoc, arrayUnion, arrayRemove, addDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { FirebaseService } from '../firebase/functions';
import { GET_EXERCISES } from '../queries/exercises';
import client from '../providers/apolloClient';



export const groupNames = {
  ALL: 'all',
  BOOKMARKS: 'bookmarks',
  PERSONAL: 'personal',
};

export class ExerciseStore {
  allExercises = { all: [], bookmarks: [], personal: [] };
  groupExercise = groupNames.ALL;
  filters = {};

  constructor(rootStore, currentUser) {
    this.rootStore = rootStore;
    this.currentUser = currentUser;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setFilters(name, values) {
    if (!values) {
      this.filters.name = null;
      this.filters.values = [];
    } else {
      runInAction(() => {
        this.filters.name = name;
        this.filters.values = values;
      });
    }
    console.log(this.filters);
    
    this.loadExercises();
  }

  setGroupExercise(value) {
    runInAction(() => {
      this.groupExercise = value;
    });
    this.loadExercises(value);
  }

  async loadExercises(group = 'all') {
		try {
			const {data} = await client.query({ query: GET_EXERCISES });
      
			runInAction(() => (this.allExercises[group] = data.getExercises));
		} catch (error) {
			console.error("Error loading exercises:", error);
		}
	}

	async updateExercise(id, updatedData, imageFile = null, videoFile = null) {
		if (!this.currentUser) return false;
	
		try {
			const updatedExercise = await FirebaseService.updateExercise(id, updatedData, imageFile, videoFile);
	
			runInAction(() => {
				this.allExercises[this.groupExercise] = this.allExercises[this.groupExercise].map(exercise => 
					exercise.id === id ? updatedExercise : exercise
				);
			});
	
			return true;
		} catch (error) {
			console.error("Error updating exercise:", error);
			return false;
		}
	}

  async createExercise(exercise, imageFile = null, videoFile = null) {
    if (!this.currentUser) return;

    const newExercise = {
      author: this.currentUser.uid,
      authorName: this.currentUser.displayName,
      ...exercise
    };

    try {
      const [preview, video] = await Promise.all([
        imageFile && FirebaseService.uploadFile(imageFile, "preview"),
        videoFile && FirebaseService.uploadFile(videoFile, "video"),
      ]);

      if (preview) newExercise.preview = preview;
      if (video) newExercise.video = video;

      await addDoc(collection(db, "exercises"), newExercise);
      this.loadExercises(this.groupExercise);
      return true;
    } catch (error) {
      console.error("Error creating exercise:", error);
      return false;
    }
  }

  async deleteExercise({ id, author, preview, video }) {
    if (!this.currentUser || this.currentUser.uid !== author) return;

    try {
      await Promise.all([
        deleteDoc(doc(db, "exercises", id)),
        preview && FirebaseService.deleteFile(preview),
        video && FirebaseService.deleteFile(video)
      ]);

      runInAction(() => {
        this.allExercises[this.groupExercise] = this.allExercises[this.groupExercise].filter(ex => ex.id !== id);
      });

      return true;
    } catch (error) {
      console.error("Error deleting exercise:", error);
      return false;
    }
  }

  async toggleBookmark(id) {
		if (!this.currentUser) return;
	
		try {
			const userRef = doc(db, "users", this.currentUser.uid);
			const userDoc = await getDoc(userRef);
			const userData = userDoc.data();
			const bookmarks = Array.isArray(userData?.bookmarks) ? userData.bookmarks : [];
			const isFav = bookmarks.includes(`exercises/${id}`);
	
			await updateDoc(userRef, {
				bookmarks: isFav ? arrayRemove(`exercises/${id}`) : arrayUnion(`exercises/${id}`),
			});
	
			runInAction(() => {
				if (isFav) {
					this.allExercises[groupNames.BOOKMARKS] = this.allExercises[groupNames.BOOKMARKS].filter(e => e.id !== id);
				} else {
					getDoc(doc(db, "exercises", id)).then(doc => {
						if (doc.exists()) {
							runInAction(() => this.allExercises[groupNames.BOOKMARKS].push({ id: doc.id, ...doc.data() }));
						}
					});
				}
			});
		} catch (error) {
			console.error("Error updating bookmarks:", error);
		}
	}
	

  isFavorite(id) {
    return this.allExercises[groupNames.BOOKMARKS].some(bookmark => bookmark.id === id);
  }
}
