import {makeAutoObservable, observable, runInAction} from "mobx";
import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import type {
	ILeaderboards,
	ILeaderboardsApiProvider,
} from "data/providers/leaderboards_api/leaderboards_api.provider";
import type {IPaginationParams} from "data/types/common";

export type {
	ILeaderboards,
	ILeaderboardItem,
} from "data/providers/leaderboards_api/leaderboards_api.provider";

export interface ILeagueLeaderboardParams extends IPaginationParams {
	leagueId: number;
	order?: string | null;
	dir?: string | null;
	gameWeek?: number;
}

export interface ILeaderboardsStore {
	get leaderboard(): ILeaderboards;
	fetchLeaderboard: (params: IPaginationParams) => Promise<void>;
	fetchLeaderboardMore: (params: IPaginationParams) => Promise<void>;
	fetchWeekLeaderboard: (weekId: number, params: IPaginationParams) => Promise<void>;
	fetchWeekLeaderboardMore: (weekId: number, params: IPaginationParams) => Promise<void>;
	fetchLeagueLeaderboard: (params: ILeagueLeaderboardParams) => Promise<void>;
}

@injectable()
export class LeaderboardsStore implements ILeaderboardsStore {
	@observable _leaderboard: ILeaderboards = {
		rankings: [],
		user: null,
		nextPage: false,
	};

	constructor(
		@inject(Bindings.LeaderboardsApiProvider)
		private _leaderboardsProvider: ILeaderboardsApiProvider
	) {
		makeAutoObservable(this);
	}

	get leaderboard(): ILeaderboards {
		return this._leaderboard;
	}

	fetchLeaderboard = async (params: IPaginationParams) => {
		const result = await this._leaderboardsProvider.overall(params);
		runInAction(() => {
			this._leaderboard = result.data.success;
		});
	};

	fetchLeaderboardMore = async (params: IPaginationParams) => {
		const result = await this._leaderboardsProvider.overall(params);
		runInAction(() => {
			this._leaderboard = {
				...result.data.success,
				rankings: [...this._leaderboard.rankings, ...result.data.success.rankings],
			};
		});
	};

	fetchWeekLeaderboard = async (weekId: number, params: IPaginationParams) => {
		const result = await this._leaderboardsProvider.week({
			gameWeek: weekId,
			...params,
		});
		runInAction(() => {
			this._leaderboard = result.data.success;
		});
	};

	fetchLeagueLeaderboard = async (params: ILeagueLeaderboardParams) => {
		const result = await this._leaderboardsProvider.league(params);
		runInAction(() => {
			this._leaderboard = result.data.success;
		});
	};

	fetchWeekLeaderboardMore = async (weekId: number, params: IPaginationParams) => {
		const result = await this._leaderboardsProvider.week({
			gameWeek: weekId,
			...params,
		});
		runInAction(() => {
			this._leaderboard = {
				...result.data.success,
				rankings: [...this._leaderboard.rankings, ...result.data.success.rankings],
			};
		});
	};
}
