import { makeAutoObservable, runInAction  } from 'mobx';

export class SettingStore {
	isVideoPreview = false;

	constructor(rootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this, {}, { autoBind: true });
	}

	togglePreview() {
		this.isVideoPreview = !this.isVideoPreview;
	};
}