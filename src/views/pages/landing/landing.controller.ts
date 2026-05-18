import {ViewController} from "data/types/structure";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
import {inject, injectable} from "inversify";
import {makeAutoObservable} from "mobx";
import {Bindings} from "bindings";
import type {IUserStore} from "data/stores/user/user.store";
import {ModalType} from "data/enums";
import type {IModalsStore} from "data/stores/modals/modals.store";

export interface ILandingController extends ViewController {
	readonly i18n: ILocalizationStore;
	get isAuthorized(): boolean;
	openAuthorizationModal(): void;
}

@injectable()
export class LandingController implements ILandingController {
	get isAuthorized() {
		return this._userStore.isAuthorized;
	}

	constructor(
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.UserStore) private _userStore: IUserStore,
		@inject(Bindings.ModalsStore) private _modalsStore: IModalsStore
	) {
		makeAutoObservable(this);
	}

	openAuthorizationModal = () => {
		this._modalsStore.showModal(ModalType.LOGIN);
	};
}
