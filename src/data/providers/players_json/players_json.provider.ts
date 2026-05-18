import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import type {IHttpClientService} from "data/services/http";
import type {AxiosResponse} from "axios";

export interface IPlayer {
	id: number;
	first_name: string;
	last_name: string;
	squad_id: number;
}

export interface IPlayersJsonProvider {
	players(): Promise<AxiosResponse<IPlayer[]>>;
}

@injectable()
export class PlayersJsonProvider implements IPlayersJsonProvider {
	constructor(@inject(Bindings.JsonHTTPClient) private _jsonClient: IHttpClientService) {}

	players = () => this._jsonClient.get<IPlayer[]>("players.json");
}
