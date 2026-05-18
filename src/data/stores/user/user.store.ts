import {action, makeAutoObservable, observable, runInAction} from "mobx";
import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import type {IAuthApiProvider, ILoginPayload} from "data/providers/auth_api/auth_api.provider";
import type {
	IRegistrationPayload,
	IUpdateUserPayload,
	IUserApiProvider,
} from "data/providers/user_api/user_api.provider";
import type {
	IForgotPasswordPayload,
	IPasswordApiProvider,
	IResetPasswordPayload,
} from "data/providers/password_api/password_api.provider";
import type {AxiosResponse} from "axios";
import type {IUser} from "data/types/user";

export type {IUser} from "data/types/user";
export type {
	IResetPasswordPayload,
	IForgotPasswordPayload,
} from "data/providers/password_api/password_api.provider";
export type {ILoginPayload} from "data/providers/auth_api/auth_api.provider";

export interface IUserStore {
	get user(): IUser | undefined;
	get isAuthorized(): boolean;
	get wasLoggedOut(): boolean;

	forgotPassword(payload: IForgotPasswordPayload): Promise<AxiosResponse<void>>;
	resetPassword(payload: IResetPasswordPayload): Promise<AxiosResponse<void>>;
	register(payload: IRegistrationPayload): Promise<void>;
	update(payload: IUpdateUserPayload): Promise<void>;
	deactivate(): Promise<void>;
	login(payload: ILoginPayload): Promise<void>;
	logout(): Promise<void>;
	requestUser(): Promise<void>;
	flushUser: () => void;
}

@injectable()
export class UserStore implements IUserStore {
	@observable private _user?: IUser = undefined;
	@observable private _wasLoggedOut = false;

	constructor(
		@inject(Bindings.AuthApiProvider) private _authApi: IAuthApiProvider,
		@inject(Bindings.UserApiProvider) private _userApi: IUserApiProvider,
		@inject(Bindings.PasswordApiProvider) private _passwordApi: IPasswordApiProvider
	) {
		makeAutoObservable(this);
		window.addEventListener("DEAUTHORIZE", this.flushUser);
	}

	get isAuthorized() {
		return Boolean(this.user);
	}

	get wasLoggedOut() {
		return this._wasLoggedOut;
	}

	get user() {
		return this._user;
	}

	@action
	async requestUser() {
		const response = await this._userApi.user();
		const {user} = response.data.success;

		runInAction(() => {
			this._user = user;
		});
	}

	@action
	async login(payload: ILoginPayload) {
		const response = await this._authApi.login(payload);
		const {user} = response.data.success;

		runInAction(() => {
			this._user = user;
			this._wasLoggedOut = false;
		});
	}

	@action
	async register(payload: IRegistrationPayload) {
		const response = await this._userApi.register(payload);
		const {user} = response.data.success;

		runInAction(() => {
			this._user = user;
			this._wasLoggedOut = false;
		});
	}

	@action
	async update(payload: IUpdateUserPayload) {
		const response = await this._userApi.update(payload);
		const {user} = response.data.success;

		runInAction(() => {
			this._user = user;
		});
	}

	@action
	async logout() {
		await this._authApi.logout();

		runInAction(() => {
			this._user = undefined;
			this._wasLoggedOut = true;
		});
	}

	@action
	async deactivate() {
		await this._userApi.deactivateAccount();

		runInAction(() => {
			this._user = undefined;
			this._wasLoggedOut = true;
		});
	}

	@action flushUser = () => {
		this._user = undefined;
		this._wasLoggedOut = true;
	};

	forgotPassword(payload: IForgotPasswordPayload) {
		return this._passwordApi.forgotPassword(payload);
	}

	resetPassword(payload: IResetPasswordPayload) {
		return this._passwordApi.resetPassword(payload);
	}
}
