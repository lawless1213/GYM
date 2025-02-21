import { makeAutoObservable, runInAction  } from 'mobx';
import client from '../providers/apolloClient';
import { GET_FILTERS } from '../queries/filters';
import { equipment, bodyParts } from '../data/filters';


export class ExerciseFilterStore {
  bodyPart = [];
  equipment = [];

  constructor(rootStore) {
		this.rootStore = rootStore;
    // this.addFilters(equipment, bodyParts);
    
    makeAutoObservable(this, {}, { autoBind: true });
  }

  loadFilter = async (filterName) => {
    try {
      const { data } = await client.query({
        query: GET_FILTERS,
        variables: { name: filterName },
      });

      runInAction(() => this[filterName] = data.getFilters.values || []);
			
    } catch (e) {
      console.error(`Error fetching ${filterName}:`, e);
    }
  };

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
}