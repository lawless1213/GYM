import { makeAutoObservable, runInAction  } from 'mobx';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export class ExerciseFilterStore {
  bodyPart = [];
  equipment = [];

  constructor(rootStore) {
		this.rootStore = rootStore;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  loadFilter = async (filterName) => {
    try {
      const filtersDocRef = doc(db, "exercisesParams", "filters");
      const docSnapshot = await getDoc(filtersDocRef);

      if (docSnapshot.exists()) {
        runInAction(() => {
          this[filterName] = docSnapshot.data()[filterName] || [];
				});
      } else {
        console.error("No such document!");
      }
			
    } catch (e) {
      console.error("Error fetching body parts: ", e);
    }
  };
}