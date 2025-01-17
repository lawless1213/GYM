import { makeAutoObservable } from 'mobx';
import { workoutPlan } from '../data/testData';

export class WorkoutStore {
	dayOfWeek = 1;
	items = [];
	currentExercisePointer = 0;

	constructor(rootStore) {
		this.rootStore = rootStore;
		// this.setDayOfWeek();
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

	get exercisesLenght() {
		return this.items[this.dayOfWeek].exercises.lenght;
	}

	toggleNextExercise() {
		if (this.currentExercisePointer < this.exercisesLenght()) {
			this.currentExercisePointer += 1;
		}
	}

	toggleExerciseSet() {
		const { sets, setsEnd } = this.items[this.dayOfWeek].exercises[currentExercisePointer];
		if (!this.items[this.dayOfWeek].exercises[currentExercisePointer].setsEnd)
			this.items[this.dayOfWeek].exercises[currentExercisePointer].setsEnd = 0;

		if (setsEnd < sets) {
			this.items[this.dayOfWeek].exercises[currentExercisePointer].setsEnd += 1;
		} else {
			this.toggleNextExercise();
		}
	}
}