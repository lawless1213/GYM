import { makeAutoObservable, runInAction } from 'mobx';
import { collection, doc, query, where, getDoc, getDocs, setDoc, updateDoc, arrayUnion, arrayRemove, addDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { FirebaseService } from '../firebase/functions';
import { GET_EXERCISES } from '../queries/exercises';
import client from '../providers/apolloClient';
import { GET_USER } from '../queries/user';

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

  async loadExercises(group) {
    let response;
    let data = [];

		try {
      switch (group) {
        case groupNames.BOOKMARKS:
          console.log('BOOKMARKS');
          response = await client.query({ query: GET_USER });
          data = response.data.getUserData.bookmarks;
          break;
        case groupNames.PERSONAL:
          console.log('PERSONAL');
          
          break;      
        default:
          response = await client.query({ query: GET_EXERCISES });
          data = response.data.getExercises;
          break;
      }
      
			runInAction(() => (this.allExercises[group] = data));
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
    
    const exerciseId = crypto.randomUUID();
    const newExercise = {
      author: this.currentUser.uid,
      authorName: this.currentUser.displayName,
      ...exercise
    };

    newExercise.id = exerciseId;
  
    try {
      const [preview, video] = await Promise.all([
        imageFile && FirebaseService.uploadFile(imageFile, "preview"),
        videoFile && FirebaseService.uploadFile(videoFile, "video"),
      ]);
  
      newExercise.preview = preview ?? '';
      newExercise.video = video ?? '';
  
      await setDoc(doc(db, "exercises", exerciseId), newExercise); // Задаємо ID вручну
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
    console.log(id);
    
    try {
      const userRef = doc(db, "users", this.currentUser.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      const bookmarks = Array.isArray(userData?.bookmarks) ? userData.bookmarks : [];
      const exerciseRef = doc(db, "exercises", id); // Замість рядка створюємо DocumentReference
  
      // Перевіряємо, чи є об'єкт у списку (порівнюємо по path)
      const isFav = bookmarks.some(ref => ref.path === exerciseRef.path);
  
      await updateDoc(userRef, {
        bookmarks: isFav ? arrayRemove(exerciseRef) : arrayUnion(exerciseRef), // Тепер це Reference
      });
  
      runInAction(() => {
        if (isFav) {
          this.allExercises[groupNames.BOOKMARKS] = this.allExercises[groupNames.BOOKMARKS].filter(e => e.id !== id);
        } else {
          getDoc(exerciseRef).then(doc => {
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
