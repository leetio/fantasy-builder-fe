import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import type {IUser, IUserStore} from "data/stores/user/user.store";
import {action, makeAutoObservable, observable, runInAction} from "mobx";
import {Bindings} from "bindings";
import type {ChangeEvent, SyntheticEvent} from "react";
import type {AxiosError} from "axios";
import type {IApiResponse} from "data/types/http";
import {fromErrorToMessage} from "data/utils";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
import {RequestTask} from "data/utils/request_task";

interface IMyAccountFormElement extends HTMLFormElement {
	displayName: HTMLInputElement;
	email: HTMLInputElement;
	isNotificationsEnabled: HTMLInputElement;
}

export interface IMyAccountController extends ViewController {
	readonly i18n: ILocalizationStore;

	get isFormDisabled(): boolean;
	get error(): Record<string, string> | null;
	get displayName(): string;
	get user(): IUser;
	get isUpdateDisabled(): boolean;
	get isNotificationFormDisabled(): boolean;

	handleFormSubmit: (event: SyntheticEvent<IMyAccountFormElement>) => void;
	handleNotificationFormSubmit: (event: SyntheticEvent<IMyAccountFormElement>) => void;
	handleClearErrorOnChange: () => void;
	handleNotificationFormChange: () => void;
	handleInputDisplayNameValue: (event: ChangeEvent<HTMLInputElement>) => void;
	handleLogout: () => void;
}

@injectable()
export class MyAccountController implements IMyAccountController {
	@observable private _request = new RequestTask();
	@observable private _errorMsg: string | null = null;
	@observable private _errorPlace = "";
	@observable private _displayName = "";
	@observable private _isFormChanged = false;
	@observable private _isNotificationFormChanged = false;

	get isUpdateDisabled() {
		return this.isFormDisabled || !this._isFormChanged;
	}

	get isNotificationFormDisabled() {
		return this.isFormDisabled || !this._isNotificationFormChanged;
	}

	get user() {
		return this._userStore.user!;
	}

	get displayName() {
		return this._displayName;
	}

	get error() {
		if (!this._errorMsg) return null;

		return {
			[this._errorPlace || "common"]: this._errorMsg,
		};
	}

	get isFormDisabled() {
		return this._request.isLoading;
	}

	constructor(
		@inject(Bindings.UserStore) private _userStore: IUserStore,
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore
	) {
		makeAutoObservable(this);
		this._displayName = this._userStore.user?.displayName ?? "";
	}

	@action handleInputDisplayNameValue = (event: ChangeEvent<HTMLInputElement>) => {
		this._displayName = event.target.value.replace("@", "");
	};

	@action private reportError(error: string, place: string = "") {
		this._errorMsg = error;
		this._errorPlace = place;

		return true;
	}

	@action public handleFormSubmit = (event: SyntheticEvent<IMyAccountFormElement>) => {
		event.preventDefault();

		const {displayName, email} = event.currentTarget;

		const validateList = [
			{field: email, error: "Please provide a valid email address", place: "email"},
			{field: displayName, error: "Please provide your display name", place: "username"},
		];

		const hasError = validateList.find(({field, error, place}) =>
			field.checkValidity() ? false : this.reportError(error, place)
		);

		if (hasError) {
			return;
		}

		const payload = {
			displayName: displayName.value,
			email: email.value,
		};

		this._request
			.run(() => this._userStore.update(payload))
			.onSuccess(() =>
				runInAction(() => {
					this._isFormChanged = false;
				})
			)
			.onError(this.showError);
	};

	@action handleNotificationFormSubmit = (event: SyntheticEvent<IMyAccountFormElement>) => {
		event.preventDefault();

		const {isNotificationsEnabled} = event.currentTarget;

		const payload = {
			isNotificationsEnabled: isNotificationsEnabled.checked,
		};

		this._request
			.run(() => this._userStore.update(payload))
			.onSuccess(() =>
				runInAction(() => {
					this._isNotificationFormChanged = false;
				})
			)
			.onError(this.showError);
	};

	@action handleNotificationFormChange = () => {
		this._isNotificationFormChanged = true;
	};

	@action private showError = (error: AxiosError<IApiResponse>) => {
		this._errorMsg = fromErrorToMessage(error);
	};

	@action handleClearErrorOnChange = () => {
		this._errorMsg = null;
		this._errorPlace = "";
		this._isFormChanged = true;
	};

	@action handleLogout = () => {
		this._request.run(() => this._userStore.logout()).onError(this.showError);
	};
}
