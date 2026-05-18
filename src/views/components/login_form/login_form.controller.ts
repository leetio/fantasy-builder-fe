import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import type {ILoginPayload, IUserStore} from "data/stores/user/user.store";
import React, {type ChangeEvent} from "react";
import {Bindings} from "bindings";
import {action, makeAutoObservable, observable} from "mobx";
import {ModalType} from "data/enums";
import type {AxiosError} from "axios";
import type {IApiResponse} from "data/types/http";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
import {fromErrorToMessage} from "data/utils";
import type {IModalsStore} from "data/stores/modals/modals.store";
import {useNavigate} from "react-router-dom";
import {RequestTask} from "data/utils/request_task";

interface IProps {
	navigate: ReturnType<typeof useNavigate>;
}

interface ILoginForm extends HTMLFormElement {
	email: HTMLInputElement;
	password: HTMLInputElement;
}

export interface ILoginFormController extends ViewController<IProps> {
	readonly i18n: ILocalizationStore;

	get error(): Record<string, string> | null;
	get isFormDisabled(): boolean;
	get isSaveDisabled(): boolean;

	handleFormSubmit: (event: React.SyntheticEvent<ILoginForm>) => void;
	// login: (params: ILoginPayload) => Promise<void>;
	handleFormOnChange: (event: ChangeEvent<ILoginForm>) => void;
	goToRegistration: () => void;
	goToForgotPassword: () => void;
}

@injectable()
export class LoginFormController implements ILoginFormController {
	@observable private readonly _request = new RequestTask();
	@observable private _navigate?: ReturnType<typeof useNavigate>;
	@observable private _errorMsg: string | null = null;
	@observable private _errorPlace = "";
	@observable private _email = "";
	@observable private _password = "";

	constructor(
		@inject(Bindings.UserStore) private _userStore: IUserStore,
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.ModalsStore) private readonly _modalsStore: IModalsStore
	) {
		makeAutoObservable(this);
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

	get isSaveDisabled() {
		return this._email === "" || this._password === "" || this.isFormDisabled;
	}

	@action init({navigate}: IProps) {
		this._navigate = navigate;
	}

	@action private reportError(error: string, place: string = "") {
		this._errorMsg = error;
		this._errorPlace = place;

		return true;
	}

	@action handleFormOnChange = (event: ChangeEvent<ILoginForm>) => {
		if (event.target.name === "email") {
			this._email = event.target.value as string;
		}

		if (event.target.name === "password") {
			this._password = event.target.value as string;
		}

		this._errorMsg = null;
		this._errorPlace = "";
		this._request.reset();
	};

	@action private onError = (error: AxiosError<IApiResponse>) => {
		this.reportError(fromErrorToMessage(error));
	};

	@action login(payload: ILoginPayload) {
		this._request
			.run(() => this._userStore.login(payload))
			.onSuccess(() => {
				this._modalsStore.hideModal();
				/**
				 * Workaround for the following issue
				 * https://github.com/remix-run/react-router/issues/12348
				 * https://github.com/remix-run/react-router/blob/main/CHANGELOG.md#exposed-router-promises
				 */
				void Promise.resolve(this._navigate?.("/leagues"));
			})
			.onError(this.onError);
	}

	@action handleFormSubmit = (event: React.SyntheticEvent<ILoginForm>) => {
		event.preventDefault();
		const {email, password} = event.currentTarget;

		if (!email.checkValidity()) {
			return this.reportError(
				this.i18n.t("login_form.email.error", "Please provide a valid email address"),
				"email"
			);
		}

		if (!password.checkValidity()) {
			return this.reportError(
				this.i18n.t("login_form.password.error", "Incorrect password. Please try again."),
				"password"
			);
		}

		this.login({
			email: email.value,
			password: password.value,
		});
	};

	goToRegistration = () => this._modalsStore.showModal(ModalType.REGISTRATION);

	goToForgotPassword = () => this._modalsStore.showModal(ModalType.FORGOT_PASSWORD);
}
