import {action, makeAutoObservable, observable} from "mobx";
import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
import type {ILeagues, ILeaguesStore} from "data/stores/leagues/leagues.store";
import type {IModalsStore} from "data/stores/modals/modals.store";
import {RequestState} from "data/enums";
import {RequestTask} from "data/utils/request_task";

export interface IMyLeaguesController extends ViewController {
	readonly i18n: ILocalizationStore;

	get leagues(): ILeagues;
	get isLoading(): boolean;

	loadMoreMyLeagues: () => void;
}

@injectable()
export class MyLeaguesController implements IMyLeaguesController {
	@observable _request = new RequestTask(RequestState.PENDING);

	get leagues() {
		return this._leaguesStore.myLeagues;
	}

	get isLoading() {
		return this._request.isLoading;
	}

	constructor(
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.LeaguesStore) private _leaguesStore: ILeaguesStore,
		@inject(Bindings.ModalsStore) private _modalsStore: IModalsStore
	) {
		makeAutoObservable(this);
	}

	loadMoreMyLeagues = () => {
		this._request
			.run(() => this._leaguesStore.fetchMoreMyLeagues())
			.onError(this._modalsStore.showErrorModal);
	};

	@action init() {
		this._request
			.run(() => this._leaguesStore.fetchMyLeagues())
			.onError(this._modalsStore.showErrorModal);
	}
}
