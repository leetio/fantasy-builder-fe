import {action, computed, makeAutoObservable, observable, reaction} from "mobx";
import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
import type {ILeague, ILeaguesStore} from "data/stores/leagues/leagues.store";
import type {IUserStore} from "data/stores/user/user.store";
import type {AxiosError} from "axios";
import type {IApiResponse} from "data/types/http";
import type {IModalsStore} from "data/stores/modals/modals.store";
import {isEqual} from "lodash-es";
import {useLocation, useNavigate} from "react-router-dom";
import {RequestTask} from "data/utils/request_task";

interface IProps {
	leagueId: number;
	location: ReturnType<typeof useLocation>;
	navigate: ReturnType<typeof useNavigate>;
}

interface ITab {
	path: string;
	name: string;
}

export interface ILeagueController extends ViewController<IProps> {
	readonly i18n: ILocalizationStore;

	get league(): ILeague | null;
	get isLoading(): boolean;
	get isCommissioner(): boolean;
	get tabs(): ITab[];
	get activeIndex(): number;
}

@injectable()
export class LeagueController implements ILeagueController {
	@observable private _location?: ReturnType<typeof useLocation>;
	@observable private _navigate?: ReturnType<typeof useNavigate>;
	@observable private _fetchLeagueDisposer?: ReturnType<typeof reaction>;
	@observable private _leagueId?: number;
	@observable private _request = new RequestTask();

	get tabs() {
		if (!this.league) return [];

		const id = this.league.id;

		const tabs = [
			{
				path: `/leagues/${id}/ladder`,
				name: this.i18n.t("league.nav.tab.ladder", "Ladder"),
			},
			{
				path: `/leagues/${id}/invite`,
				name: this.i18n.t("league.nav.tab.invite", "Invite"),
			},
		];

		if (this.isCommissioner) {
			tabs.push({
				path: `/leagues/${id}/manage`,
				name: this.i18n.t("league.nav.tab.manage", "Manage"),
			});
			tabs.push({
				path: `/leagues/${id}/settings`,
				name: this.i18n.t("league.nav.tab.settings", "Settings"),
			});
		} else {
			tabs.push({
				path: `/leagues/${id}/about`,
				name: this.i18n.t("league.nav.tab.about", "About"),
			});
		}

		return tabs;
	}

	@computed get activeIndex() {
		const index = this.tabs.findIndex((tab) => isEqual(tab.path, this._location?.pathname));

		return index === -1 ? 0 : index;
	}

	get league() {
		if (!this._leagueId) return null;
		return this._leaguesStore.getLeagueById(this._leagueId);
	}

	get isCommissioner() {
		return isEqual(this.league?.leagueManager?.userId, this._userStore.user!.id);
	}

	get isLoading() {
		return this._request.isLoading;
	}

	constructor(
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.LeaguesStore) private _leaguesStore: ILeaguesStore,
		@inject(Bindings.UserStore) private _userStore: IUserStore,
		@inject(Bindings.ModalsStore) private _modalsStore: IModalsStore
	) {
		makeAutoObservable(this);
	}

	@action onSuccessLeagueRequest = () => {
		const hasValidTab = this.tabs.some((tab) => isEqual(tab.path, this._location?.pathname));

		if (!hasValidTab) {
			const path = this.isCommissioner ? "settings" : "about";
			/**
			 * Workaround for the following issue
			 * https://github.com/remix-run/react-router/issues/12348
			 * https://github.com/remix-run/react-router/blob/main/CHANGELOG.md#exposed-router-promises
			 */
			void Promise.resolve(
				this._navigate?.(`/leagues/${this._leagueId!}/${path}`, {replace: true})
			);
		}
	};

	@action onError = (error: AxiosError<IApiResponse>) => {
		this._modalsStore.showErrorModal(error);
	};

	@action onChange({leagueId, navigate, location}: IProps) {
		this._leagueId = leagueId;
		this._location = location;
		this._navigate = navigate;
	}

	@action init(params: IProps) {
		this.onChange(params);

		this._fetchLeagueDisposer = reaction(
			() => this._leagueId,
			(leagueId) => {
				if (!leagueId) return;

				this._request
					.run(() => this._leaguesStore.fetchLeague({leagueId}))
					.onSuccess(this.onSuccessLeagueRequest)
					.onError(this._modalsStore.showErrorModal);
			},
			{fireImmediately: true}
		);
	}

	dispose() {
		this._fetchLeagueDisposer?.();
	}
}
