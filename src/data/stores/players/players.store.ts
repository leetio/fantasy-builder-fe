import {action, makeAutoObservable, observable, runInAction} from "mobx";
import {inject, injectable} from "inversify";
import type {
	IPlayer,
	IPlayersJsonProvider,
} from "data/providers/players_json/players_json.provider";
import {Bindings} from "bindings";

export type {IPlayer} from "data/providers/players_json/players_json.provider";

export interface IPlayersStore {
	get list(): IPlayer[];

	getPlayerById(playerId: number): IPlayer | undefined;
	fetchPlayers(): Promise<void>;
}

@injectable()
export class PlayersStore implements IPlayersStore {
	constructor(@inject(Bindings.PlayersJsonProvider) private _jsonProvider: IPlayersJsonProvider) {
		makeAutoObservable(this);
	}

	@observable private _list: IPlayer[] = [];

	get list() {
		return this._list;
	}

	getPlayerById(playerId: number): IPlayer | undefined {
		return this._list.find((player) => player.id === playerId);
	}

	@action
	async fetchPlayers() {
		const {data} = await this._jsonProvider.players();

		runInAction(() => {
			this._list = data;
		});
	}
}
