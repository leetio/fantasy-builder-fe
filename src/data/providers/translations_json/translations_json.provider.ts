import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import type {AxiosResponse} from "axios";
import type {IHttpClientService} from "data/services/http";

export interface ITranslationsJsonProvider {
	translations(locale: string): Promise<AxiosResponse<Record<string, unknown>>>;
}

@injectable()
export class TranslationsJsonProvider implements ITranslationsJsonProvider {
	constructor(@inject(Bindings.JsonHTTPClient) private _jsonClient: IHttpClientService) {}

	translations = (locale: string) =>
		this._jsonClient.get<Record<string, unknown>>(`locale/${locale}.json`);
}
