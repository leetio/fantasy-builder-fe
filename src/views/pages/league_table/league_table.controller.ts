import {action, makeAutoObservable, observable} from "mobx";
import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
import {Bindings} from "bindings";
import {SortOrder} from "data/enums";
import type {
	ILeaderboardItem,
	ILeaderboardsStore,
	ILeagueLeaderboardParams,
} from "data/stores/leaderboards/leaderboards.store";
import type {IModalsStore} from "data/stores/modals/modals.store";
import type {IRound, IRoundsStore} from "data/stores/rounds/rounds.store";
import {RequestTask} from "data/utils/request_task";

const {ASC, DESC} = SortOrder;

interface IProps {
	leagueId: number;
}

export interface ILeagueTableController extends ViewController<IProps> {
	readonly i18n: ILocalizationStore;

	get isLoading(): boolean;
	get isLoadingMore(): boolean;
	get rankingsList(): ILeaderboardItem[];
	get nextPage(): boolean;
	get userItem(): ILeaderboardItem | null;
	get rounds(): IRound[];
	get selectedWeekId(): number;
	get currentSortBy(): string;
	get currentOrder(): SortOrder;

	loadMoreUsers: () => void;
	onChangeWeekId: (weekId: number) => void;
	onSortByStat: (stat: string) => void;
}

@injectable()
export class LeagueTableController implements ILeagueTableController {
	@observable private _page = 1;
	@observable private _limit = 50;
	@observable private _mainRequest = new RequestTask();
	@observable private _loadMoreRequest = new RequestTask();
	@observable private _selectedWeekId: number = 0;
	@observable private _leagueId: number = 0;
	@observable private _currentSortBy: string = "overall_points";
	@observable private _currentOrder = ASC;

	constructor(
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.LeaderboardsStore) readonly _leaderboardsStore: ILeaderboardsStore,
		@inject(Bindings.ModalsStore) readonly _modalsStore: IModalsStore,
		@inject(Bindings.RoundsStore) private _roundsStore: IRoundsStore
	) {
		makeAutoObservable(this);
	}

	get isLoading(): boolean {
		return this._mainRequest.isLoading;
	}

	get isLoadingMore(): boolean {
		return this._loadMoreRequest.isLoading;
	}

	get rankingsList(): ILeaderboardItem[] {
		return this._leaderboardsStore.leaderboard.rankings;
	}

	get nextPage(): boolean {
		return this._leaderboardsStore.leaderboard.nextPage;
	}

	get userItem(): ILeaderboardItem | null {
		return this._leaderboardsStore.leaderboard.user;
	}

	get rounds(): IRound[] {
		return this._roundsStore.list;
	}

	get selectedWeekId(): number {
		return this._selectedWeekId;
	}

	get currentSortBy(): string {
		return this._currentSortBy;
	}

	get currentOrder(): SortOrder {
		return this._currentOrder;
	}

	init({leagueId}: IProps) {
		this._leagueId = leagueId;

		void this._fetchLeaderboard();
		void this._roundsStore.fetchRounds();
	}

	private _fetchLeaderboard = () => {
		this._page = 1;

		this._mainRequest
			.run(() => this.requestLeaderboard())
			.onError(this._modalsStore.showErrorModal);
	};

	@action loadMoreUsers = () => {
		this._page = this._page + 1;

		this._loadMoreRequest
			.run(() => this.requestLeaderboardMore())
			.onError(this._modalsStore.showErrorModal);
	};

	private requestLeaderboard() {
		const payload: ILeagueLeaderboardParams = {
			leagueId: this._leagueId || 0,
			page: this._page,
			limit: this._limit,
			order: this._currentSortBy,
			dir: this._currentOrder.toUpperCase(),
		};

		if (this.selectedWeekId) {
			payload.gameWeek = this.selectedWeekId;
		}

		return this._leaderboardsStore.fetchLeagueLeaderboard(payload);
	}

	private async requestLeaderboardMore() {
		const payload: ILeagueLeaderboardParams = {
			leagueId: this._leagueId,
			page: this._page,
			limit: this._limit,
			order: this._currentSortBy,
			dir: this._currentOrder.toUpperCase(),
		};

		if (this.selectedWeekId) {
			payload.gameWeek = this.selectedWeekId;
		}

		await this._leaderboardsStore.fetchLeagueLeaderboard(payload);
	}

	@action onChangeWeekId = (weekId: number) => {
		this._selectedWeekId = weekId;
		void this._fetchLeaderboard();
	};

	@action onSortByStat = (stat: string) => {
		this._currentSortBy = stat;
		this._currentOrder = this._currentOrder === ASC ? DESC : ASC;

		void this.requestLeaderboard();
	};
}
