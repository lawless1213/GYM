import { makeAutoObservable, runInAction  } from 'mobx';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { equipment, bodyParts } from '../data/filters';
import { GET_FILTER } from '../queries/filters';
import client from '../providers/apolloClient';


export class ExerciseFilterStore {
  bodyPart = [];
  equipment = [];

  constructor(rootStore) {
		this.rootStore = rootStore;
    // this.addFilters(equipment, bodyParts);
    
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // async addFilters(equipmentArray, bodyPartsArray, merge = true) {
  //   try {
  //     const filtersDocRef = doc(db, "exercisesParams", "filters");
  //     const filtersDoc = await getDoc(filtersDocRef);

  //     if (filtersDoc.exists()) {
  //       // Отримуємо поточні фільтри
  //       const filterData = filtersDoc.data();
  //       console.log("Поточні фільтри:", filterData);

  //       const updatedFilters = {
  //         equipment: merge
  //           ? [...new Set([...(filterData.equipment || []), ...equipmentArray])] // Об'єднуємо унікальні значення
  //           : equipmentArray, // Або замінюємо

  //         bodyPart: merge
  //           ? [...new Set([...(filterData.bodyParts || []), ...bodyPartsArray])]
  //           : bodyPartsArray,
  //       };

  //       await setDoc(filtersDocRef, updatedFilters, { merge: true });
  //       console.log("Фільтри оновлено:", updatedFilters);
  //     } else {
  //       // Документу немає — створюємо новий
  //       const newFilters = {
  //         equipment: equipmentArray,
  //         bodyParts: bodyPartsArray,
  //       };

  //       await setDoc(filtersDocRef, newFilters);
  //       console.log("Фільтри створено:", newFilters);
  //     }

  //   } catch (error) {
  //     console.error("Помилка при оновленні filters:", error);
  //   }
  // }

  loadFilter = async (filterName) => {
    try {
      const { data } = await client.query({
        query: GET_FILTER,
        variables: { filterName },
      });

      runInAction(() => this[filterName] = data.getFilters|| []);
			
    } catch (e) {
      console.error(`Error fetching ${filterName}:`, e);
    }
  };
}