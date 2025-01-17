import { makeAutoObservable } from 'mobx';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export class ExerciseFilterStore {
  bodyPart = [];
  equipment = [];

  constructor(rootStore) {
		this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  loadFilter = async (filterName) => {
		console.log(filterName);
		
    try {
      const filtersDocRef = doc(db, "exercisesParams", "filters");
			console.log(filtersDocRef);
			
      const docSnapshot = await getDoc(filtersDocRef);

      if (docSnapshot.exists()) {
        this[filterName] = docSnapshot.data()[filterName] || [];
      } else {
        console.error("No such document!");
      }
			
    } catch (e) {
      console.error("Error fetching body parts: ", e);
    }
  };
}