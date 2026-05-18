import {action, makeAutoObservable, observable} from "mobx";
import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import {Bindings} from "bindings";
import {type ILocalizationStore} from "data/stores/localization/localization.store";
import type {ILeague, ILeaguesStore} from "data/stores/leagues/leagues.store";
import {copyToClipboard, share} from "data/utils";
import {ShareType, SocialNetwork} from "data/enums";
import type {SyntheticEvent} from "react";
import {EMAIL_REGEXP} from "data/constants";
import {identity, isEmpty, uniq} from "lodash-es";
import type {AxiosError} from "axios";
import type {IApiResponse} from "data/types/http";
import type {IModalsStore} from "data/stores/modals/modals.store";

export type {ILeague} from "data/stores/leagues/leagues.store";

interface IProps {
	league: ILeague | null;
}

interface IEmailsForm extends HTMLFormElement {
	emails: HTMLInputElement;
}

export interface ILeagueInviteFormController extends ViewController<IProps> {
	readonly i18n: ILocalizationStore;

	get isCodeCopied(): boolean;
	get isEmailsSend(): boolean;
	get isMobileShareVisible(): boolean;
	get areEmailsValid(): boolean;

	copyCode: () => void;
	shareViaFB: () => void;
	shareViaTW: () => void;
	shareViaMobile: () => void;
	handleInvite: (e: SyntheticEvent<IEmailsForm>) => void;
	validateEmailsInput: (event: SyntheticEvent<IEmailsForm>) => string[];
}

const DELAY_MS = 5000;

@injectable()
export class LeagueInviteFormController implements ILeagueInviteFormController {
	@observable private _isNarrowScreen: boolean = false;
	@observable private _league: ILeague | null = null;
	@observable private _isCodeCopied = false;
	@observable private _isEmailsSend = false;
	@observable private _areEmailsValid: boolean = false;
	@observable private _copyCodeTextTimeout?: ReturnType<typeof setTimeout>;
	@observable private _emailsSendTextTimeout?: ReturnType<typeof setTimeout>;

	get isCodeCopied() {
		return this._isCodeCopied;
	}

	get isEmailsSend() {
		return this._isEmailsSend;
	}

	get areEmailsValid() {
		return this._areEmailsValid;
	}

	get isMobileShareVisible() {
		return "share" in navigator && this._isNarrowScreen;
	}

	private get narrowScreenWatcher() {
		return window.matchMedia("(max-width: 960px)");
	}

	constructor(
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.LeaguesStore) private _leaguesStore: ILeaguesStore,
		@inject(Bindings.ModalsStore) private readonly _modalsStore: IModalsStore
	) {
		makeAutoObservable(this);
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

	copyCode = () => {
		const code = this._league?.code ?? "";

		copyToClipboard(code).then(this.onCopyCodeCallback).catch(this.onCopyCodeCallback);
	};

	private share(socialNetwork: SocialNetwork) {
		const leagueCode = this._league?.code;

		if (!leagueCode) return;

		share({
			leagueCode,
			socialNetwork,
			lang: this.i18n.lang,
			type: ShareType.LEAGUE,
		});
	}

	shareViaFB = () => this.share(SocialNetwork.FACEBOOK);

	shareViaTW = () => this.share(SocialNetwork.TWITTER);

	shareViaMobile = () => this.share(SocialNetwork.NATIVE);

	@action private updateNarrowScreenFlag = () => {
		this._isNarrowScreen = this.narrowScreenWatcher.matches;
	};

	@action init(param: IProps) {
		this._league = param.league;

		this.updateNarrowScreenFlag();
		this.narrowScreenWatcher.addEventListener("change", this.updateNarrowScreenFlag);
	}

	@action
	validateEmailsInput = (event: SyntheticEvent<IEmailsForm>) => {
		const emailRegexp = new RegExp(EMAIL_REGEXP);
		const emailsArray = uniq(
			event.currentTarget.emails.value
				.split(",")
				.map((it) => it.trim())
				.filter(identity)
		);
		const hasInvalidEmail = emailsArray.some((email) => !emailRegexp.test(email));

		this._areEmailsValid = !(isEmpty(emailsArray) || hasInvalidEmail);

		return emailsArray;
	};

	@action
	handleInvite = (event: SyntheticEvent<IEmailsForm>) => {
		event.preventDefault();

		if (!this._league) return;

		const emailsArray = this.validateEmailsInput(event);

		if (!this.areEmailsValid) return;

		this._leaguesStore
			.inviteUsersToLeague({
				leagueId: this._league.id,
				invites: emailsArray.map((email) => ({email})),
			})
			.then(this.onSuccessSendEmails)
			.catch((error: AxiosError<IApiResponse>) => {
				this._modalsStore.showErrorModal(error);
			});
	};

	@action private onSendEmailsState = () => {
		this._isEmailsSend = false;
	};

	@action private onSuccessSendEmails = () => {
		this._isEmailsSend = true;
		this._emailsSendTextTimeout = setTimeout(this.onSendEmailsState, DELAY_MS);
	};

	@action onChange(param: IProps) {
		this._league = param.league;
	}

	dispose() {
		this.narrowScreenWatcher.removeEventListener("change", this.updateNarrowScreenFlag);

		if (this._copyCodeTextTimeout) clearTimeout(this._copyCodeTextTimeout);
		if (this._emailsSendTextTimeout) clearTimeout(this._emailsSendTextTimeout);
	}
}
