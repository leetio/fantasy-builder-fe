import {type IReactionDisposer, makeAutoObservable, observable, reaction} from "mobx";
import {inject, injectable} from "inversify";
import {ViewController} from "data/types/structure";
import {Bindings} from "bindings";
import type {IUserStore} from "data/stores/user/user.store";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
import {matchPath} from "react-router-dom";
import {values} from "lodash";
import {useLocation} from "react-router";
import type {IMenuItem, INestedMenuItem} from "data/types/navigation";

type TDrawerMenuItem = IMenuItem | INestedMenuItem;

interface IProps {
	matchPath: typeof matchPath;
	location: ReturnType<typeof useLocation>;
}

export interface IHeaderController extends ViewController<IProps> {
	readonly i18n: ILocalizationStore;

	get isAuthorized(): boolean;
	get activePage(): IMenuItem | undefined;
	get mainMenuItems(): IMenuItem[];

	get drawer(): {
		isOpen: boolean;
		toggle: () => void;
		open: () => void;
		close: () => void;
		menu: TDrawerMenuItem[];
	};
}

@injectable()
export class HeaderController implements IHeaderController {
	@observable private _isDrawerOpened: boolean = false;
	private _disposers: IReactionDisposer[] = [];
	private matchPath?: typeof matchPath;
	private location?: ReturnType<typeof useLocation>;

	get isAuthorized() {
		return this._userStore.isAuthorized;
	}

	get drawer() {
		return {
			isOpen: this._isDrawerOpened,
			toggle: this.toggleDrawer,
			open: this.openDrawer,
			close: this.closeDrawer,
			menu: this.drawerMenuItems,
		};
	}

	private get pages() {
		return {
			home: {
				name: this.i18n.t("navigation.home.copy", "Home"),
				path: "/",
			},
			help: {
				name: this.i18n.t("navigation.help.copy", "Help"),
				path: "/help",
				isEnd: (path: string) => path.includes("prizes"),
			},
			guidelines: {
				name: this.i18n.t("hamburger.guidelines.copy", "Guidelines"),
				path: "/help/rules",
			},
			faq: {
				name: this.i18n.t("hamburger.faqs.copy", "FAQs"),
				path: "/help/faqs",
			},
			terms: {
				name: this.i18n.t("hamburger.terms.copy", "Terms"),
				path: "/help/terms",
			},
			contactUs: {
				name: this.i18n.t("hamburger.contact_us.copy", "Contact us"),
				path: "/help/contact-us",
			},
			prizes: {
				name: this.i18n.t("navigation.help.prizes_copy", "Prizes"),
				path: "/help/prizes",
			},
			leagues: {
				name: this.i18n.t("navigation.leagues.copy", "Leagues"),
				path: "/leagues",
			},
			createLeague: {
				name: this.i18n.t("hamburger.create_leagues.copy", "Create league"),
				path: "/leagues/create",
			},
			joinLeague: {
				name: this.i18n.t("hamburger.join_leagues.copy", "Join league"),
				path: "/leagues/join",
			},
			myAccount: {
				name: this.i18n.t("hamburger.my_account.copy", "My account"),
				path: "/my-account",
			},
			rankings: {
				name: this.i18n.t("navigation.rankings.copy", "Rankings"),
				path: "/rankings",
			},
			logout: {
				name: this.i18n.t("hamburger.logout.copy", "Logout"),
				path: "/logout",
			},
		};
	}

	get mainMenuItems() {
		if (this.isAuthorized) {
			return [
				this.pages.leagues,
				this.pages.rankings,
				{
					...this.pages.prizes,
					isHideOnMobile: true,
				},
				{
					...this.pages.help,
					isHideOnMobile: true,
				},
			];
		}

		return [this.pages.home, this.pages.prizes, this.pages.help];
	}

	get drawerMenuItems() {
		if (this.isAuthorized) {
			return [
				{
					...this.pages.leagues,
					items: [this.pages.leagues, this.pages.createLeague, this.pages.joinLeague],
				},
				this.pages.rankings,
				this.pages.prizes,
				{
					...this.pages.help,
					items: [
						this.pages.guidelines,
						this.pages.faq,
						this.pages.terms,
						this.pages.contactUs,
					],
				},
				this.pages.myAccount,
				this.pages.logout,
			];
		}

		return [
			this.pages.home,
			this.pages.prizes,
			{
				...this.pages.help,
				items: [
					this.pages.guidelines,
					this.pages.faq,
					this.pages.terms,
					this.pages.contactUs,
				],
			},
		];
	}

	get activePage() {
		return values(this.pages).find((page) =>
			this.matchPath?.(this.location?.pathname ?? "/", page.path)
		);
	}

	constructor(
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.UserStore) private _userStore: IUserStore
	) {
		makeAutoObservable(this);
	}

	toggleDrawer = () => {
		this._isDrawerOpened = !this._isDrawerOpened;
	};

	closeDrawer = () => {
		this._isDrawerOpened = false;
	};

	openDrawer = () => {
		this._isDrawerOpened = true;
	};

	init({matchPath, location}: IProps) {
		this.matchPath = matchPath;
		this.location = location;

		this._disposers.push(reaction(() => this.location?.pathname, this.closeDrawer));
	}

	onChange({matchPath, location}: IProps) {
		this.matchPath = matchPath;
		this.location = location;
	}

	dispose() {
		this._disposers.forEach((dispose) => dispose());
	}
}
