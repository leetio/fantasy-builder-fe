import {inject, injectable} from "inversify";
import type {IHttpClientService} from "data/services/http";
import type {IApiResponse} from "data/types/http";
import type {IUser} from "data/types/user";
import type {AxiosResponse} from "axios";
import {Bindings} from "bindings";

export interface ILoginPayload {
	email: string;
	password: string;
}

type TLoginResponse = IApiResponse<{user: IUser}>;

export interface IAuthApiProvider {
	login: (params: ILoginPayload) => Promise<AxiosResponse<TLoginResponse>>;
	logout: () => Promise<AxiosResponse>;
}

@injectable()
export class AuthApiProvider implements IAuthApiProvider {
	constructor(@inject(Bindings.ApiHTTPClient) private _http: IHttpClientService) {}

	login = (params: ILoginPayload) => this._http.post<TLoginResponse>("auth/login", params);

	logout = () => this._http.post("auth/logout");
}
