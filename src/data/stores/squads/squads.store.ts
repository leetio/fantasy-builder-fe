import {action, makeAutoObservable, observable, runInAction} from "mobx";
import {inject, injectable} from "inversify";
import type {ISquad, ISquadsJsonProvider} from "data/providers/squads_json/squads_json.provider";
import {Bindings} from "bindings";

export type {ISquad} from "data/providers/squads_json/squads_json.provider";

export interface ISquadsStore {
	get list(): ISquad[];

	getSquadById(squadId: number): ISquad | undefined;
	fetchSquads(): Promise<void>;
}

@injectable()
export class SquadsStore implements ISquadsStore {
	constructor(@inject(Bindings.SquadsJsonProvider) private _jsonProvider: ISquadsJsonProvider) {
		makeAutoObservable(this);
	}

	@observable private _list: ISquad[] = [];

	get list() {
		return this._list;
	}

	getSquadById(squadId: number): ISquad | undefined {
		return this._list.find((squad) => squad.id === squadId);
	}

	@action
	async fetchSquads() {
		const {data} = await this._jsonProvider.squads();

		runInAction(() => {
			this._list = data;
		});
	}
}
