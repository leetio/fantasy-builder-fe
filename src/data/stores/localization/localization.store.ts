import type {ITranslationsJsonProvider} from "data/providers/translations_json/translations_json.provider";
import {inject, injectable} from "inversify";
import {first, get, isEqual, noop} from "lodash-es";
import {action, makeAutoObservable, observable, runInAction} from "mobx";
import {Bindings} from "bindings";
import {Language, Locale} from "data/enums";

type TLocalizationArguments =
	| [key: string, variables?: Record<string, unknown>]
	| [key: string, defaultValue?: string, variables?: Record<string, unknown>];

interface IRequestLocaleParams {
	locale: Locale;
}

enum LangParams {
	CI_MODE = "cimode",
	LAGN = "lang",
}

export interface ILocalizationStore {
	get locale(): Locale;
	get lang(): Language;

	t(...args: TLocalizationArguments): string;
	translate(...args: TLocalizationArguments): string;
	requestTranslations(params: IRequestLocaleParams): Promise<Record<string, unknown>>;
	switchLocale(params: IRequestLocaleParams): Promise<Record<string, unknown>>;
}

@injectable()
export class LocalizationStore implements ILocalizationStore {
	@observable private _translations: Record<string, Record<string, unknown>> = {};
	private _pattern = /{{([\w\s]+)}}/g;
	private _forcedShowKeys = false;

	constructor(
		@inject(Bindings.TranslationsJsonProvider) private _jsonProvider: ITranslationsJsonProvider
	) {
		makeAutoObservable(this);
		/**
		 * It's allows to force the view of translation keys by passing one of the following search path:
		 * /?cimode or /?lang=cimode
		 * It's also allow to view some specific locale by passing it into "lang" search parameter, like
		 * /?lang=en-CA
		 */
		const {CI_MODE} = LangParams;
		this._forcedShowKeys =
			this.urlSearchParams.has(CI_MODE) || isEqual(this.forcedLocale, CI_MODE);
	}

	@observable private _locale: Locale = Locale.EN_US;
	@observable private _language: Language = Language.EN;

	private get urlSearchParams() {
		return new URLSearchParams(window.location.search);
	}

	private get forcedLocale() {
		const locale = this.urlSearchParams.get(LangParams.LAGN) || "";

		try {
			// Try to create a locale. If it's passed, then we have a valid value.
			new Intl.Locale(locale);
			return locale as Locale;
		} catch (error) {
			noop(error);
		}

		return undefined;
	}

	get locale() {
		return this._locale;
	}

	get lang() {
		return this._language;
	}

	@action requestTranslations(params: IRequestLocaleParams): Promise<Record<string, unknown>> {
		this._language = (first(params.locale.split("-")) as Language) || Language.EN;
		return this._jsonProvider.translations(this._language).then((result) => result.data);
	}

	@action
	async switchLocale({locale}: IRequestLocaleParams): Promise<Record<string, unknown>> {
		locale = this.forcedLocale || locale;

		const hasTranslations = Boolean(this._translations[locale]);

		if (hasTranslations) {
			this._locale = locale;
		}

		const result = await this.requestTranslations({locale});

		runInAction(() => {
			this._translations[locale] = result;

			if (!hasTranslations) {
				this._locale = locale;
			}
		});

		return result;
	}

	t(...args: TLocalizationArguments) {
		return this.translate(...args);
	}

	translate(...args: TLocalizationArguments) {
		const [path, args1, args2] = args;

		if (this._forcedShowKeys) return path;

		const defaultValue = typeof args1 === "string" ? args1 : path;
		const variables = typeof args1 === "object" ? args1 : args2;
		const translationsForLocale = this._translations[this._locale];

		const translationStr = get(translationsForLocale, path) ?? defaultValue;

		if (typeof translationStr !== "string") {
			throw Error(
				`Exception: the result of ${path} path must be a string, but got ${typeof translationStr}`
			);
		}

		return translationStr.replace(this._pattern, (_, replaceKey: string) =>
			String(get(variables, replaceKey.trim(), ""))
		);
	}
}
