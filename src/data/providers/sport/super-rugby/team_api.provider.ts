import {inject, injectable} from "inversify";
import type {IHttpClientService} from "data/services/http";
import type {IApiResponse} from "data/types/http";
import type {AxiosResponse} from "axios";
import {Bindings} from "bindings";
import {GAME_SLUG} from "data/constants";
import type {ILineup, TBench} from "data/types/sport/super-rugby";

/** Team data structure */
export interface ISuperRugbyTeam {
	id: number;
	userId: number;
	leagueId?: number;
	name: string;
	budget: number;
	totalPoints: number;
	roundPoints: number;
	rank?: number;
	lineup: ILineup;
	bench: TBench;
	captainId?: number;
	viceCaptainId?: number;
	formation: string;
}

/** Update team payload */
export interface IUpdateTeamPayload {
	lineup: ILineup;
	bench: TBench;
	formation: string;
	captainId?: number;
	viceCaptainId?: number;
}

/** Autopick payload */
export interface IAutopickPayload {
	budget?: number;
}

/** Change captain payload */
export interface IChangeCaptainPayload {
	playerId: number;
	isViceCaptain?: boolean;
}

/** Swap players payload */
export interface ISwapPlayersPayload {
	player1Id: number;
	player2Id: number;
}

/** Booster payload */
export interface IBoosterPayload {
	boosterType: string;
	playerId?: number;
}

type TTeamResponse = IApiResponse<{team: ISuperRugbyTeam}>;

export interface ISuperRugbyTeamApiProvider {
	updateTeam: (params: IUpdateTeamPayload) => Promise<AxiosResponse<TTeamResponse>>;
	autopick: (params?: IAutopickPayload) => Promise<AxiosResponse<TTeamResponse>>;
	getMyTeam: () => Promise<AxiosResponse<TTeamResponse>>;
	getTeamByUser: (userId: number) => Promise<AxiosResponse<TTeamResponse>>;
	changeCaptain: (params: IChangeCaptainPayload) => Promise<AxiosResponse<TTeamResponse>>;
	swapPlayers: (params: ISwapPlayersPayload) => Promise<AxiosResponse<TTeamResponse>>;
	applyBooster: (params: IBoosterPayload) => Promise<AxiosResponse<TTeamResponse>>;
	removeBooster: (boosterId: number) => Promise<AxiosResponse<TTeamResponse>>;
}

@injectable()
export class SuperRugbyTeamApiProvider implements ISuperRugbyTeamApiProvider {
	constructor(@inject(Bindings.ApiHTTPClient) private _http: IHttpClientService) {}

	updateTeam = (params: IUpdateTeamPayload) =>
		this._http.post<TTeamResponse>(`${GAME_SLUG}/team/update`, params);

	autopick = (params?: IAutopickPayload) =>
		this._http.post<TTeamResponse>(`${GAME_SLUG}/team/autopick`, params || {});

	getMyTeam = () => this._http.get<TTeamResponse>(`${GAME_SLUG}/team/show-my`);

	getTeamByUser = (userId: number) =>
		this._http.get<TTeamResponse>(`${GAME_SLUG}/team/get-by-user/${userId}`);

	changeCaptain = (params: IChangeCaptainPayload) =>
		this._http.post<TTeamResponse>(
			`${GAME_SLUG}/team/${params.isViceCaptain ? "change-vice-captain" : "change-captain"}`,
			{playerId: params.playerId}
		);

	swapPlayers = (params: ISwapPlayersPayload) =>
		this._http.post<TTeamResponse>(`${GAME_SLUG}/team/swap-players`, params);

	applyBooster = (params: IBoosterPayload) =>
		this._http.post<TTeamResponse>(`${GAME_SLUG}/team/booster`, params);

	removeBooster = (boosterId: number) =>
		this._http.post<TTeamResponse>(`${GAME_SLUG}/team/booster/${boosterId}`);
}
