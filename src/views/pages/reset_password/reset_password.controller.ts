import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import type {IResetPasswordPayload, IUserStore} from "data/stores/user/user.store";
import React from "react";
import {Bindings} from "bindings";
import {action, makeAutoObservable, observable} from "mobx";
import {ModalType} from "data/enums";
import type {AxiosError} from "axios";
import {fromErrorToMessage} from "data/utils";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
import {PASSWORD_REQUIREMENTS} from "data/constants";
import type {IModalsStore} from "data/stores/modals/modals.store";
import type {IApiResponse} from "data/types/http";
import {RequestTask} from "data/utils/request_task";

interface IResetPasswordForm extends HTMLFormElement {
	password: HTMLInputElement;
	confirmPassword: HTMLInputElement;
}

export interface IResetPasswordController extends ViewController {
	handleFormSubmit: (event: React.SyntheticEvent<IResetPasswordForm>) => void;
	resetPassword: (params: IResetPasswordPayload) => void;
	handleFormOnChange: () => void;

	get error(): Record<string, string> | null;
	get isSuccess(): boolean | undefined;
	get isFormDisabled(): boolean;
}

@injectable()
export class ResetPasswordController implements IResetPasswordController {
	@observable private _request = new RequestTask();
	@observable private _errorMsg: string | null = null;
	@observable private _errorPlace = "";
	@observable private _token = "";

	constructor(
		@inject(Bindings.UserStore) private _userStore: IUserStore,
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.ModalsStore) readonly _modalStore: IModalsStore
	) {
		makeAutoObservable(this);
	}

	get error() {
		if (!this._errorMsg) return null;

		return {
			[this._errorPlace || "common"]: this._errorMsg,
		};
	}

	get isSuccess() {
		return this._request.isSuccess;
	}

	get isFormDisabled() {
		return this._request.isLoading;
	}

	@action handleFormOnChange = () => {
		this._errorMsg = null;
		this._errorPlace = "";
		this._request.reset();
	};

	@action private showError = (error: AxiosError<IApiResponse>) => {
		this._errorMsg = fromErrorToMessage(error);
	};

	@action private showSuccessModal = () => {
		this._modalStore.showModal(ModalType.SUCCESS, {
			message: this.i18n.t(
				"reset_password.success_description",
				"Your new password is configured! Please login with your new password."
			),
		});
	};

	@action resetPassword(payload: IResetPasswordPayload) {
		this._request
			.run(() => this._userStore.resetPassword(payload))
			.onSuccess(this.showSuccessModal)
			.onError(this.showError);
	}

	@action handleFormSubmit = (event: React.SyntheticEvent<IResetPasswordForm>) => {
		event.preventDefault();
		const {password, confirmPassword} = event.currentTarget;

		if (!password.checkValidity()) {
			return this.reportError(PASSWORD_REQUIREMENTS, "password");
		}

		if (password.value !== confirmPassword.value) {
			return this.reportError("Passwords do not match", "confirmPassword");
		}

		this.resetPassword({
			password: password.value,
			token: this._token,
		});
	};

	@action private reportError(error: string, place: string = "") {
		this._errorMsg = error;
		this._errorPlace = place;

		return true;
	}

	init() {
		const searchParams = new URLSearchParams(window.location.search);
		this._token = searchParams.get("token") || "";
	}
}
