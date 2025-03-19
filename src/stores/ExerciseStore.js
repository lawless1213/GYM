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
    this.loadExercises(groupNames.BOOKMARKS);
    makeAutoObservable(this, {}, { autoBind: true });
  }


  async loadExercises(group = this.groupExercise) {
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
          response = await client.query({
            query: GET_PERSONAL_EXERCISES,
            variables: { uid: this.currentUser.uid },
          });
          data = response.data.getPersonalExercises;
          break;     
        default:
          response = await client.query({
            query: GET_EXERCISES,
            variables: { filters: this.filters } 
          });
          data = response.data.getExercises;
          break;
      }
      
			runInAction(() => (this.allExercises[group] = data));
		} catch (error) {
			console.error("Error loading exercises:", error);
		}
	}

	async updateExercise(updatedData, image = '', video = '') {
		if (!this.currentUser) return false;

		try {
      const uploadIfNeeded = async (file, folder) => 
        file && typeof file !== 'string' ? await FirebaseService.uploadFile(file, folder) : file;
    
      const [imageUrl, videoUrl] = await Promise.all([
        uploadIfNeeded(image, "preview"),
        uploadIfNeeded(video, "videos")
      ]);
  
      const updatedExercise = {
        ...updatedData,
        preview: imageUrl || '',
        video: videoUrl || '',
      };
      

			const mutationResult = await client.mutate({
        mutation: UPDATE_EXERCISE,
        variables: { input: updatedExercise }
      });

      if (mutationResult.data) {
        runInAction(() => {
          this.allExercises[this.groupExercise] = this.allExercises[this.groupExercise].map(exercise => 
            exercise.id === id ? updatedExercise : exercise
          );
        });
      } else {
        throw new Error("Не вдалося створити вправу");
      }
	
			return true;
		} catch (error) {
			console.error("Error updating exercise:", error);
			return false;
		}
	}

  // async createExercise(exercise, imageFile = null, videoFile = null) {
  //   if (!this.currentUser) return;
    
  //   try {
  //     const [preview, video] = await Promise.all([
  //       imageFile ? FirebaseService.uploadFile(imageFile, "preview") : '',
  //       videoFile ? FirebaseService.uploadFile(videoFile, "video") : '',
  //     ]);

  //     const newExercise = {
  //       ...exercise,
  //       preview,
  //       video,
  //     };

  //     const mutationResult = await client.mutate({
  //       mutation: CREATE_EXERCISE,
  //       variables: { input: newExercise }
  //     });

  //     if (mutationResult.data) {
  //       runInAction(() => {
  //         this.loadExercises();
  //       });
  //     } else {
  //       throw new Error("Не вдалося створити вправу");
  //     }
  //   } catch (error) {
  //     console.error("Error creating exercise:", error);
  //     return false;
  //   }
  // }

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
	

  isFavorite(id) {
    return this.allExercises[groupNames.BOOKMARKS].some(bookmark => bookmark.id === id);
  }
}
