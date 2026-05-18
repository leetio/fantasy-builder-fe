import {action, makeAutoObservable, observable, runInAction} from "mobx";
import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import {RoundStatus} from "data/enums";
import {first, last} from "lodash-es";
import type {IRoundsJsonProvider, IRound} from "data/providers/rounds_json/rounds_json.provider";

export type {IRound} from "data/providers/rounds_json/rounds_json.provider";

export interface IRoundsStore {
	get list(): IRound[];
	get scheduleRounds(): IRound[];
	get currentRound(): IRound | undefined;
	get scoreRound(): IRound | null;

	fetchRounds(): Promise<void>;
}

@injectable()
export class RoundsStore implements IRoundsStore {
	constructor(@inject(Bindings.RoundsJsonProvider) private _jsonProvider: IRoundsJsonProvider) {
		makeAutoObservable(this);
	}

	@observable private _list: IRound[] = [];

	get list() {
		return this._list;
	}

	get scheduleRounds() {
		return this._list.filter((e) => e.status === RoundStatus.SCHEDULED);
	}

	get completedRounds() {
		return this._list.filter((e) => e.status === RoundStatus.COMPLETED);
	}

	get currentRound() {
		return this.activeRound || first(this.scheduleRounds) || last(this.list);
	}

	get scoreRound() {
		return this.activeRound || last(this.completedRounds) || null;
	}

	private get activeRound() {
		return this.list.find((e) => e.status === RoundStatus.PLAYING);
	}

	@action
	async fetchRounds() {
		const {data} = await this._jsonProvider.rounds();

		runInAction(() => {
			this._list = data;
		});
	}
}
