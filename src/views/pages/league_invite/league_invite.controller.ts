import {action, makeAutoObservable, observable} from "mobx";
import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import {type ILocalizationStore} from "data/stores/localization/localization.store";
import type {ILeague, ILeaguesStore} from "data/stores/leagues/leagues.store";
import {copyToClipboard, share} from "data/utils";
import {BASE_URL} from "data/constants";
import {ShareType, SocialNetwork} from "data/enums";

interface IProps {
	leagueId: number;
}

export interface ILeagueInviteController extends ViewController<IProps> {
	readonly i18n: ILocalizationStore;

	get league(): ILeague | null;
	get isCodeCopied(): boolean;
	get isMobileShareVisible(): boolean;
	get isLinkCopied(): boolean;

	copyCode: () => void;
	copyLink: () => void;
	shareViaFB: () => void;
	shareViaTW: () => void;
	shareViaMobile: () => void;
}

const DELAY_MS = 5000;

@injectable()
export class LeagueInviteController implements ILeagueInviteController {
	@observable private _isNarrowScreen: boolean = false;
	@observable private _leagueId?: number;
	@observable private _isCodeCopied = false;
	@observable private _isLinkCopied = false;
	@observable private _copyCodeTextTimeout?: ReturnType<typeof setTimeout>;
	@observable private _copyLinkTextTimeout?: ReturnType<typeof setTimeout>;

	get league() {
		if (!this._leagueId) return null;
		return this._leaguesStore.getLeagueById(this._leagueId);
	}

	get isCodeCopied() {
		return this._isCodeCopied;
	}

	get isLinkCopied() {
		return this._isLinkCopied;
	}

	get isMobileShareVisible() {
		return "share" in navigator && this._isNarrowScreen;
	}

	@action private onCopyLinkState = () => {
		this._isLinkCopied = false;
	};

	constructor(
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.LeaguesStore) private _leaguesStore: ILeaguesStore
	) {
		makeAutoObservable(this);
	}

	@action init({leagueId}: IProps) {
		this._leagueId = leagueId;
	}

	private share(socialNetwork: SocialNetwork) {
		const leagueCode = this.league?.code;

		if (!leagueCode) return;

		share({
			leagueCode,
			socialNetwork,
			type: ShareType.GENERAL,
			lang: this.i18n.lang,
			message: this.i18n.t(
				"league_invite.share_text",
				"Come and join my league! The league pin is {{league_pin}}",
				{
					league_pin: this.league?.code,
				}
			),
		});
	}

	shareViaFB = () => this.share(SocialNetwork.FACEBOOK);

	shareViaTW = () => this.share(SocialNetwork.TWITTER);

	shareViaMobile = () => this.share(SocialNetwork.NATIVE);

	@action onChange({leagueId}: IProps) {
		this._leagueId = leagueId;
	}

	@action private onCopyCodeState = () => {
		this._isCodeCopied = false;
	};

	@action private onCopyCodeCallback = (isSuccess: boolean) => {
		this._isCodeCopied = isSuccess;

		if (isSuccess) {
			this._copyCodeTextTimeout = setTimeout(this.onCopyCodeState, DELAY_MS);
		}
	};

	@action copyCode = () => {
		const code = this.league?.code ?? "";

		copyToClipboard(code).then(this.onCopyCodeCallback).catch(this.onCopyCodeCallback);
	};

	@action private onCopyLinkCallback = (isSuccess: boolean) => {
		this._isLinkCopied = isSuccess;

		if (isSuccess) {
			this._copyLinkTextTimeout = setTimeout(this.onCopyLinkState, DELAY_MS);
		}
	};

	@action copyLink = () => {
		const code = this.league?.code ?? "";
		const url = `${window.location.origin}${BASE_URL}leagues/join/${code}`;

		copyToClipboard(url).then(this.onCopyLinkCallback).catch(this.onCopyLinkCallback);
	};
}
