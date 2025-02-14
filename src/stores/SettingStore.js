import { makeAutoObservable, runInAction  } from 'mobx';
import i18n from '../locales/i18n';
export class SettingStore {
	isVideoPreview = false;
	languages = i18n.languages;
	language = i18n.language;

	constructor(rootStore) {
		this.rootStore = rootStore;
		makeAutoObservable(this, {}, { autoBind: true });
	}

	togglePreview() {
		this.isVideoPreview = !this.isVideoPreview;
	};

	changeLanguage = () => {
		const newLang = this.language === "en" ? "uk" : "en";
		this.language = newLang;
		i18n.changeLanguage(newLang);
	};
}