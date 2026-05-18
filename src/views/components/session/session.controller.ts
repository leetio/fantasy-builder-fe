import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import type {IUserStore} from "data/stores/user/user.store";
import {Bindings} from "bindings";
import {action, makeAutoObservable, observable, runInAction} from "mobx";
import type {ILocalizationStore} from "data/stores/localization/localization.store";

export interface ISessionController extends ViewController {
	get isSessionChecked(): boolean;
}

@injectable()
export class SessionController implements ISessionController {
	@observable _isSessionChecked = false;

	constructor(
		@inject(Bindings.UserStore) private _userStore: IUserStore,
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore
	) {
		makeAutoObservable(this);
	}

	get isSessionChecked(): boolean {
		return this._isSessionChecked;
	}

	@action init() {
		void this._userStore
			.requestUser()
			.catch(() => {
				// Do nothing as the error is expected when a user isn't authorized
			})
			.then(() =>
				runInAction(() => {
					this._isSessionChecked = true;
				})
			);
	}
}
