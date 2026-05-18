import {makeAutoObservable, observable} from "mobx";
import {inject, injectable} from "inversify";
import {ViewController} from "data/types/structure";
import {type ILeague} from "data/stores/leagues/leagues.store";
import {type ILocalizationStore} from "data/stores/localization/localization.store";
import {Bindings} from "bindings";
import {LeagueStatus, LeagueType} from "data/enums";
import type {IUserStore} from "data/stores/user/user.store";

export type {ILeague} from "data/stores/leagues/leagues.store";

interface IController {
	league: ILeague;
}

export interface ILeagueCardController extends ViewController<IController> {
	readonly i18n: ILocalizationStore;

	get isManagerShow(): boolean;
	get leagueLink(): string;
}

@injectable()
export class LeagueCardController implements ILeagueCardController {
	@observable _league: ILeague | undefined = undefined;

	constructor(
		@inject(Bindings.UserStore) private _userStore: IUserStore,
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore
	) {
		makeAutoObservable(this);
	}

	get isManagerShow() {
		return Boolean(
			this._league?.class === LeagueType.REGULAR && this._league.leagueManager?.displayName
		);
	}

	get leagueLink() {
		if (!this._league?.id) {
			return "/leagues";
		}

		const {id, leagueManager, status} = this._league;

		const preSeasonLink =
			this._userStore.user?.id === leagueManager?.userId
				? `/leagues/${id}/settings`
				: `/leagues/${id}/about`;

		return status === LeagueStatus.SCHEDULED ? preSeasonLink : `/leagues/${id}/ladder`;
	}

	init(param: IController): void {
		this._league = param.league;
	}
}
