import { ExcerciseStore } from './ExcerciseStore';

class RootStore {
  constructor() {
    this.ExcerciseStore = new ExcerciseStore(this);
  }
}

export const rootStore = new RootStore();