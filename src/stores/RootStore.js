import { WorkoutStore } from './WorkoutStore';
import { ExerciseStore } from './ExerciseStore';
import { SettingStore } from './SettingStore';
import { ExerciseFilterStore } from './ExerciseFilterStore';

class RootStore {
  constructor(currentUser) {
    this.WorkoutStore = new WorkoutStore(this);
    this.ExerciseFilterStore = new ExerciseFilterStore(this);
    this.ExerciseStore = new ExerciseStore(this, currentUser);
    this.SettingStore = new SettingStore(this);
  }
}

export const rootStore = (currentUser) => new RootStore(currentUser);