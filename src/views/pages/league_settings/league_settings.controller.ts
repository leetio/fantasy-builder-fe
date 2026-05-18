import {action, computed, makeAutoObservable, observable, reaction} from "mobx";
import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
import type {IRound, IRoundsStore} from "data/stores/rounds/rounds.store";
import type {
	ILeague,
	ILeaguesStore,
	ILeagueUsers,
	TUpdateLeaguePayload,
} from "data/stores/leagues/leagues.store";
import type {ChangeEvent, ReactNode} from "react";
import type {SelectChangeEvent} from "@mui/material";
import type {IUserStore} from "data/stores/user/user.store";
import type {IModalsStore} from "data/stores/modals/modals.store";
import {identity, isEqual, values} from "lodash-es";
import {LeaguePrivacy, LeagueStatus, ModalType, RoundStatus} from "data/enums";
import {RequestTask} from "data/utils/request_task";

interface IProps {
	leagueId: number;
}

interface IForm extends HTMLFormElement {
	leagueName: HTMLInputElement;
	startId: HTMLInputElement;
	privacy: HTMLInputElement;
}

interface IFormValue {
	leagueName: string;
	startId: number;
	privacy: LeaguePrivacy;
}

export interface ILeagueSettingsController extends ViewController<IProps> {
	readonly i18n: ILocalizationStore;

	get userID(): number;
	get league(): ILeague | null;
	get rounds(): IRound[];
	get isLoading(): boolean;
	get isLeaguePresenceRequestLoading(): boolean;
	get isLeagueUsersRequestLoading(): boolean;
	get isUpdateButtonDisabled(): boolean;
	get isLeagueNameFieldDisabled(): boolean;
	get isLeagueStarted(): boolean;
	get isFormDisabled(): boolean;
	get formValue(): IFormValue;
	get leagueUsers(): ILeagueUsers | null;

	handleUpdateLeague: () => void;
	handleFormChange: (event: ChangeEvent<IForm>) => void;
	startRoundChange: (event: SelectChangeEvent<unknown>, _: ReactNode) => void;
	leaveLeague: () => void;
	joinLeague: () => void;
	loadMoreUsers: () => void;
	removeUser: (userId: number) => void;
}

@injectable()
export class LeagueSettingsController implements ILeagueSettingsController {
	@observable private _leagueId?: number;
	@observable private _leagueDisposer?: ReturnType<typeof reaction>;

	@observable private _requests = {
		general: new RequestTask(),
		leaguePresence: new RequestTask(),
		leagueUsers: new RequestTask(),
		removeUser: new RequestTask(),
	};

	@observable private _formValue: IFormValue = {
		leagueName: "",
		startId: 0,
		privacy: LeaguePrivacy.PRIVATE,
	};

	private get leagueID() {
		return this._leagueId!;
	}

	get userID() {
		return this._userStore.user!.id;
	}

	get league() {
		if (!this._leagueId) return null;
		return this._leaguesStore.getLeagueById(this._leagueId);
	}

	get leagueUsers() {
		if (!this._leagueId) return null;
		return this._leaguesStore.getLeagueUsersByLeagueId(this._leagueId);
	}

	@computed get rounds() {
		return this._roundsStore.list.filter((round) => {
			const isScheduled = isEqual(round.status, RoundStatus.SCHEDULED);
			const isLeagueStartRound = isEqual(this.league?.startId, round.id);

			return isScheduled || isLeagueStartRound;
		});
	}

	get formValue() {
		return this._formValue;
	}

	get isLoading() {
		return this._requests.general.isLoading;
	}

	get isLeaguePresenceRequestLoading() {
		return this._requests.leaguePresence.isLoading;
	}

	get isLeagueUsersRequestLoading() {
		return this._requests.leagueUsers.isLoading;
	}

	get isFormDisabled() {
		return this.isLoading || this.isLeagueStarted;
	}

	get isLeagueNameFieldDisabled() {
		return this.isLoading;
	}

	get isLeagueStarted() {
		return !isEqual(this.league?.status, LeagueStatus.SCHEDULED);
	}

	get isUpdateButtonDisabled() {
		if (this.isLeagueStarted) return !this.isFormValid;
		return this.isFormDisabled || !this.isFormValid;
	}

	@computed private get isFormValid() {
		return values(this._formValue).every(identity);
	}

	constructor(
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.RoundsStore) private _roundsStore: IRoundsStore,
		@inject(Bindings.LeaguesStore) private _leaguesStore: ILeaguesStore,
		@inject(Bindings.UserStore) private _userStore: IUserStore,
		@inject(Bindings.ModalsStore) private _modalsStore: IModalsStore
	) {
		makeAutoObservable(this);
	}

	handleUpdateLeague = () => {
		const {leagueName, startId, privacy} = this._formValue;

		const payload: TUpdateLeaguePayload = {
			name: leagueName,
			leagueId: this.leagueID,
		};

		if (!this.isLeagueStarted) {
			payload.privacy = privacy;
			payload.startId = startId;
		}

		this._requests.general
			.run(() => this._leaguesStore.updateLeague(payload))
			.onError(this._modalsStore.showErrorModal);
	};

	@action handleFormChange = (event: ChangeEvent<IForm>) => {
		const {leagueName, privacy} = event.currentTarget;

		this._formValue.leagueName = leagueName.value;
		this._formValue.privacy = privacy.value as LeaguePrivacy;
	};

	@action startRoundChange = (event: SelectChangeEvent<unknown>, _: ReactNode) => {
		this._formValue.startId = Number(event.target.value);
	};

	@action leaveLeague = () => {
		this._modalsStore.showModal(ModalType.CONFIRM, {
			message: this.i18n.t(
				"league.leave.confirm",
				"Do you really want to leave this league?"
			),
			callback: () => {
				this._modalsStore.hideModal();
				this._requests.leaguePresence
					.run(() => this._leaguesStore.leaveLeague({leagueId: this.leagueID}))
					.onSuccess(() => {
						void this._leaguesStore.fetchLeagueUsers({leagueId: this.leagueID});
					})
					.onError(this._modalsStore.showErrorModal);
			},
		});
	};

	@action joinLeague = () => {
		const code = this.league?.code;

		if (!code) return;

		this._requests.leaguePresence
			.run(() => this._leaguesStore.joinToLeague({code}))
			.onSuccess(() => {
				void this._leaguesStore.fetchLeagueUsers({leagueId: this.leagueID});
			})
			.onError(this._modalsStore.showErrorModal);
	};

	@action loadMoreUsers = () => {
		this._requests.leagueUsers
			.run(() => this._leaguesStore.fetchMoreLeagueUsers({leagueId: this.leagueID}))
			.onError(this._modalsStore.showErrorModal);
	};

	@action removeUser = (userId: number) => {
		this._modalsStore.showModal(ModalType.CONFIRM, {
			message: this.i18n.t(
				"league_setting.manage_user.confirm_remove",
				"Do you really want to remove this user from the league?"
			),
			callback: () => {
				this._modalsStore.hideModal();
				this._requests.removeUser
					.run(() =>
						this._leaguesStore.removeUserFromLeague({userId, leagueId: this.leagueID})
					)
					.onError(this._modalsStore.showErrorModal);
			},
		});
	};

	@action init({leagueId}: IProps) {
		this._leagueId = leagueId;

		this._requests.general
			.run(() =>
				Promise.all([
					this._roundsStore.fetchRounds(),
					this._leaguesStore.fetchLeagueUsers({leagueId}),
				])
			)
			.onError(this._modalsStore.showErrorModal);

		this._leagueDisposer = reaction(
			() => this.league,
			() => {
				if (!this.league) return;

				const {startId, name, privacy} = this.league;

				this._formValue.startId = startId;
				this._formValue.leagueName = name;
				this._formValue.privacy = privacy;
			},
			{fireImmediately: true}
		);
	}

	dispose() {
		this._leagueDisposer?.();
	}
}
