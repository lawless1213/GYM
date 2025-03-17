import { WorkoutStore } from './WorkoutStore';
import { ExerciseStore } from './ExerciseStore';
import { SettingStore } from './SettingStore';

class RootStore {
  constructor(currentUser) {
    this.WorkoutStore = new WorkoutStore(this);
    this.ExerciseStore = new ExerciseStore(this, currentUser);
    this.SettingStore = new SettingStore(this);
  }
}

export const rootStore = (currentUser) => new RootStore(currentUser);