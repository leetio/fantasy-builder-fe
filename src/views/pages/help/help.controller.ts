import {ViewController} from "data/types/structure";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
import {inject, injectable} from "inversify";
import {makeAutoObservable} from "mobx";
import {Bindings} from "bindings";
import {useNavigate} from "react-router-dom";
import {deburr, isEqual, lowerCase, orderBy, sortBy, toLower} from "lodash-es";
import type {
	ISections,
	IStaticContentStore,
	TArticle,
} from "data/stores/static_content/static_content.store";
import type {IModalsStore} from "data/stores/modals/modals.store";

interface IControllerProps {
	navigate: ReturnType<typeof useNavigate>;
	pathname: string;
}

export interface IHelpController extends ViewController<IControllerProps> {
	readonly i18n: ILocalizationStore;
	get tabs(): ISections["sections"];
	get contents(): TArticle[];
	get currentTab(): number | null;

	buildPathName: (pathname: string) => string;
	isActiveTab: (tabId: number) => boolean;
	isContactUs: (tabId: number) => boolean;
	findSectionsById(sectionId: number): TArticle[];
}

@injectable()
export class HelpController implements IHelpController {
	private _currentTab: number | null = null;
	private _navigate!: IControllerProps["navigate"];

	private static rootPath = "/help";

	get tabs() {
		return sortBy(this._staticContentStore.sections, "position");
	}

	get contents() {
		return this._staticContentStore.articles;
	}

	get currentTab() {
		return this._currentTab;
	}

	constructor(
		@inject(Bindings.LocalizationStore) public readonly i18n: ILocalizationStore,
		@inject(Bindings.StaticContentStore)
		private readonly _staticContentStore: IStaticContentStore,
		@inject(Bindings.ModalsStore) private _modalsStore: IModalsStore
	) {
		makeAutoObservable(this);
	}

	public findSectionsById(sectionId: number) {
		const sections =
			this.contents?.filter(
				(article) => article.section_id === sectionId && !article.draft
			) ?? [];

		return orderBy(sections, ["position"], ["asc"]);
	}

	onChange(param: IControllerProps) {
		this.updatePathname(param.pathname);
	}

	private updatePathname = (pathname: string) => {
		const newTab = this.tabs.find((it) =>
			decodeURI(pathname).includes(this.buildPathName(it.name))
		)?.id;

		if (newTab) {
			this.setCurrentTab(newTab);
		}
	};

	public setCurrentTab = (value: number) => {
		this._currentTab = value;
	};

	public isActiveTab = (tab: number) => {
		return isEqual(this._currentTab, tab);
	};

	public isContactUs = (tabId: number) => {
		const sections = this.findSectionsById(tabId);

		return Boolean(
			sections.find(
				({label_names, title}) =>
					label_names.includes("contact_us") || lowerCase(title).includes("contact us")
			)
		);
	};

	public buildPathName = (name: string) => {
		return toLower(deburr(name)).split(" ").join("-");
	};

	async init({navigate, pathname}: IControllerProps) {
		this._navigate = navigate;

		await this._staticContentStore.fetchStaticContent().catch(this._modalsStore.showErrorModal);

		pathname = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

		if (isEqual(pathname, HelpController.rootPath)) {
			const firstTab = this.tabs[0];

			if (!firstTab) return;
			return navigate(this.buildPathName(firstTab.name), {replace: true});
		}

		this.updatePathname(pathname);
	}
}
