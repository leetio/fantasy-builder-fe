import {action, makeAutoObservable, observable} from "mobx";
import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
import type {ILeague, ILeaguesStore} from "data/stores/leagues/leagues.store";
import type {IModalsStore} from "data/stores/modals/modals.store";
import {LeagueStatus, ModalType} from "data/enums";
import {isEqual} from "lodash-es";
import {RequestTask} from "data/utils/request_task";

interface IProps {
	leagueId: number;
}

export interface ILeagueAboutController extends ViewController<IProps> {
	readonly i18n: ILocalizationStore;

	get league(): ILeague | null;
	get isLoading(): boolean;
	get isLeagueStarted(): boolean;

	leaveLeague: () => void;
	joinLeague: () => void;
}

@injectable()
export class LeagueAboutController implements ILeagueAboutController {
	@observable private _leagueId?: number;
	@observable private _request = new RequestTask();

	private get leagueID() {
		return this._leagueId!;
	}

	get league() {
		if (!this._leagueId) return null;
		return this._leaguesStore.getLeagueById(this._leagueId);
	}

	get isLoading() {
		return this._request.isLoading;
	}

	get isLeagueStarted() {
		return !isEqual(this.league?.status, LeagueStatus.SCHEDULED);
	}

	constructor(
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.LeaguesStore) private _leaguesStore: ILeaguesStore,
		@inject(Bindings.ModalsStore) private _modalsStore: IModalsStore
	) {
		makeAutoObservable(this);
	}

	@action leaveLeague = () => {
		this._modalsStore.showModal(ModalType.CONFIRM, {
			message: this.i18n.t(
				"league.leave.confirm",
				"Do you really want to leave this league?"
			),
			callback: () => {
				this._modalsStore.hideModal();

				this._request
					.run(() => this._leaguesStore.leaveLeague({leagueId: this.leagueID}))
					.onError(this._modalsStore.showErrorModal);
			},
		});
	};

	@action joinLeague = () => {
		const code = this.league?.code;
		if (!code) return;

		this._request
			.run(() => this._leaguesStore.joinToLeague({code}))
			.onError(this._modalsStore.showErrorModal);
	};

	@action init({leagueId}: IProps) {
		this._leagueId = leagueId;
	}
}
