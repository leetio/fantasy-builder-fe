import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import type {AxiosResponse} from "axios";
import type {IHttpClientService} from "data/services/http";

export type TChecksums = Record<string, string>;

export interface IChecksumsJsonProvider {
	checksums(): Promise<AxiosResponse<TChecksums>>;
}

@injectable()
export class ChecksumsJsonProvider implements IChecksumsJsonProvider {
	constructor(@inject(Bindings.JsonHTTPClient) private _jsonClient: IHttpClientService) {}

	checksums = () => this._jsonClient.get<TChecksums>("checksums.json");
}
