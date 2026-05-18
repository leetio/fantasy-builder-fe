import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
import {Bindings} from "bindings";
import {makeAutoObservable} from "mobx";
import type {IUserStore} from "data/stores/user/user.store";

export type {TArticle} from "data/stores/static_content/static_content.store";

export interface IContactUsController extends ViewController {
	readonly i18n: ILocalizationStore;
	openZendesk: () => void;
	get locale(): string | null;
}

@injectable()
export class ContactUsController implements IContactUsController {
	constructor(
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.UserStore) public _userStore: IUserStore
	) {
		makeAutoObservable(this);
	}

	get user() {
		return this._userStore.user;
	}

	get locale() {
		return this.i18n.locale;
	}

	public openZendesk = () => {
		const locale = this.locale;

		if (locale) {
			window.zE?.setLocale(locale.toLowerCase());
		}

		if (this.user) {
			const {email, displayName} = this.user;

			window.zE?.identify({
				name: `${displayName}`,
				email,
			});
		}

		window.zE?.activate();
	};
}
