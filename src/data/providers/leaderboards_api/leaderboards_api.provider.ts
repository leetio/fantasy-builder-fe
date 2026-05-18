import {injectable, inject} from "inversify";
import type {AxiosResponse} from "axios";
import {Bindings} from "bindings";
import type {IHttpClientService} from "data/services/http";
import type {IPaginationParams} from "data/types/common";
import type {IApiResponse} from "data/types/http";

export interface ILeaderboardItem {
	userId: number;
	userName: string;
	rank: number;
	points: number | null;
	teamName: string;
	teamId: number;
	gameWeek?: number;
	overallPoints: number | null;
}

export interface ILeaderboards {
	rankings: ILeaderboardItem[];
	user: ILeaderboardItem | null;
	nextPage: boolean;
}

interface IWeekParams extends IPaginationParams {
	gameWeek: number;
}

interface ILeagueRankingParams {
	leagueId: number;
}

export interface ILeaderboardsApiProvider {
	overall: (params: IPaginationParams) => Promise<AxiosResponse<IApiResponse<ILeaderboards>>>;
	week: (params: IWeekParams) => Promise<AxiosResponse<IApiResponse<ILeaderboards>>>;
	league: (params: ILeagueRankingParams) => Promise<AxiosResponse<IApiResponse<ILeaderboards>>>;
}

@injectable()
export class LeaderboardsApiProvider implements ILeaderboardsApiProvider {
	constructor(@inject(Bindings.ApiHTTPClient) private _http: IHttpClientService) {}
	overall = (params: IPaginationParams) =>
		this._http.get<IApiResponse<ILeaderboards>>("daily/ranking", params);
	week = (params: IWeekParams) =>
		this._http.get<IApiResponse<ILeaderboards>>("daily/ranking/week", params);
	league = (params: ILeagueRankingParams) =>
		this._http.get<IApiResponse<ILeaderboards>>(
			`daily/ranking/league/${params.leagueId}`,
			params
		);
}
