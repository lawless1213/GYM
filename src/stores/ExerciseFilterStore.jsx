import { makeAutoObservable } from 'mobx';
import { collection, doc, DocumentReference, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export class ExerciseFilterStore {
	
	
	constructor(rootStore, currentUser) {
		
		makeAutoObservable(this);
	}

}