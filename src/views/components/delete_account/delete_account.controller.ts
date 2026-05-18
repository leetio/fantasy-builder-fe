import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import type {IUser, IUserStore} from "data/stores/user/user.store";
import {action, makeAutoObservable, observable} from "mobx";
import {Bindings} from "bindings";
import {ModalType} from "data/enums";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
import type {IModalsStore} from "data/stores/modals/modals.store";
import {RequestTask} from "data/utils/request_task";

export interface IDeleteAccountController extends ViewController {
	readonly i18n: ILocalizationStore;

	get user(): IUser;
	get isLoading(): boolean;

	deleteAccountModal: () => void;
}

@injectable()
export class DeleteAccountController implements IDeleteAccountController {
	@observable private _request = new RequestTask();

	constructor(
		@inject(Bindings.UserStore) private _userStore: IUserStore,
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.ModalsStore) private _modalsStore: IModalsStore
	) {
		makeAutoObservable(this);
	}

	get isLoading() {
		return this._request.isLoading;
	}

	get user() {
		return this._userStore.user!;
	}

	@action deleteAccountModal = () => {
		this._modalsStore.showModal(ModalType.CONFIRM, {
			message: this.i18n.t("delete_account.modal.body"),
			title: this.i18n.t("delete_account.modal.header"),
			callback: () => {
				this._modalsStore.hideModal();

				this._request
					.run(() => this._userStore.deactivate())
					.onError(this._modalsStore.showErrorModal);
			},
		});
	};
}
