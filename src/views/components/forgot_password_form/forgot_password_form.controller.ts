import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import type {IForgotPasswordPayload, IUserStore} from "data/stores/user/user.store";
import React from "react";
import {Bindings} from "bindings";
import {action, makeAutoObservable, observable} from "mobx";
import {ModalType} from "data/enums";
import {fromErrorToMessage} from "data/utils";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
import type {IModalsStore} from "data/stores/modals/modals.store";
import {RequestTask} from "data/utils/request_task";
import {noop} from "lodash-es";
import {AxiosError} from "axios";

interface IForgotPasswordForm extends HTMLFormElement {
	email: HTMLInputElement;
}

export interface IForgotPasswordFormController extends ViewController {
	readonly i18n: ILocalizationStore;
	handleFormSubmit: (event: React.SyntheticEvent<IForgotPasswordForm>) => void;
	forgotPassword: (params: IForgotPasswordPayload) => void;
	handleFormOnChange: () => void;
	goToRegistration: () => void;

	get error(): string | null;
	get isSuccess(): boolean | undefined;
	get isFormDisabled(): boolean;
}

@injectable()
export class ForgotPasswordFormController implements IForgotPasswordFormController {
	@observable _request = new RequestTask();

	constructor(
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.UserStore) private _userStore: IUserStore,
		@inject(Bindings.ModalsStore) private _modalsStore: IModalsStore
	) {
		makeAutoObservable(this);
	}

	get error() {
		const error = this._request.axiosError;
		return error ? fromErrorToMessage(error) : null;
	}

	get isSuccess() {
		return this._request.isSuccess;
	}

	get isFormDisabled() {
		return this._request.isLoading;
	}

	@action handleFormOnChange = () => this._request.reset();

	@action private showSuccessModal = () => {
		this._modalsStore.showModal(ModalType.SUCCESS, {
			title: this.i18n.t("league.leave.confirm", "Email Sent"),
			message: this.i18n.t(
				"league.leave.confirm",
				"A link has been sent to your email address to reset your password. If it was not received please contact us or try with a different email address."
			),
		});
	};

	@action forgotPassword(payload: IForgotPasswordPayload) {
		this._request
			.run(() => this._userStore.forgotPassword(payload))
			.onSuccess(this.showSuccessModal)
			.onError(noop);
	}

	@action handleFormSubmit = (event: React.SyntheticEvent<IForgotPasswordForm>) => {
		event.preventDefault();
		const {email} = event.currentTarget;

		if (!email.checkValidity()) {
			return this._request._setError(new AxiosError("Please provide a valid email address"));
		}

		this.forgotPassword({email: email.value});
	};

	goToRegistration = () => this._modalsStore.showModal(ModalType.REGISTRATION);
}
