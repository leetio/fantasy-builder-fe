import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import type {IHttpClientService} from "data/services/http";
import type {AxiosResponse} from "axios";

export interface ISquad {
	id: number;
	name: string;
}

export interface ISquadsJsonProvider {
	squads(): Promise<AxiosResponse<ISquad[]>>;
}

@injectable()
export class SquadsJsonProvider implements ISquadsJsonProvider {
	constructor(@inject(Bindings.JsonHTTPClient) private _jsonClient: IHttpClientService) {}

	squads = () => this._jsonClient.get<ISquad[]>("squads.json");
}
