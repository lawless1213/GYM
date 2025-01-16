import { ExerciseStore } from './ExerciseStore';
import { AllExerciseStore } from './AllExerciseStore';
import { SettingStore } from './SettingStore';

class RootStore {
  constructor() {
    this.ExerciseStore = new ExerciseStore(this);
    this.AllExerciseStore = new AllExerciseStore(this);
    this.SettingStore = new SettingStore(this);
  }
}

export const rootStore = new RootStore();