import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import type {AxiosResponse} from "axios";
import type {IHttpClientService} from "data/services/http";

export interface ICountry {
	name: string;
	code: string;
}

export interface ICountriesJsonProvider {
	countries(): Promise<AxiosResponse<ICountry[]>>;
}

@injectable()
export class CountriesJsonProvider implements ICountriesJsonProvider {
	constructor(@inject(Bindings.JsonHTTPClient) private _jsonClient: IHttpClientService) {}

	countries = () => this._jsonClient.get<ICountry[]>("countries.json");
}
