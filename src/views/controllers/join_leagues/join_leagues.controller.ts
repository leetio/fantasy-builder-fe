import {action, makeAutoObservable, observable} from "mobx";
import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
import type {ILeagues, ILeaguesStore} from "data/stores/leagues/leagues.store";
import type {AxiosError} from "axios";
import type {IApiResponse} from "data/types/http";
import type {IModalsStore} from "data/stores/modals/modals.store";
import {find} from "lodash-es";
import {useNavigate} from "react-router-dom";
import {RequestTask} from "data/utils/request_task";

interface IProps {
	code?: string;
	navigate: ReturnType<typeof useNavigate>;
}

export interface IJoinLeaguesController extends ViewController<IProps> {
	readonly i18n: ILocalizationStore;

	get leagues(): ILeagues;
	get isLoading(): boolean;

	loadMoreMyLeagues: () => void;
	joinLeague: (id: number) => void;
	isJoinInProgress: (id: number) => boolean;
}

@injectable()
export class JoinLeaguesController implements IJoinLeaguesController {
	@observable _request = new RequestTask();
	@observable _joiningLeagueId?: number;
	@observable _navigate?: ReturnType<typeof useNavigate>;

	get leagues() {
		return this._leaguesStore.leaguesForJoin;
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
		this._leaguesStore.fetchMoreLeaguesForJoin().then(this.onSuccess).catch(this.onError);
	};

	@action private onSuccess = () => {
		this._joiningLeagueId = undefined;
	};

	@action private onError = (error: AxiosError<IApiResponse>) => {
		this._joiningLeagueId = undefined;
		this._modalsStore.showErrorModal(error);
	};

	@action joinLeague = (id: number) => {
		const code = find(this.leagues.leagues, {id})?.code;

		if (!code) return;

		this._joiningLeagueId = id;

		this._request
			.run(() => this._leaguesStore.joinToLeague({code}))
			.onSuccess(() => this.redirectToMyLeagueByCode({code}))
			.onError(this.onError);
	};

	isJoinInProgress = (id: number) => {
		return this._joiningLeagueId === id;
	};

	private redirectToMyLeagueByCode = ({
		code,
		replace = false,
	}: {
		code: string;
		replace?: boolean;
	}) => {
		const {leagues} = this._leaguesStore.myLeagues;
		const id = find(leagues, {code})?.id;

		if (id) {
			/**
			 * Workaround for the following issue
			 * https://github.com/remix-run/react-router/issues/12348
			 * https://github.com/remix-run/react-router/blob/main/CHANGELOG.md#exposed-router-promises
			 */
			void Promise.resolve(this._navigate?.(`/leagues/${id}/`, {replace}));
		}
	};

	@action init({code, navigate}: IProps) {
		this._navigate = navigate;

		if (code) {
			this._request
				.run(() => this._leaguesStore.joinToLeague({code}))
				.onSuccess(() =>
					this.redirectToMyLeagueByCode({
						code,
						replace: true,
					})
				)
				.onError(this.onError);
		}
	}
}
