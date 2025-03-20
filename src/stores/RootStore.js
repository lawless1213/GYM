import { WorkoutStore } from './WorkoutStore';
import { SettingStore } from './SettingStore';

class RootStore {
  constructor(currentUser) {
    this.WorkoutStore = new WorkoutStore(this);
    this.SettingStore = new SettingStore(this);
  }
}

export const rootStore = (currentUser) => new RootStore(currentUser);