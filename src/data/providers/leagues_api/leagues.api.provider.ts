import {inject, injectable} from "inversify";
import type {IHttpClientService} from "data/services/http";
import type {IApiResponse} from "data/types/http";
import type {AxiosResponse} from "axios";
import {Bindings} from "bindings";
import {LeaguePrivacy, LeagueStatus, LeagueType} from "data/enums";
import {GAME_SLUG} from "data/constants";

export interface ILeague {
	id: number;
	name: string;
	startId: number;
	leagueManager: ILeagueManager | null;
	code: string | null;
	privacy: LeaguePrivacy;
	status: LeagueStatus;
	class: LeagueType;
	numTeams: number;
	isJoined: boolean;
	rank?: number;
	prevRank?: number;
}

export interface ICreateLeaguePayload {
	name: string;
	startId: number; // Start round (must exist and be with the SCHEDULED status)
	privacy: LeaguePrivacy;
}

export interface ILeagueIdPayload {
	leagueId: number;
}

interface IPaginationPayload {
	page?: number;
	limit?: number;
}

export type TUpdateLeaguePayload = Partial<ICreateLeaguePayload> & ILeagueIdPayload;

export interface ILeaguesForJoinPayload extends IPaginationPayload {
	search?: string;
}

export interface ILeagueInvitesPayload extends ILeagueIdPayload {
	invites: {email: string}[];
}

export interface IRemoveUserFromLeaguePayload extends ILeagueIdPayload {
	userId: number;
}

export interface ILeagueCodePayload {
	code: string;
}

export type TLeagueUsersPayload = ILeagueIdPayload & IPaginationPayload;

export interface ILeaguesPayload extends IPaginationPayload {
	privacy?: LeaguePrivacy;
	search?: string;
}

export interface ILeagueManager {
	userId: number | null;
	displayName: string;
}

export interface ILeagueUser extends ILeagueManager {
	userId: number;
}

type TLeagueResponse = IApiResponse<{league: ILeague}>;
type TLeaguesListResponse = IApiResponse<{leagues: ILeague[]; nextPage: boolean}>;
type TLeagueUserListResponse = IApiResponse<{users: ILeagueUser[]; nextPage: boolean}>;

export interface ILeaguesApiProvider {
	createLeague: (params: ICreateLeaguePayload) => Promise<AxiosResponse<TLeagueResponse>>;
	updateLeague: (params: TUpdateLeaguePayload) => Promise<AxiosResponse<TLeagueResponse>>;
	fetchLeague: (params: ILeagueIdPayload) => Promise<AxiosResponse<TLeagueResponse>>;
	fetchLeaguesForJoin: (
		params: ILeaguesForJoinPayload
	) => Promise<AxiosResponse<TLeaguesListResponse>>;
	leaveLeague: (params: ILeagueIdPayload) => Promise<AxiosResponse<void>>;
	inviteUsersToLeague: (params: ILeagueInvitesPayload) => Promise<AxiosResponse<void>>;
	removeUserFromLeague: (params: IRemoveUserFromLeaguePayload) => Promise<AxiosResponse<void>>;
	joinToLeague: (params: ILeagueCodePayload) => Promise<AxiosResponse<TLeagueResponse>>;
	fetchLeagueUsers: (
		params: TLeagueUsersPayload
	) => Promise<AxiosResponse<TLeagueUserListResponse>>;
	fetchMyLeagues: (params: ILeaguesPayload) => Promise<AxiosResponse<TLeaguesListResponse>>;
	fetchLeagueByCode: (params: ILeagueCodePayload) => Promise<AxiosResponse<TLeagueResponse>>;
}

@injectable()
export class LeaguesApiProvider implements ILeaguesApiProvider {
	constructor(@inject(Bindings.ApiHTTPClient) private _http: IHttpClientService) {}

	createLeague = (params: ICreateLeaguePayload) =>
		this._http.post<TLeagueResponse>(`${GAME_SLUG}/league`, params);

	updateLeague = ({leagueId, ...params}: TUpdateLeaguePayload) =>
		this._http.post<TLeagueResponse>(`${GAME_SLUG}/league/${leagueId}`, params);

	fetchLeague = ({leagueId}: ILeagueIdPayload) =>
		this._http.get<TLeagueResponse>(`${GAME_SLUG}/league/${leagueId}`);

	fetchLeaguesForJoin = (params: ILeaguesForJoinPayload) =>
		this._http.get<TLeaguesListResponse>(`${GAME_SLUG}/league/show-for-join`, params);

	leaveLeague = ({leagueId}: ILeagueIdPayload) =>
		this._http.post<void>(`${GAME_SLUG}/league/${leagueId}/leave`);

	inviteUsersToLeague = ({leagueId, ...params}: ILeagueInvitesPayload) =>
		this._http.post<void>(`${GAME_SLUG}/league/${leagueId}/invite`, params);

	removeUserFromLeague = ({leagueId, userId}: IRemoveUserFromLeaguePayload) =>
		this._http.post<void>(`${GAME_SLUG}/league/${leagueId}/user/${userId}`);

	joinToLeague = ({code}: ILeagueCodePayload) =>
		this._http.post<TLeagueResponse>(`${GAME_SLUG}/league/${code}/join`);

	fetchLeagueUsers = ({leagueId, ...params}: TLeagueUsersPayload) =>
		this._http.get<TLeagueUserListResponse>(
			`${GAME_SLUG}/league/${leagueId}/league-users`,
			params
		);

	fetchMyLeagues = (params: ILeaguesPayload) =>
		this._http.get<TLeaguesListResponse>(`${GAME_SLUG}/leagues`, params);

	fetchLeagueByCode = ({code}: ILeagueCodePayload) =>
		this._http.get<TLeagueResponse>(`${GAME_SLUG}/league/show-by-code/${code}`);
}
