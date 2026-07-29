import {action, makeAutoObservable, observable, runInAction} from "mobx";
import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import type {
	ISuperRugbyTeam,
	ISuperRugbyTeamApiProvider,
	IUpdateTeamPayload,
	IAutopickPayload,
	IChangeCaptainPayload,
	ISwapPlayersPayload,
	IBoosterPayload,
} from "data/providers/sport/super-rugby/team_api.provider";

export type {ISuperRugbyTeam} from "data/providers/sport/super-rugby/team_api.provider";

export interface ISuperRugbyTeamStore {
	get myTeam(): ISuperRugbyTeam | null;

	updateTeam(params: IUpdateTeamPayload): Promise<void>;
	autopick(params?: IAutopickPayload): Promise<void>;
	fetchMyTeam(): Promise<void>;
	fetchTeamByUser(userId: number): Promise<ISuperRugbyTeam>;
	changeCaptain(params: IChangeCaptainPayload): Promise<void>;
	swapPlayers(params: ISwapPlayersPayload): Promise<void>;
	applyBooster(params: IBoosterPayload): Promise<void>;
	removeBooster(boosterId: number): Promise<void>;
	clearMyTeam(): void;
}

@injectable()
export class SuperRugbyTeamStore implements ISuperRugbyTeamStore {
	@observable private _myTeam: ISuperRugbyTeam | null = null;

	get myTeam() {
		return this._myTeam;
	}

	constructor(
		@inject(Bindings.SuperRugbyTeamApiProvider)
		private _teamApiProvider: ISuperRugbyTeamApiProvider
	) {
		makeAutoObservable(this);
	}

	@action async updateTeam(params: IUpdateTeamPayload): Promise<void> {
		const result = await this._teamApiProvider.updateTeam(params);
		const {team} = result.data.success;

		runInAction(() => {
			this._myTeam = team;
		});
	}

	@action async autopick(params?: IAutopickPayload): Promise<void> {
		const result = await this._teamApiProvider.autopick(params);
		const {team} = result.data.success;

		runInAction(() => {
			this._myTeam = team;
		});
	}

	@action async fetchMyTeam(): Promise<void> {
		const result = await this._teamApiProvider.getMyTeam();
		const {team} = result.data.success;

		runInAction(() => {
			this._myTeam = team;
		});
	}

	@action async fetchTeamByUser(userId: number): Promise<ISuperRugbyTeam> {
		const result = await this._teamApiProvider.getTeamByUser(userId);
		return result.data.success.team;
	}

	@action async changeCaptain(params: IChangeCaptainPayload): Promise<void> {
		const result = await this._teamApiProvider.changeCaptain(params);
		const {team} = result.data.success;

		runInAction(() => {
			this._myTeam = team;
		});
	}

	@action async swapPlayers(params: ISwapPlayersPayload): Promise<void> {
		const result = await this._teamApiProvider.swapPlayers(params);
		const {team} = result.data.success;

		runInAction(() => {
			this._myTeam = team;
		});
	}

	@action async applyBooster(params: IBoosterPayload): Promise<void> {
		const result = await this._teamApiProvider.applyBooster(params);
		const {team} = result.data.success;

		runInAction(() => {
			this._myTeam = team;
		});
	}

	@action async removeBooster(boosterId: number): Promise<void> {
		const result = await this._teamApiProvider.removeBooster(boosterId);
		const {team} = result.data.success;

		runInAction(() => {
			this._myTeam = team;
		});
	}

	@action clearMyTeam = (): void => {
		this._myTeam = null;
	};
}
