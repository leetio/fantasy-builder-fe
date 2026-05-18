import {action, computed, makeAutoObservable, observable, reaction} from "mobx";
import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import {type ILocalizationStore} from "data/stores/localization/localization.store";
import type {IRound, IRoundsStore} from "data/stores/rounds/rounds.store";
import type {ILeague, ILeaguesStore} from "data/stores/leagues/leagues.store";
import type {ChangeEvent, ReactNode} from "react";
import type {SelectChangeEvent} from "@mui/material";
import type {IModalsStore} from "data/stores/modals/modals.store";
import {LeaguePrivacy} from "data/enums";
import {first, identity, values} from "lodash-es";
import {RequestTask} from "data/utils/request_task";

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

export interface ICreateLeagueController extends ViewController {
	readonly i18n: ILocalizationStore;

	get rounds(): IRound[];
	get isLoading(): boolean;
	get isCreateButtonDisabled(): boolean;
	get isFormDisabled(): boolean;
	get tmpLeague(): ILeague | null;
	get formValue(): IFormValue;

	handleCreateLeague: () => void;
	handleFormChange: (event: ChangeEvent<IForm>) => void;
	startRoundChange: (event: SelectChangeEvent<unknown>, _: ReactNode) => void;
}

@injectable()
export class CreateLeagueController implements ICreateLeagueController {
	@observable private _roundsDisposer?: ReturnType<typeof reaction>;
	@observable private _request = new RequestTask();
	@observable private _tmpLeague: ILeague | null = null;
	@observable private _formValue: IFormValue = {
		leagueName: "",
		startId: 0,
		privacy: LeaguePrivacy.PRIVATE,
	};

	get rounds() {
		return this._roundsStore.scheduleRounds;
	}

	get formValue() {
		return this._formValue;
	}

	get isLoading() {
		return this._request.isLoading;
	}

	get isFormDisabled() {
		return Boolean(this.isLoading || this.tmpLeague);
	}

	get isCreateButtonDisabled() {
		return this.isFormDisabled || !this.isFormValid;
	}

	get tmpLeague() {
		return this._tmpLeague;
	}

	@computed private get isFormValid() {
		return values(this._formValue).every(identity);
	}

	constructor(
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.RoundsStore) private _roundsStore: IRoundsStore,
		@inject(Bindings.LeaguesStore) private _leaguesStore: ILeaguesStore,
		@inject(Bindings.ModalsStore) private _modalsStore: IModalsStore
	) {
		makeAutoObservable(this);
	}

	@action private onSuccessLeagueCreate = (league: ILeague) => {
		this._tmpLeague = league;
	};

	handleCreateLeague = () => {
		const {leagueName, startId, privacy} = this._formValue;

		this._request
			.run(() =>
				this._leaguesStore.createLeague({
					privacy,
					startId,
					name: leagueName,
				})
			)
			.onSuccess(this.onSuccessLeagueCreate)
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

	@action init() {
		this._request
			.run(() => this._roundsStore.fetchRounds())
			.onError(this._modalsStore.showErrorModal);

		this._roundsDisposer = reaction(
			() => this.rounds,
			() => {
				const roundID = first(this.rounds)?.id;

				if (roundID) {
					this._formValue.startId = roundID;
				}
			}
		);
	}

	dispose() {
		this._roundsDisposer?.();
	}
}
