import {action, makeAutoObservable, observable} from "mobx";
import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
import type {IModalsStore} from "data/stores/modals/modals.store";
import type {ILeaguesStore} from "data/stores/leagues/leagues.store";
import type {ChangeEvent} from "react";
import {ViewController} from "data/types/structure";
import {RequestTask} from "data/utils/request_task";

export interface ILeaguesSearchController extends ViewController {
	readonly i18n: ILocalizationStore;

	get isLoading(): boolean;
	get searchValue(): string;

	onSearchLeagueForJoinChange: (event: ChangeEvent<HTMLInputElement>) => void;
	onSearchMyLeague: (event: ChangeEvent<HTMLInputElement>) => void;
}

const DELAY_MS = 500;

@injectable()
export class LeaguesSearchController implements ILeaguesSearchController {
	@observable private _searchTimer: ReturnType<typeof setTimeout> | undefined;
	@observable private _searchValue: string = "";
	@observable private _request = new RequestTask();

	get isLoading() {
		return this._request.isLoading;
	}

	get searchValue() {
		return this._searchValue;
	}

	constructor(
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.LeaguesStore) private _leaguesStore: ILeaguesStore,
		@inject(Bindings.ModalsStore) private _modalsStore: IModalsStore
	) {
		makeAutoObservable(this);
	}

	@action onSearchLeagueForJoinChange = (event: ChangeEvent<HTMLInputElement>): void => {
		const {name, value} = event.currentTarget;
		const MIN_SEARCH_LENGTH = 3;

		if (!name) return;

		this._searchValue = value;

		if (value.length < MIN_SEARCH_LENGTH) return;

		clearTimeout(this._searchTimer);

		this._searchTimer = setTimeout(() => {
			this._leaguesStore
				.fetchLeaguesForJoin({
					search: this._searchValue,
				})
				.catch(this._modalsStore.showErrorModal);
		}, DELAY_MS);
	};

	@action onSearchMyLeague = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const {name, value} = event.currentTarget;

		if (!name) return;

		if (value === "") {
			this._leaguesStore.clearLeaguesForJoin();
			this._searchValue = "";
			return;
		}

		this._searchValue = value;

		clearTimeout(this._searchTimer);

		this._searchTimer = setTimeout(() => {
			this._leaguesStore
				.fetchMyLeagues({
					search: this._searchValue,
				})
				.catch(this._modalsStore.showErrorModal);
		}, DELAY_MS);
	};
}
