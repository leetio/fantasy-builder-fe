import {Container, ContainerModule} from "inversify";
import {Bindings} from "bindings";
import {API_URL, CONTENT_JSON_URL, JSON_URL} from "data/constants";
import {type IUserStore, UserStore} from "data/stores/user/user.store";
import {AuthController, type IAuthController} from "views/controllers/auth/auth.controller";
import {
	type IMyAccountController,
	MyAccountController,
} from "views/pages/my_account/my_account.controller";
import {AuthApiProvider, type IAuthApiProvider} from "data/providers/auth_api/auth_api.provider";
import {HttpClientFactory, type IHttpClientService} from "data/services/http";
import {CountriesStore, type ICountriesStore} from "data/stores/countries/countries.store";
import {type IRoundsStore, RoundsStore} from "data/stores/rounds/rounds.store";
import {type IPlayersStore, PlayersStore} from "data/stores/players/players.store";
import {type ISquadsStore, SquadsStore} from "data/stores/squads/squads.store";
import {
	type ISecretGateController,
	SecretGateController,
} from "views/controllers/secret_gate/secret_gate.controller";
import {
	type ILocalizationStore,
	LocalizationStore,
} from "data/stores/localization/localization.store";
import {
	type IStaticContentStore,
	StaticContentStore,
} from "data/stores/static_content/static_content.store";
import {HelpController, type IHelpController} from "views/pages/help/help.controller";
import {
	HelpListController,
	type IHelpListController,
} from "views/components/help/help_list/help_list.controller";
import {
	ContactUsController,
	type IContactUsController,
} from "views/components/help/contact_us/contact_us.controller";
import {ChecksumStore, type IChecksumStore} from "data/stores/checksum/checksum.store";
import {type IUserApiProvider, UserApiProvider} from "data/providers/user_api/user_api.provider";
import {
	type IPasswordApiProvider,
	PasswordApiProvider,
} from "data/providers/password_api/password_api.provider";
import {
	type IResetPasswordController,
	ResetPasswordController,
} from "views/pages/reset_password/reset_password.controller";
import {
	type ISessionController,
	SessionController,
} from "views/components/session/session.controller";
import {
	BootstrapController,
	type IBootstrapController,
} from "views/components/bootstrap/bootstrap.controller";
import {
	type ILeaguesApiProvider,
	LeaguesApiProvider,
} from "data/providers/leagues_api/leagues.api.provider";
import {type ILeaguesStore, LeaguesStore} from "data/stores/leagues/leagues.store";
import {
	type IMyLeaguesController,
	MyLeaguesController,
} from "views/pages/my_leagues/my_leagues.controller";
import {
	type IJoinLeaguesController,
	JoinLeaguesController,
} from "views/controllers/join_leagues/join_leagues.controller";
import {
	CreateLeagueController,
	type ICreateLeagueController,
} from "views/pages/create_league/create_league.controller";
import {type ILeagueController, LeagueController} from "views/pages/league/league.controller";
import {
	type ILeagueInviteController,
	LeagueInviteController,
} from "views/pages/league_invite/league_invite.controller";
import {
	type ILeagueSettingsController,
	LeagueSettingsController,
} from "views/pages/league_settings/league_settings.controller";
import {
	type ILeagueAboutController,
	LeagueAboutController,
} from "views/pages/league_about/league_about.controller";
import {
	type ILeagueInviteFormController,
	LeagueInviteFormController,
} from "views/components/league_invite_form/league_invite_form.controller";
import {type IModalsStore, ModalsStore} from "data/stores/modals/modals.store";
import {
	type ILocalizationController,
	LocalizationController,
} from "views/controllers/localization/localization.controller";
import {
	type ILiveUpdatesStore,
	LiveUpdatesStore,
} from "data/stores/live_updates/live_updates.store";
import {
	type ILeagueCardController,
	LeagueCardController,
} from "views/components/league_card/league_card.controller";
import {
	type ILeaguesSearchController,
	LeaguesSearchController,
} from "views/components/leagues_search/leagues_search.controller";
import {
	type ILeaderboardsApiProvider,
	LeaderboardsApiProvider,
} from "data/providers/leaderboards_api/leaderboards_api.provider";
import {
	type ILeaderboardsStore,
	LeaderboardsStore,
} from "data/stores/leaderboards/leaderboards.store";
import {
	type ILeagueTableController,
	LeagueTableController,
} from "views/pages/league_table/league_table.controller";
import {
	type ILeagueManageController,
	LeagueManageController,
} from "views/pages/league_manage/league_manage.controller";
import {HeaderController, type IHeaderController} from "views/components/header/header.controller";
import {
	type IRegistrationFormController,
	RegistrationFormController,
} from "views/components/registration_form/registration_form.controller";
import {
	type ILoginFormController,
	LoginFormController,
} from "views/components/login_form/login_form.controller";
import {
	ForgotPasswordFormController,
	type IForgotPasswordFormController,
} from "views/components/forgot_password_form/forgot_password_form.controller";
import {type ILandingController, LandingController} from "views/pages/landing/landing.controller";
import {
	DeleteAccountController,
	type IDeleteAccountController,
} from "views/components/delete_account/delete_account.controller";
import {type IModalController, ModalController} from "views/controllers/modal/modal.controller";
import {
	type IHelpContentJsonProvider,
	HelpContentJsonProvider,
} from "data/providers/help_content_json/help_content_json.provider";
import {
	type IPlayersJsonProvider,
	PlayersJsonProvider,
} from "data/providers/players_json/players_json.provider";
import {
	type IRoundsJsonProvider,
	RoundsJsonProvider,
} from "data/providers/rounds_json/rounds_json.provider";
import {
	type ISquadsJsonProvider,
	SquadsJsonProvider,
} from "data/providers/squads_json/squads_json.provider";
import {
	type ICountriesJsonProvider,
	CountriesJsonProvider,
} from "data/providers/countries_json/countries_json.provider";
import {
	type IChecksumsJsonProvider,
	ChecksumsJsonProvider,
} from "data/providers/checksums_json/checksums_json.provider";
import {
	type ITranslationsJsonProvider,
	TranslationsJsonProvider,
} from "data/providers/translations_json/translations_json.provider";

export const DIContainer = new Container();

export const services = new ContainerModule(({bind}) => {
	bind<IHttpClientService>(Bindings.ApiHTTPClient).toConstantValue(
		HttpClientFactory.createApiClient({
			baseURL: API_URL,
			withCredentials: true,
		})
	);

	bind<IHttpClientService>(Bindings.JsonHTTPClient).toConstantValue(
		HttpClientFactory.createJSONClient({
			baseURL: JSON_URL,
		})
	);

	bind<IHttpClientService>(Bindings.ContentJsonHTTPClient).toConstantValue(
		HttpClientFactory.createJSONClient({
			baseURL: CONTENT_JSON_URL,
		})
	);
});

export const providers = new ContainerModule(({bind}) => {
	bind<IAuthApiProvider>(Bindings.AuthApiProvider).to(AuthApiProvider);
	bind<IUserApiProvider>(Bindings.UserApiProvider).to(UserApiProvider);
	bind<IPasswordApiProvider>(Bindings.PasswordApiProvider).to(PasswordApiProvider);
	bind<ILeaguesApiProvider>(Bindings.LeaguesApiProvider).to(LeaguesApiProvider);
	bind<ILeaderboardsApiProvider>(Bindings.LeaderboardsApiProvider).to(LeaderboardsApiProvider);
	bind<IHelpContentJsonProvider>(Bindings.HelpContentJsonProvider).to(HelpContentJsonProvider);
	bind<IPlayersJsonProvider>(Bindings.PlayersJsonProvider).to(PlayersJsonProvider);
	bind<IRoundsJsonProvider>(Bindings.RoundsJsonProvider).to(RoundsJsonProvider);
	bind<ISquadsJsonProvider>(Bindings.SquadsJsonProvider).to(SquadsJsonProvider);
	bind<ICountriesJsonProvider>(Bindings.CountriesJsonProvider).to(CountriesJsonProvider);
	bind<IChecksumsJsonProvider>(Bindings.ChecksumsJsonProvider).to(ChecksumsJsonProvider);
	bind<ITranslationsJsonProvider>(Bindings.TranslationsJsonProvider).to(TranslationsJsonProvider);
});

export const stores = new ContainerModule(({bind}) => {
	bind<ILocalizationStore>(Bindings.LocalizationStore).to(LocalizationStore).inSingletonScope();
	bind<IUserStore>(Bindings.UserStore).to(UserStore).inSingletonScope();
	bind<IRoundsStore>(Bindings.RoundsStore).to(RoundsStore).inSingletonScope();
	bind<IPlayersStore>(Bindings.PlayersStore).to(PlayersStore).inSingletonScope();
	bind<ISquadsStore>(Bindings.SquadsStore).to(SquadsStore).inSingletonScope();

	bind<ICountriesStore>(Bindings.CountriesStore).to(CountriesStore);
	bind<IStaticContentStore>(Bindings.StaticContentStore).to(StaticContentStore);

	bind<IChecksumStore>(Bindings.ChecksumStore).to(ChecksumStore);
	bind<ILiveUpdatesStore>(Bindings.LiveUpdatesStore).to(LiveUpdatesStore);
	bind<ILeaguesStore>(Bindings.LeaguesStore).to(LeaguesStore).inSingletonScope();
	bind<IModalsStore>(Bindings.ModalsStore).to(ModalsStore).inSingletonScope();
	bind<ILeaderboardsStore>(Bindings.LeaderboardsStore).to(LeaderboardsStore).inSingletonScope();
});

export const controllers = new ContainerModule(({bind}) => {
	bind<IAuthController>(Bindings.AuthController).to(AuthController);
	bind<IResetPasswordController>(Bindings.ResetPasswordController).to(ResetPasswordController);
	bind<IMyAccountController>(Bindings.MyAccountController).to(MyAccountController);
	bind<ISecretGateController>(Bindings.SecretGateController).to(SecretGateController);
	bind<IHelpController>(Bindings.HelpController).to(HelpController);
	bind<IHelpListController>(Bindings.HelpListController).to(HelpListController);
	bind<IContactUsController>(Bindings.ContactUsController).to(ContactUsController);
	bind<ISessionController>(Bindings.SessionController).to(SessionController);
	bind<IBootstrapController>(Bindings.BootstrapController).to(BootstrapController);
	bind<IMyLeaguesController>(Bindings.MyLeaguesController).to(MyLeaguesController);
	bind<IJoinLeaguesController>(Bindings.JoinLeaguesController).to(JoinLeaguesController);
	bind<ICreateLeagueController>(Bindings.CreateLeagueController).to(CreateLeagueController);
	bind<ILeagueController>(Bindings.LeagueController).to(LeagueController);
	bind<ILeagueInviteController>(Bindings.LeagueInviteController).to(LeagueInviteController);
	bind<ILeagueSettingsController>(Bindings.LeagueSettingsController).to(LeagueSettingsController);
	bind<ILeagueAboutController>(Bindings.LeagueAboutController).to(LeagueAboutController);
	bind<ILeagueInviteFormController>(Bindings.LeagueInviteFormController).to(
		LeagueInviteFormController
	);
	bind<ILocalizationController>(Bindings.LocalizationController).to(LocalizationController);
	bind<ILeagueCardController>(Bindings.LeagueCardController).to(LeagueCardController);
	bind<ILeaguesSearchController>(Bindings.LeaguesSearchController).to(LeaguesSearchController);
	bind<ILeagueTableController>(Bindings.LeagueTableController).to(LeagueTableController);
	bind<ILeagueManageController>(Bindings.LeagueManageController).to(LeagueManageController);
	bind<IHeaderController>(Bindings.HeaderController).to(HeaderController);
	bind<IRegistrationFormController>(Bindings.RegistrationFormController).to(
		RegistrationFormController
	);
	bind<ILoginFormController>(Bindings.LoginFormController).to(LoginFormController);
	bind<IForgotPasswordFormController>(Bindings.ForgotPasswordFormController).to(
		ForgotPasswordFormController
	);
	bind<ILandingController>(Bindings.LandingController).to(LandingController);
	bind<IDeleteAccountController>(Bindings.DeleteAccountController).to(DeleteAccountController);
	bind<IModalController>(Bindings.ModalController).to(ModalController);
});
