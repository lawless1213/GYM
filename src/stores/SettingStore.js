import { makeAutoObservable } from 'mobx';

export class SettingStore {
	isVideoPreview = false;

	constructor(rootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this);
	}

	togglePreview() {
		this.isVideoPreview = !this.isVideoPreview;
	};
}