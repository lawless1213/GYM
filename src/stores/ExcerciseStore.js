import { makeAutoObservable } from 'mobx';
import { workoutPlan } from '../data/testData';

export class ExcerciseStore {
	dayOfWeek = '';
  items = [];
	currentExercisePointer = 0;

  constructor(rootStore) {
    this.rootStore = rootStore;
		this.setDayOfWeek();
		this.loadItems();
    makeAutoObservable(this);
  }

	setDayOfWeek() {
    this.dayOfWeek = new Date().getDay();
  }

	loadItems() {
    this.items = workoutPlan;
  }

	get todayWorkout() {
		return this.items[this.dayOfWeek];
  }

	get currentExercise() {
    return this.todayWorkout.exercises[this.currentExercisePointer];
  }

	toggleNextExercise() {
		this.currentExercisePointer += 1;
	}

	toggleExerciseSet() {
		const { sets, setsEnd } = this.items[this.dayOfWeek].exercises[currentExercisePointer];

		if(setsEnd < sets) {
			this.items[this.dayOfWeek].exercises[currentExercisePointer].setsEnd += 1;
		} else {

		}
	}
}