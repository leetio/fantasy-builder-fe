import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import type {IUserStore} from "data/stores/user/user.store";
import {action, makeAutoObservable, observable} from "mobx";
import {Bindings} from "bindings";
import {ModalType} from "data/enums";
import type {ChangeEvent, SyntheticEvent} from "react";
import type {AxiosError} from "axios";
import type {IApiResponse} from "data/types/http";
import {fromErrorToMessage} from "data/utils";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
import {PASSWORD_REQUIREMENTS} from "data/constants";
import {useNavigate} from "react-router-dom";
import type {IModalsStore} from "data/stores/modals/modals.store";
import {RequestTask} from "data/utils/request_task";

interface IProps {
	navigate: ReturnType<typeof useNavigate>;
}

interface IRegistrationFormElement extends HTMLFormElement {
	displayName: HTMLInputElement;
	email: HTMLInputElement;
	confirmEmail: HTMLInputElement;
	password: HTMLInputElement;
	confirmPassword: HTMLInputElement;
	terms: HTMLInputElement;
}

export interface IRegistrationFormController extends ViewController<IProps> {
	readonly i18n: ILocalizationStore;

	get isFormDisabled(): boolean;
	get error(): Record<string, string> | null;
	get displayName(): string;

	handleFormSubmit: (event: SyntheticEvent<IRegistrationFormElement>) => void;
	handleFormOnChange: (event: ChangeEvent<IRegistrationFormElement>) => void;
	handleInputDisplayNameValue: (event: ChangeEvent<HTMLInputElement>) => void;
	handleValidatePassword: (event: ChangeEvent<HTMLInputElement>) => void;
	goToLogin: () => void;
}

@injectable()
export class RegistrationFormController implements IRegistrationFormController {
	@observable private _request = new RequestTask();
	@observable private _errorMsg: string | null = null;
	@observable private _errorPlace = "";
	@observable private _displayName = "";

	get error() {
		if (!this._errorMsg) return null;

		return {
			[this._errorPlace || "common"]: this._errorMsg,
		};
	}

	get displayName(): string {
		return this._displayName;
	}

	get isFormDisabled(): boolean {
		return this._request.isLoading;
	}

	constructor(
		@inject(Bindings.UserStore) private _userStore: IUserStore,
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.ModalsStore) private readonly _modalsStore: IModalsStore
	) {
		makeAutoObservable(this);
	}

	@action private reportError(error: string, place: string = "") {
		this._errorMsg = error;
		this._errorPlace = place;

		return true;
	}

	@action public handleFormSubmit = (event: SyntheticEvent<IRegistrationFormElement>) => {
		event.preventDefault();

		const {displayName, email, confirmEmail, password, confirmPassword, terms} =
			event.currentTarget;

		const errorInvalidUsername = this.i18n.t(
			"registration.display_name.error",
			"Please provide your display name"
		);
		const errorInvalidEmail = this.i18n.t(
			"registration.email.error",
			"Please provide a valid email address"
		);
		const errorInvalidPassword = this.i18n.t(
			"registration.password.error",
			PASSWORD_REQUIREMENTS
		);
		const errorEmailsMismatch = this.i18n.t(
			"registration.email.mismatch_error",
			"Emails do not match"
		);
		const errorPasswordsMismatch = this.i18n.t(
			"registration.password.mismatch_error",
			"Passwords do not match"
		);
		const errorInvalidTerms = this.i18n.t(
			"registration.terms.error",
			"Please accept Terms & Conditions"
		);

		const validateList = [
			{field: displayName, error: errorInvalidUsername, place: "displayName"},
			{field: email, error: errorInvalidEmail, place: "email"},
			{
				field: confirmEmail,
				error: errorEmailsMismatch,
				place: "confirmEmail",
				checkValidity: () => email.value === confirmEmail.value,
			},
			{field: password, error: errorInvalidPassword, place: "password"},
			{
				field: confirmPassword,
				error: errorPasswordsMismatch,
				place: "confirmPassword",
				checkValidity: () => password.value === confirmPassword.value,
			},
			{field: terms, error: errorInvalidTerms, place: "terms"},
		];

		const hasError = validateList.find(({field, error, place, checkValidity}) => {
			if (!field) return false;

			const isValid = checkValidity ? checkValidity() : field.checkValidity();
			return isValid ? false : this.reportError(error, place);
		});

		if (hasError) {
			return;
		}

		const payload = {
			displayName: displayName.value,
			email: email.value,
			password: password.value,
		};

		this._request
			.run(() => this._userStore.register(payload))
			.onSuccess(this._modalsStore.hideModal)
			.onError(this.showError);
	};

	@action private showError = (error: AxiosError<IApiResponse>) => {
		this._errorMsg = fromErrorToMessage(error);
	};

	@action handleFormOnChange = (event: ChangeEvent<IRegistrationFormElement>) => {
		if (event.target.name !== "password") {
			this._errorMsg = null;
			this._errorPlace = "";
		}
	};

	@action handleInputDisplayNameValue = (event: ChangeEvent<HTMLInputElement>) => {
		this._displayName = event.target.value.replace("@", "");
	};

	@action handleValidatePassword = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.checkValidity()) {
			this._errorMsg = null;
		} else {
			const errorInvalidPassword = this.i18n.t(
				"registration.password.error",
				PASSWORD_REQUIREMENTS
			);

			this.reportError(errorInvalidPassword, "password");
		}
	};

	goToLogin = () => this._modalsStore.showModal(ModalType.LOGIN);
}
