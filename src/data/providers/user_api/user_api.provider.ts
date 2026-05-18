import {inject, injectable} from "inversify";
import type {IHttpClientService} from "data/services/http";
import type {IApiResponse} from "data/types/http";
import type {IUser} from "data/types/user";
import type {AxiosResponse} from "axios";
import {Bindings} from "bindings";

export interface IRegistrationPayload {
	displayName: string;
	email: string;
	password: string;
}

export interface IUpdateUserPayload {
	displayName?: string;
	email?: string;
	isNotificationsEnabled?: boolean;
}

export interface IUsername {
	username: string;
}

export type TUserResponse = IApiResponse<{user: IUser}>;

export interface IUserApiProvider {
	register: (params: IRegistrationPayload) => Promise<AxiosResponse<TUserResponse>>;
	update: (params: IUpdateUserPayload) => Promise<AxiosResponse<TUserResponse>>;
	user: () => Promise<AxiosResponse<TUserResponse>>;
	checkUsername: (params: IUsername) => Promise<AxiosResponse>;
	deactivateAccount: () => Promise<AxiosResponse>;
}

@injectable()
export class UserApiProvider implements IUserApiProvider {
	constructor(@inject(Bindings.ApiHTTPClient) private _http: IHttpClientService) {}

	checkUsername = (params: IUsername) => this._http.post<void>("user/check-username", params);

	deactivateAccount = () => this._http.post<void>("user/deactivate-account");

	register = (params: IRegistrationPayload) =>
		this._http.post<TUserResponse>("user/register", params);

	update = (params: IUpdateUserPayload) => this._http.post<TUserResponse>("user/update", params);

	user = () => this._http.get<TUserResponse>("user");
}
