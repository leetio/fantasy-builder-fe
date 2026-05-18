import {action, makeAutoObservable, observable, runInAction} from "mobx";
import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import type {
	ICreateLeaguePayload,
	ILeague,
	ILeagueCodePayload,
	ILeagueIdPayload,
	ILeagueInvitesPayload,
	ILeaguesApiProvider,
	ILeaguesForJoinPayload,
	ILeaguesPayload,
	ILeagueUser,
	IRemoveUserFromLeaguePayload,
	TLeagueUsersPayload,
	TUpdateLeaguePayload,
} from "data/providers/leagues_api/leagues.api.provider";
import {findIndex, isEqual, negate, uniqBy} from "lodash-es";

export type {ILeague, TUpdateLeaguePayload} from "data/providers/leagues_api/leagues.api.provider";

export interface ILeagues {
	leagues: ILeague[];
	nextPage: boolean;
	page: number;
}

export interface ILeagueUsers {
	users: ILeagueUser[];
	nextPage: boolean;
	page: number;
}

type TUsersListByLeagueId = Record<number, ILeagueUsers>;

const INITIAL_LEAGUES_FOR_JOIN = {
	leagues: [],
	nextPage: false,
	page: 0,
};

export interface ILeaguesStore {
	get myLeagues(): ILeagues;
	get leaguesForJoin(): ILeagues;

	createLeague(params: ICreateLeaguePayload): Promise<ILeague>;
	updateLeague(params: TUpdateLeaguePayload): Promise<void>;
	fetchLeague(params: ILeagueIdPayload): Promise<void>;
	fetchLeaguesForJoin(params?: ILeaguesForJoinPayload): Promise<void>;
	fetchMoreLeaguesForJoin(params?: ILeaguesForJoinPayload): Promise<void>;
	leaveLeague(params: ILeagueIdPayload): Promise<void>;
	inviteUsersToLeague(params: ILeagueInvitesPayload): Promise<void>;
	removeUserFromLeague(params: IRemoveUserFromLeaguePayload): Promise<void>;
	joinToLeague(params: ILeagueCodePayload): Promise<void>;
	fetchLeagueUsers(params: TLeagueUsersPayload): Promise<void>;
	fetchMoreLeagueUsers(params: TLeagueUsersPayload): Promise<void>;
	fetchMyLeagues(params?: ILeaguesPayload): Promise<void>;
	fetchMoreMyLeagues(params?: ILeaguesPayload): Promise<void>;
	fetchLeagueByCode(params: ILeagueCodePayload): Promise<void>;
	getLeagueById(id: number): ILeague | null;
	getLeagueUsersByLeagueId(id: number): ILeagueUsers | null;
	clearLeaguesForJoin: () => void;
}

@injectable()
export class LeaguesStore implements ILeaguesStore {
	@observable private _myLeagues: ILeagues = {
		leagues: [],
		nextPage: false,
		page: 0,
	};

	@observable private _leaguesForJoin: ILeagues = INITIAL_LEAGUES_FOR_JOIN;

	@observable private _leagueUsersByLeagueId: TUsersListByLeagueId = {};

	get myLeagues() {
		return this._myLeagues;
	}

	get leaguesForJoin() {
		return this._leaguesForJoin;
	}

	constructor(
		@inject(Bindings.LeaguesApiProvider) private _leaguesApiProvider: ILeaguesApiProvider
	) {
		makeAutoObservable(this);
	}

	getLeagueById(id: number) {
		return this._myLeagues.leagues.find((league) => isEqual(league.id, id)) || null;
	}

	getLeagueUsersByLeagueId(id: number) {
		return this._leagueUsersByLeagueId[id] ?? null;
	}

	@action async createLeague(params: ICreateLeaguePayload): Promise<ILeague> {
		const result = await this._leaguesApiProvider.createLeague(params);
		const league = result.data.success.league;

		runInAction(() => {
			this._myLeagues.leagues.push(league);
		});

		return league;
	}

	@action async fetchLeague(params: ILeagueIdPayload): Promise<void> {
		const result = await this._leaguesApiProvider.fetchLeague(params);
		const {league} = result.data.success;

		runInAction(() => {
			const index = findIndex(this._myLeagues.leagues, {id: league.id});

			if (index !== -1) {
				this._myLeagues.leagues[index] = league;
			} else {
				this._myLeagues.leagues.push(league);
			}
		});
	}

	@action async fetchLeagueByCode(params: ILeagueCodePayload): Promise<void> {
		await this._leaguesApiProvider.fetchLeagueByCode(params);
	}

	@action async fetchLeagueUsers(params: TLeagueUsersPayload): Promise<void> {
		const response = await this._leaguesApiProvider.fetchLeagueUsers(params);

		runInAction(() => {
			this._leagueUsersByLeagueId[params.leagueId] = {
				...response.data.success,
				page: 1,
			};
		});
	}

	@action async fetchMoreLeagueUsers(params: TLeagueUsersPayload): Promise<void> {
		const leagueUsers = this._leagueUsersByLeagueId[params.leagueId];
		const page = params.page || (leagueUsers.page ?? 0) + 1;

		const {
			data: {success},
		} = await this._leaguesApiProvider.fetchLeagueUsers({
			...params,
			page,
		});

		runInAction(() => {
			leagueUsers.users = uniqBy([...leagueUsers.users, ...success.users], "userId");
			leagueUsers.nextPage = success.nextPage;
			leagueUsers.page = page;
		});
	}

	@action async fetchLeaguesForJoin(params: ILeaguesForJoinPayload = {}): Promise<void> {
		const response = await this._leaguesApiProvider.fetchLeaguesForJoin(params);

		runInAction(() => {
			this._leaguesForJoin = {
				...response.data.success,
				page: 1,
			};
		});
	}

	@action async fetchMoreLeaguesForJoin(params: ILeaguesForJoinPayload = {}): Promise<void> {
		const page = params.page || this._leaguesForJoin.page + 1;

		const {
			data: {success},
		} = await this._leaguesApiProvider.fetchLeaguesForJoin({
			...params,
			page,
		});

		runInAction(() => {
			this._leaguesForJoin = {
				leagues: uniqBy([...this._leaguesForJoin.leagues, ...success.leagues], "id"),
				nextPage: success.nextPage,
				page,
			};
		});
	}

	@action async fetchMyLeagues(params: ILeaguesPayload = {}): Promise<void> {
		const response = await this._leaguesApiProvider.fetchMyLeagues(params);

		runInAction(() => {
			this._myLeagues = {
				...response.data.success,
				page: 1,
			};
		});
	}

	@action async fetchMoreMyLeagues(params: ILeaguesPayload = {}): Promise<void> {
		const page = params.page || this._myLeagues.page + 1;

		const {
			data: {success},
		} = await this._leaguesApiProvider.fetchMyLeagues({
			...params,
			page,
		});

		runInAction(() => {
			this._myLeagues = {
				leagues: uniqBy([...this._myLeagues.leagues, ...success.leagues], "id"),
				nextPage: success.nextPage,
				page,
			};
		});
	}

	@action async inviteUsersToLeague(params: ILeagueInvitesPayload): Promise<void> {
		await this._leaguesApiProvider.inviteUsersToLeague(params);
	}

	private equalToLeagueID = (leagueId: number) => (league: ILeague) =>
		isEqual(leagueId, league.id);

	private notEqualToLeagueID = (leagueId: number) => negate(this.equalToLeagueID(leagueId));

	@action async joinToLeague(params: ILeagueCodePayload): Promise<void> {
		const result = await this._leaguesApiProvider.joinToLeague(params);

		runInAction(() => {
			const {league} = result.data.success;
			const rule = this.notEqualToLeagueID(league.id);

			this._leaguesForJoin.leagues = this._leaguesForJoin.leagues.filter(rule);
			this._myLeagues.leagues = this._myLeagues.leagues.filter(rule);
			this._myLeagues.leagues.push(league);
		});
	}

	@action async leaveLeague(params: ILeagueIdPayload): Promise<void> {
		await this._leaguesApiProvider.leaveLeague(params);

		runInAction(() => {
			const rule = this.equalToLeagueID(params.leagueId);
			const league = this._myLeagues.leagues.find(rule);

			if (league) {
				league.isJoined = false;
			}
		});
	}

	@action async removeUserFromLeague(params: IRemoveUserFromLeaguePayload): Promise<void> {
		await this._leaguesApiProvider.removeUserFromLeague(params);

		runInAction(() => {
			const leagueUsers = this._leagueUsersByLeagueId[params.leagueId];

			if (leagueUsers) {
				leagueUsers.users = leagueUsers.users.filter(
					(user) => !isEqual(user.userId, params.userId)
				);
			}
		});
	}

	@action async updateLeague(params: TUpdateLeaguePayload): Promise<void> {
		const result = await this._leaguesApiProvider.updateLeague(params);

		runInAction(() => {
			const {league} = result.data.success;
			const index = findIndex(this._myLeagues.leagues, {id: league.id});

			if (index !== -1) {
				this._myLeagues.leagues[index] = league;
			}
		});
	}

	@action clearLeaguesForJoin = () => {
		this._leaguesForJoin = INITIAL_LEAGUES_FOR_JOIN;
	};
}
