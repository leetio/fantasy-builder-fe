import {ViewController} from "data/types/structure";
import {inject, injectable} from "inversify";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
/**
 * It's the only place where we allow direct access to the service from the controller,
 * and not via store, as it's set globally available value.
 */
// eslint-disable-next-line boundaries/element-types
import type {IHttpClientService} from "data/services/http";
import {Locale} from "data/enums";
import {Bindings} from "bindings";
import {makeAutoObservable, runInAction} from "mobx";
import {noop} from "lodash-es";

export interface IBootstrapController extends ViewController {
	get isReady(): boolean;
}

@injectable()
export class BootstrapController implements IBootstrapController {
	private _userLocale: Locale = navigator.language as Locale;
	private _isReady = false;

	constructor(
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.ApiHTTPClient) private _apiHTTPClient: IHttpClientService
	) {
		makeAutoObservable(this);
	}

	get isReady(): boolean {
		return this._isReady;
	}

	/**
	 * The method is to define a user's locale. It can be done by:
	 * 1) navigator.language
	 * 2) Site URL
	 * 3) Some JSON or API request settings
	 * 4) Whatever else
	 */
	private async defineLocale(): Promise<Locale> {
		this._userLocale = await Promise.resolve(Locale.EN_US);
		return this._userLocale;
	}

	async init() {
		try {
			await this.i18n.switchLocale({
				locale: await this.defineLocale(),
			});
		} catch (error) {
			noop(error);
		}

		// Set locale that will be appended to each request
		this._apiHTTPClient.setLocale(this.i18n.lang);

		runInAction(() => {
			this._isReady = true;
		});
	}
}
