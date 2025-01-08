import { ExerciseStore } from './ExerciseStore';
import { AllExerciseStore } from './AllExerciseStore';

class RootStore {
  constructor() {
    this.ExerciseStore = new ExerciseStore(this);
    this.AllExerciseStore = new AllExerciseStore(this);
  }
}

export const rootStore = new RootStore();