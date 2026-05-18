import {inject, injectable} from "inversify";
import type {IHttpClientService} from "data/services/http";
import type {AxiosResponse} from "axios";
import {Bindings} from "bindings";

export interface IForgotPasswordPayload {
	email: string;
}

export interface IResetPasswordPayload {
	token: string;
	password: string;
}

export interface IPasswordApiProvider {
	forgotPassword: (params: IForgotPasswordPayload) => Promise<AxiosResponse>;
	resetPassword: (params: IResetPasswordPayload) => Promise<AxiosResponse>;
}

@injectable()
export class PasswordApiProvider implements IPasswordApiProvider {
	constructor(@inject(Bindings.ApiHTTPClient) private _http: IHttpClientService) {}

	forgotPassword = (params: IForgotPasswordPayload) =>
		this._http.post<void>("password-reset/request", params);
	resetPassword = (params: IResetPasswordPayload) =>
		this._http.post<void>("password-reset", params);
}
