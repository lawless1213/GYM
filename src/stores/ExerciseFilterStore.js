import { makeAutoObservable, runInAction  } from 'mobx';
import client from '../providers/apolloClient';
import { GET_FILTERS } from '../queries/filters';
import { equipment, bodyParts } from '../data/filters';


export class ExerciseFilterStore {
  bodyPart = [];
  equipment = [];

  constructor(rootStore) {
		this.rootStore = rootStore;
    
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
}