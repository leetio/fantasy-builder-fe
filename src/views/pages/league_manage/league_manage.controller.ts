import {action, makeAutoObservable, observable} from "mobx";
import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
import type {ILeague, ILeaguesStore, ILeagueUsers} from "data/stores/leagues/leagues.store";
import type {IRound} from "data/stores/rounds/rounds.store";
import type {IUserStore} from "data/stores/user/user.store";
import type {IModalsStore} from "data/stores/modals/modals.store";
import {LeagueStatus} from "data/enums";
import {isEqual} from "lodash-es";
import {RequestTask} from "data/utils/request_task";

interface IParams {
	leagueId: number;
}

export interface ILeagueManageController extends ViewController<IParams> {
	readonly i18n: ILocalizationStore;

	get userID(): number;
	get league(): ILeague | null;
	get leagueUsers(): ILeagueUsers | null;
	get isLeagueStarted(): boolean;
	get isLoading(): boolean;

	loadMoreUsers: () => void;
	removeUser: (userId: number) => void;
}

@injectable()
export class LeagueManageController implements ILeagueManageController {
	@observable _request = new RequestTask();

	@observable private _leagueId?: number;

	private get leagueID() {
		return this._leagueId!;
	}

	get userID() {
		return this._userStore.user!.id;
	}

	get isLoading(): boolean {
		return this._request.isLoading;
	}

	get leagueUsers() {
		if (!this._leagueId) return null;
		return this._leaguesStore.getLeagueUsersByLeagueId(this._leagueId);
	}

	get league() {
		if (!this._leagueId) return null;
		return this._leaguesStore.getLeagueById(this._leagueId);
	}

	get isLeagueStarted() {
		return !isEqual(this.league?.status, LeagueStatus.SCHEDULED);
	}

	constructor(
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.RoundsStore) private _roundsStore: IRound,
		@inject(Bindings.LeaguesStore) private _leaguesStore: ILeaguesStore,
		@inject(Bindings.UserStore) private _userStore: IUserStore,
		@inject(Bindings.ModalsStore) private _modalsStore: IModalsStore
	) {
		makeAutoObservable(this);
	}

	@action loadMoreUsers = () => {
		this._request
			.run(() => this._leaguesStore.fetchMoreLeagueUsers({leagueId: this.leagueID}))
			.onError(this._modalsStore.showErrorModal);
	};

	@action removeUser = (_userId: number) => {
		// const userName =
		// 	this.leagueUsers?.users.find((user) => user.userId === userId)?.displayName ||
		// 	"this user";
		// this._modalsStore.showModal(ModalType.CONFIRM_ALERT, {
		// 	confirmButtonCopy: this.i18n.t("league.leave.confirm", "Yes, Remove"),
		// 	showCancel: true,
		// 	message: this.i18n.t(
		// 		"league_setting.manage_user.confirm_remove",
		// 		`You are removing <strong>${userName}</strong>. <br/> This action cannot be reversed.`,
		// 		{
		// 			X: userName,
		// 		}
		// 	),
		// 	callback: () => {
		// 		this._modalsStore.hideModal();
		//
		// 		void this._leaguesStore.removeUserFromLeague({userId, leagueId: this.leagueID});
		// 	},
		// });
	};

	@action init({leagueId}: IParams) {
		this._leagueId = leagueId;

		this._request
			.run(() => this._leaguesStore.fetchLeagueUsers({leagueId}))
			.onError(this._modalsStore.showErrorModal);
	}
}
