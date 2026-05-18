import {inject, injectable} from "inversify";
import {computed, makeAutoObservable, observable, runInAction} from "mobx";
import {Bindings} from "bindings";
import type {
	IArticles,
	IHelpContentJsonProvider,
	ISections,
} from "data/providers/help_content_json/help_content_json.provider";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
import {includes, toLower} from "lodash-es";

export type {
	ISections,
	IArticles,
	ICategories,
	IStaticContentPayload,
} from "data/providers/help_content_json/help_content_json.provider";

export type TArticle = IArticles["articles"][number];

export interface IStaticContentStore {
	get sections(): ISections["sections"];
	get articles(): IArticles["articles"];

	fetchStaticContent(): Promise<void>;
}

@injectable()
export class StaticContentStore implements IStaticContentStore {
	@observable private _helpSections?: ISections["sections"];
	@observable private _helpComponents?: IArticles["articles"];

	@computed get sections() {
		return this._helpSections ?? [];
	}

	@computed get articles() {
		return this._helpComponents ?? [];
	}

	constructor(
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.HelpContentJsonProvider)
		private readonly _jsonProvider: IHelpContentJsonProvider
	) {
		makeAutoObservable(this);
	}

	public async fetchStaticContent() {
		const locale = (this.i18n.locale || "en-US").toLowerCase();

		// {per_page: 100} - hardcode to get max amount of content without pagination
		const [categories, sections, articles] = await Promise.all([
			this._jsonProvider.helpCategories({locale, per_page: 100}),
			this._jsonProvider.helpSections({locale, per_page: 100}),
			this._jsonProvider.helpArticles({locale, per_page: 100}),
		]);

		const helpComponentsId = categories.data.categories?.find(({name}) =>
			includes(toLower(name), "help")
		)?.id;

		runInAction(() => {
			this._helpSections = sections.data.sections?.filter(
				(section) => section.category_id === helpComponentsId
			);

			this._helpComponents = articles.data.articles;
		});
	}
}
