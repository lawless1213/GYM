import { makeAutoObservable, runInAction } from 'mobx';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { FirebaseService } from '../firebase/functions';
import { GET_EXERCISES, GET_PERSONAL_EXERCISES } from '../queries/exercises';
import { GET_USER } from '../queries/user';
import client from '../providers/apolloClient';
import { ADD_TO_BOOKMARKS, REMOVE_FROM_BOOKMARKS, CREATE_EXERCISE, UPDATE_EXERCISE } from '../mutations/exercises';

export const groupNames = {
  ALL: 'all',
  BOOKMARKS: 'bookmarks',
  PERSONAL: 'personal',
};

export const filterNames = {
  BODYPART: 'bodyPart',
  EQUIPMENT: 'equipment'
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

  async toggleBookmark(id) {
    if (!this.currentUser) return;
    
    try {
      const exerciseRef = doc(db, "exercises", id);
      const isFav = this.allExercises.bookmarks.some(exercise => exercise.id === id);
      let mutationResult;
  
      if (isFav) {
        mutationResult = await client.mutate({
          mutation: REMOVE_FROM_BOOKMARKS,
          variables: { exerciseId: id },
        });
  
        if (mutationResult.data) {
          runInAction(() => {
            this.allExercises[groupNames.BOOKMARKS] = this.allExercises[groupNames.BOOKMARKS].filter(e => e.id !== id);
          });
        } else {
          throw new Error("Не вдалося видалити вправу з обраних");
        }
      } else {
        mutationResult = await client.mutate({
          mutation: ADD_TO_BOOKMARKS,
          variables: { exerciseId: id },
        });
  
        if (mutationResult.data) {
          getDoc(exerciseRef).then(doc => {
            if (doc.exists()) {
              runInAction(() => {
                this.allExercises[groupNames.BOOKMARKS].push({ id: doc.id, ...doc.data() });
              });
            }
          });
        } else {
          throw new Error("Не вдалося додати вправу в обрані");
        }
      }
    } catch (error) {
      console.error("Error updating bookmarks:", error);
    }
  }
}
