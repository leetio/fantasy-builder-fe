import {injectable, inject} from "inversify";
import {computed, makeAutoObservable} from "mobx";
import {LandingController} from "views/pages/landing/landing.controller";
import {Bindings} from "bindings";
import type {ILocalizationStore} from "data/stores/localization/localization.store";
import type {IUserStore} from "data/stores/user/user.store";
import type {IModalsStore} from "data/stores/modals/modals.store";

/**
 * Super Rugby specific Landing Controller override
 * Provides rugby-specific landing page content and features
 */
@injectable()
export class SuperRugbyLandingController extends LandingController {
	constructor(
		@inject(Bindings.LocalizationStore) readonly i18n: ILocalizationStore,
		@inject(Bindings.UserStore) private _userStore: IUserStore,
		@inject(Bindings.ModalsStore) private _modalsStore: IModalsStore
	) {
		super(i18n, _userStore, _modalsStore);
		makeAutoObservable(this);
	}

	/** Super Rugby branding title */
	@computed get gameTitle(): string {
		return this.i18n.t(
			"landing.super_rugby.title",
			"Fantasy Super Rugby 2026"
		);
	}

	/** Rugby-specific tagline */
	@computed get tagline(): string {
		return this.i18n.t(
			"landing.super_rugby.tagline",
			"Build Your Ultimate Rugby Dream Team"
		);
	}

	/** Main description */
	@computed get description(): string {
		return this.i18n.t(
			"landing.super_rugby.description",
			"Compete with rugby fans worldwide. Pick your squad, manage your team, and climb the leaderboards in the 2026 Super Rugby season."
		);
	}

	/** Step 1: Pick Your Squad */
	@computed get step1Title(): string {
		return this.i18n.t("landing.super_rugby.step1.title", "Pick Your Squad");
	}

	@computed get step1Description(): string {
		return this.i18n.t(
			"landing.super_rugby.step1.description",
			"Select 23 players within a $100M salary cap. Choose from props, hookers, backs, and more."
		);
	}

	/** Step 2: Set Your Formation */
	@computed get step2Title(): string {
		return this.i18n.t("landing.super_rugby.step2.title", "Set Your Formation");
	}

	@computed get step2Description(): string {
		return this.i18n.t(
			"landing.super_rugby.step2.description",
			"Arrange your 15-player lineup and 8-player bench. Pick your captain for double points."
		);
	}

	/** Step 3: Compete & Win */
	@computed get step3Title(): string {
		return this.i18n.t("landing.super_rugby.step3.title", "Compete & Win");
	}

	@computed get step3Description(): string {
		return this.i18n.t(
			"landing.super_rugby.step3.description",
			"Join leagues, track live scores, make transfers, and dominate the rankings all season long."
		);
	}

	/** Call to action button text */
	@computed get ctaButtonText(): string {
		return this.i18n.t("landing.super_rugby.cta", "Start Playing Now");
	}

	/** Features list */
	@computed get features(): string[] {
		return [
			this.i18n.t("landing.super_rugby.feature1", "Live scoring and stats"),
			this.i18n.t("landing.super_rugby.feature2", "Weekly transfers"),
			this.i18n.t("landing.super_rugby.feature3", "Private & public leagues"),
			this.i18n.t("landing.super_rugby.feature4", "Head-to-head battles"),
			this.i18n.t("landing.super_rugby.feature5", "Power-ups and boosters"),
			this.i18n.t("landing.super_rugby.feature6", "Mobile app support"),
		];
	}

	/** Game rules summary */
	@computed get quickFacts(): Array<{label: string; value: string}> {
		return [
			{
				label: this.i18n.t("landing.super_rugby.facts.salary_cap", "Salary Cap"),
				value: "$100M",
			},
			{
				label: this.i18n.t("landing.super_rugby.facts.team_size", "Team Size"),
				value: "23 players",
			},
			{
				label: this.i18n.t("landing.super_rugby.facts.rounds", "Season Rounds"),
				value: "16",
			},
			{
				label: this.i18n.t("landing.super_rugby.facts.max_per_squad", "Max per Squad"),
				value: "4",
			},
		];
	}
}
